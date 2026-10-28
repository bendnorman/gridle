import { renderChart, renderLegend, renderTable } from "./chart.js";

const MAX_GUESSES = 5;
const FIRST_DAY = "2022-06-14"; // Gridle #1
const MAX_MILES = 5000; // about as far apart as two states get (Hawaii to Maine)
const ARROWS = ["↑", "↗", "→", "↘", "↓", "↙", "←", "↖"]; // N, NE, E, ...
const ARROW_EMOJI = ["⬆️", "↗️", "➡️", "↘️", "⬇️", "↙️", "⬅️", "↖️"]; // for share text

const $ = (id) => document.getElementById(id);

const data = await (await fetch("states.json")).json();
const codes = Object.keys(data.states).sort();
const byName = Object.fromEntries(codes.map((c) => [data.states[c].name.toLowerCase(), c]));

// Today's puzzle. `?state=TX` previews a specific state without saving anything.
const preview = new URLSearchParams(location.search).get("state")?.toUpperCase();
const day = daysSince(FIRST_DAY);
const puzzleNumber = day + 1;
const answer = data.states[preview] ? preview : dailyState(day);
const storageKey = data.states[preview] ? null : `gridle-${puzzleNumber}`;

let guesses = load(storageKey);
let mode = "twh";

// --- Chart -----------------------------------------------------------------

const chartData = { years: data.years, fuels: data.fuels, twh: data.states[answer].twh };
const drawChart = () => renderChart($("chart"), chartData, mode);

$("chart-title").textContent = `Yearly net generation by fuel, ${data.years[0]}–${data.years.at(-1)}`;
renderLegend($("legend"), data.fuels);
renderTable($("table"), chartData);
new ResizeObserver(drawChart).observe($("chart"));

for (const button of document.querySelectorAll("[data-mode]")) {
  button.addEventListener("click", () => {
    mode = button.dataset.mode;
    for (const b of document.querySelectorAll("[data-mode]")) b.setAttribute("aria-pressed", b === button);
    drawChart();
  });
}

// --- Guessing --------------------------------------------------------------

$("state-names").innerHTML = codes.map((c) => `<option value="${data.states[c].name}">`).join("");

$("guess-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const text = $("guess-input").value.trim().toLowerCase();
  const code = byName[text] ?? (data.states[text.toUpperCase()] ? text.toUpperCase() : null);

  if (!code) return say("That's not a state we know. Pick one from the list.");
  if (guesses.includes(code)) return say(`You already guessed ${data.states[code].name}.`);

  guesses.push(code);
  save(storageKey, guesses);
  $("guess-input").value = "";
  say("");
  render();
});

// Phones open the system share sheet (Messages, WhatsApp, ...). Desktop browsers
// can have a share API too, but copying is what people expect there.
const useShareSheet = navigator.share && matchMedia("(pointer: coarse)").matches;
$("share").textContent = useShareSheet ? "Share result" : "Copy result";

$("share").addEventListener("click", async () => {
  const text = shareText();
  if (useShareSheet) {
    try {
      return await navigator.share({ text });
    } catch (error) {
      if (error.name === "AbortError") return; // they closed the share sheet
      // Otherwise fall through and copy instead.
    }
  }
  try {
    await navigator.clipboard.writeText(text);
    say("Copied your result. Paste it to a friend!");
  } catch {
    say("Couldn't copy. Your browser blocked clipboard access.");
  }
});

function render() {
  const won = guesses.includes(answer);
  const over = won || guesses.length >= MAX_GUESSES;

  const rows = guesses.map((code) => {
    const { name } = data.states[code];
    if (code === answer) return `<li class="correct"><span>${name}</span><span>🎉 Correct</span></li>`;
    const { miles, direction, proximity } = compare(code, answer);
    return `<li><span>${name}</span><span>${miles.toLocaleString()} mi ${ARROWS[direction]}</span><span>${proximity}%</span></li>`;
  });
  for (let i = guesses.length; i < MAX_GUESSES; i++) rows.push(`<li class="empty"><span>Guess ${i + 1}</span></li>`);
  $("guesses").innerHTML = rows.join("");

  $("guess-form").hidden = over;
  $("result").hidden = !over;
  if (over) {
    const { name } = data.states[answer];
    $("result-text").textContent = won
      ? `You got ${name} in ${guesses.length}/${MAX_GUESSES}!`
      : `Out of guesses. It was ${name}.`;
    $("eia-link").href = `https://www.eia.gov/state/?sid=${answer}`;
    $("eia-link").textContent = `Read more about ${name}'s electricity on EIA ↗`;
  }
}

function shareText() {
  const won = guesses.includes(answer);
  const lines = guesses.map((code) => {
    if (code === answer) return "🟩🟩🟩🟩🟩 🎉";
    const { direction, proximity } = compare(code, answer);
    const green = Math.floor(proximity / 20);
    const yellow = proximity % 20 >= 10 ? 1 : 0;
    return "🟩".repeat(green) + "🟨".repeat(yellow) + "⬜".repeat(5 - green - yellow) + " " + ARROW_EMOJI[direction];
  });
  return [`Gridle #${puzzleNumber} ${won ? guesses.length : "X"}/${MAX_GUESSES}`, ...lines, location.origin + location.pathname].join("\n");
}

function say(message) {
  $("message").textContent = message;
}

// --- Geography -------------------------------------------------------------

/** Distance, compass direction (0 = N, 1 = NE, ...) and closeness (0-100) from one state to another. */
function compare(fromCode, toCode) {
  const rad = (deg) => (deg * Math.PI) / 180;
  const a = data.states[fromCode];
  const b = data.states[toCode];
  const [lat1, lat2, dLon] = [rad(a.lat), rad(b.lat), rad(b.lon - a.lon)];

  const h = Math.sin((lat2 - lat1) / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  const miles = Math.round(3959 * 2 * Math.asin(Math.sqrt(h)));

  const bearing = Math.atan2(
    Math.sin(dLon) * Math.cos(lat2),
    Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon)
  );
  const direction = Math.round(((bearing * 180) / Math.PI + 360) / 45) % 8;
  const proximity = Math.max(0, Math.round(100 * (1 - miles / MAX_MILES)));
  return { miles, direction, proximity };
}

// --- Daily state -----------------------------------------------------------

function daysSince(isoDate) {
  const now = new Date();
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((today - Date.parse(isoDate)) / 86_400_000);
}

/** Shuffle the states once per cycle, so no state repeats until all have been played. */
function dailyState(day) {
  const cycle = Math.floor(day / codes.length);
  const random = mulberry32(cycle + 1);
  const order = [...codes];
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order[day % codes.length];
}

/** A tiny seeded random number generator, so every player gets the same state. */
function mulberry32(seed) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// --- Storage (localStorage can be unavailable, e.g. in private windows) ----

function load(key) {
  try {
    return (key && JSON.parse(localStorage.getItem(key))) || [];
  } catch {
    return [];
  }
}

function save(key, value) {
  try {
    if (key) localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

render();
