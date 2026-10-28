# Gridle

The Wordle game for energy nerds: https://gridle.bendnorman.com/

Each day you get a chart of one US state's electricity generation mix and five
guesses to name the state. Wrong guesses tell you how far away the answer is and
in which direction.

## How this repo is organized

```
data/build_data.py   Python script that builds site/states.json from PUDL data
site/                The whole game: static HTML, CSS and JavaScript, no build step
  index.html         Page layout
  game.js            Picks the daily state, handles guesses, saves progress
  chart.js           Draws the stacked area chart as SVG
  style.css          Styles, including the fuel colors (light and dark mode)
  states.json        Generated data: yearly TWh by fuel for every state
```

## Updating the data

The data comes from EIA Form 923 via [PUDL](https://catalyst.coop/pudl). To
rebuild it (for example, after a new year of data is released):

```
uv run data/build_data.py
```

[uv](https://docs.astral.sh/uv/) installs the script's dependencies (pandas,
pyarrow) on the fly. Downloads are cached in `data/cache/`; delete that folder to
fetch fresh data.

To change how fuels are grouped, edit `FUEL_GROUPS` in `build_data.py`. If you
add or rename a fuel, also add its label in `site/chart.js` (`FUEL_LABELS`) and
its color in `site/style.css` (`--fuel-<name>`).

## Deploying

Pushing to `main` publishes `site/` to GitHub Pages
(`.github/workflows/deploy-pages.yml`). There's no build step; the files are
served as-is. To redeploy without a code change, run the workflow from the
Actions tab.

## Running locally

Any static file server works:

```
python -m http.server -d site
```

Then open http://localhost:8000. To preview a particular state's chart without
affecting today's game, add `?state=XX`, e.g. http://localhost:8000/?state=HI.

## How the daily state is picked

`game.js` counts the days since 2022-06-14 (Gridle #1). The 51 states (including
DC) are shuffled with a seeded random number generator once per 51-day cycle, so
everyone gets the same state each day and no state repeats within a cycle. There
is no schedule file to maintain.
