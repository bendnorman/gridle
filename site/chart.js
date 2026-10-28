// Stacked area chart of a state's generation mix, drawn as plain SVG.
//
// data = { years: [2001, ...], fuels: ["nuclear", ...], twh: { nuclear: [...], ... } }
// Fuels stack bottom to top in the order given. Colors come from the
// --fuel-<name> CSS variables in style.css.

export const FUEL_LABELS = {
  nuclear: "Nuclear",
  oil: "Oil",
  coal: "Coal",
  gas: "Gas",
  hydro: "Hydro",
  wind: "Wind",
  solar: "Solar",
  other: "Bio & other",
};

const fuelColor = (fuel) => `var(--fuel-${fuel})`;
const fmtTwh = (v) => (v > 0 && v < 0.05 ? "<0.1" : v.toLocaleString(undefined, { maximumFractionDigits: v < 10 ? 1 : 0 }));
const fmtPct = (v) => (v > 0 && v < 1 ? "<1%" : `${Math.round(v)}%`);

/** Draw the chart into `container`. mode is "share" (percent of total) or "twh". */
export function renderChart(container, data, mode) {
  const { years, fuels, twh } = data;
  const n = years.length;
  const totals = years.map((_, i) => fuels.reduce((sum, f) => sum + twh[f][i], 0));
  const share = (f, i) => (totals[i] ? (100 * twh[f][i]) / totals[i] : 0);
  const value = mode === "share" ? share : (f, i) => twh[f][i];

  // Stack the fuels: each layer has a bottom (lo) and top (hi) value per year.
  let base = years.map(() => 0);
  const layers = fuels.map((fuel) => {
    const lo = base;
    const hi = lo.map((v, i) => v + value(fuel, i));
    base = hi;
    return { fuel, lo, hi };
  });

  // Layout. Direct labels sit in the right margin when there's room for them.
  const width = container.clientWidth;
  const height = Math.round(Math.min(420, Math.max(260, width * 0.6)));
  const showLabels = width >= 480;
  const m = { top: 12, right: showLabels ? 112 : 20, bottom: 28, left: mode === "share" ? 44 : 64 };
  const plotW = width - m.left - m.right;
  const plotH = height - m.top - m.bottom;

  const ticks = mode === "share" ? [0, 25, 50, 75, 100] : niceTicks(Math.max(...base));
  const yMax = ticks[ticks.length - 1];
  const x = (i) => m.left + (i / (n - 1)) * plotW;
  const y = (v) => m.top + plotH - (v / yMax) * plotH;

  const points = (vals) => vals.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`);
  const line = (vals) => "M" + points(vals).join("L");
  const area = ({ lo, hi }) => "M" + [...points(hi), ...points(lo).reverse()].join("L") + "Z";

  // The top tick carries the unit so the axis is self-explanatory.
  const yTickLabel = (t) => (mode === "share" ? `${t}%` : t === yMax ? `${t.toLocaleString()} TWh` : t.toLocaleString());
  const xTicks = years.map((yr, i) => [yr, i]).filter(([yr, i]) => yr % 5 === 0 || i === 0 || i === n - 1);
  // Drop a 5-year tick that would crowd the first/last year label.
  const xTicksSpaced = xTicks.filter(([, i], k) => k === 0 || k === xTicks.length - 1 || (i > 2 && i < n - 3));

  // Direct labels for layers thick enough at the last year to hold one.
  const last = n - 1;
  const labels = showLabels
    ? layers
        .filter((l) => y(l.lo[last]) - y(l.hi[last]) >= 16)
        .map((l) => {
          const text = mode === "share" ? fmtPct(share(l.fuel, last)) : fmtTwh(twh[l.fuel][last]);
          const cy = (y(l.lo[last]) + y(l.hi[last])) / 2;
          return `<g transform="translate(${m.left + plotW + 8},${cy.toFixed(1)})">
              <rect x="0" y="-4" width="8" height="8" rx="2" style="fill:${fuelColor(l.fuel)}"/>
              <text x="13" dy="0.35em" class="label">${FUEL_LABELS[l.fuel]} <tspan class="label-value">${text}</tspan></text>
            </g>`;
        })
    : [];

  container.innerHTML = `
    <svg width="${width}" height="${height}" role="img" aria-label="Stacked area chart of yearly electricity generation by fuel">
      ${ticks.map((t) => `<line class="grid" x1="${m.left}" x2="${m.left + plotW}" y1="${y(t)}" y2="${y(t)}"/>`).join("")}
      ${ticks.map((t) => `<text class="tick" x="${m.left - 6}" y="${y(t)}" dy="0.35em" text-anchor="end">${yTickLabel(t)}</text>`).join("")}
      ${xTicksSpaced.map(([yr, i]) => `<text class="tick" x="${x(i)}" y="${height - 8}" text-anchor="middle">${yr}</text>`).join("")}
      ${layers.map((l) => `<path d="${area(l)}" style="fill:${fuelColor(l.fuel)}"/>`).join("")}
      ${layers.slice(0, -1).map((l) => `<path class="gap" d="${line(l.hi)}"/>`).join("")}
      <line class="baseline" x1="${m.left}" x2="${m.left + plotW}" y1="${y(0)}" y2="${y(0)}"/>
      ${labels.join("")}
      <line class="crosshair" y1="${m.top}" y2="${m.top + plotH}" visibility="hidden"/>
      <rect class="hit" x="${m.left}" y="${m.top}" width="${plotW}" height="${plotH}"/>
    </svg>
    <div class="tooltip" hidden></div>`;

  // Hover: a crosshair snaps to the nearest year and a tooltip lists every fuel.
  const svg = container.querySelector("svg");
  const crosshair = svg.querySelector(".crosshair");
  const tooltip = container.querySelector(".tooltip");

  const show = (event) => {
    const px = event.clientX - svg.getBoundingClientRect().left;
    const i = Math.max(0, Math.min(n - 1, Math.round(((px - m.left) / plotW) * (n - 1))));
    crosshair.setAttribute("x1", x(i));
    crosshair.setAttribute("x2", x(i));
    crosshair.setAttribute("visibility", "visible");

    // List fuels top to bottom so the tooltip reads in the same order as the stack.
    const rows = [...fuels]
      .reverse()
      .filter((f) => twh[f][i] > 0)
      .map(
        (f) => `<tr>
          <td><span class="swatch" style="background:${fuelColor(f)}"></span>${FUEL_LABELS[f]}</td>
          <td>${fmtTwh(twh[f][i])} TWh</td>
          <td>${fmtPct(share(f, i))}</td>
        </tr>`
      );
    tooltip.innerHTML = `<strong>${years[i]}</strong>
      <table>${rows.join("")}
        <tr class="total"><td>Total</td><td>${fmtTwh(totals[i])} TWh</td><td></td></tr>
      </table>`;
    tooltip.hidden = false;

    // Keep the tooltip on the side of the crosshair with more room.
    const onLeft = x(i) > m.left + plotW / 2;
    tooltip.style.left = onLeft ? "" : `${x(i) + 12}px`;
    tooltip.style.right = onLeft ? `${width - x(i) + 12}px` : "";
    tooltip.style.top = `${m.top}px`;
  };
  const hide = () => {
    crosshair.setAttribute("visibility", "hidden");
    tooltip.hidden = true;
  };

  const hit = svg.querySelector(".hit");
  hit.addEventListener("pointermove", show);
  hit.addEventListener("pointerdown", show);
  hit.addEventListener("pointerleave", hide);
}

/** A legend with every fuel, so colors stay learnable across days. */
export function renderLegend(list, fuels) {
  list.innerHTML = [...fuels]
    .reverse()
    .map((f) => `<li><span class="swatch" style="background:${fuelColor(f)}"></span>${FUEL_LABELS[f]}</li>`)
    .join("");
}

/** The same numbers as a table, for anyone who can't use the chart. */
export function renderTable(container, { years, fuels, twh }) {
  const head = fuels.map((f) => `<th>${FUEL_LABELS[f]}</th>`).join("");
  const body = years
    .map((yr, i) => `<tr><th>${yr}</th>${fuels.map((f) => `<td>${fmtTwh(twh[f][i])}</td>`).join("")}</tr>`)
    .join("");
  container.innerHTML = `<table><caption>Net generation (TWh)</caption>
    <thead><tr><th>Year</th>${head}</tr></thead><tbody>${body}</tbody></table>`;
}

/** Round, evenly spaced y-axis ticks from 0 up past `max`. */
function niceTicks(max, count = 5) {
  const raw = max / count || 1;
  const pow = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].find((s) => s * pow >= raw) * pow;
  const ticks = [];
  for (let t = 0; t < max + step * 0.001; t += step) ticks.push(+t.toFixed(10));
  if (ticks[ticks.length - 1] < max) ticks.push(+(ticks.length * step).toFixed(10));
  return ticks;
}
