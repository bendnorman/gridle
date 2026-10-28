# /// script
# requires-python = ">=3.11"
# dependencies = ["pandas>=2", "pyarrow"]
# ///
"""Build site/states.json: yearly net generation by fuel for each US state.

Run with:  uv run data/build_data.py

Data comes from PUDL's EIA-923 tables (https://catalyst.coop/pudl), which are
published as parquet files on a public S3 bucket. Downloads are cached in
data/cache/ so re-runs are fast; delete that folder to pull fresh data.
"""

import json
import urllib.request
from pathlib import Path

import pandas as pd

PUDL_URL = "https://s3.us-west-2.amazonaws.com/pudl.catalyst.coop/stable"
HERE = Path(__file__).parent
CACHE_DIR = HERE / "cache"
OUTPUT = HERE.parent / "site" / "states.json"

# PUDL fuel codes -> the fuel groups shown on the chart. Anything not listed
# (biomass, waste, geothermal, other) lands in "other". The order here is the
# stacking order on the chart, bottom to top.
FUEL_GROUPS = {
    "nuclear": "nuclear",
    "oil": "oil",
    "coal": "coal",
    "gas": "gas",
    "hydro": "hydro",
    "wind": "wind",
    "solar": "solar",
}
FUELS = [*dict.fromkeys(FUEL_GROUPS.values()), "other"]

# Storage consumes more than it generates, so it's not part of the generation mix.
STORAGE_PRIME_MOVERS = {"PS", "BA"}  # pumped hydro, batteries

# Name and approximate geographic center of each state, for distance hints.
STATES = {
    "AK": ("Alaska", 63.27, -151.78),
    "AL": ("Alabama", 32.76, -86.83),
    "AR": ("Arkansas", 34.88, -92.44),
    "AZ": ("Arizona", 34.25, -111.66),
    "CA": ("California", 37.11, -119.54),
    "CO": ("Colorado", 38.97, -105.55),
    "CT": ("Connecticut", 41.62, -72.73),
    "DC": ("District of Columbia", 38.90, -77.02),
    "DE": ("Delaware", 39.00, -75.50),
    "FL": ("Florida", 28.56, -82.48),
    "GA": ("Georgia", 32.62, -83.44),
    "HI": ("Hawaii", 20.25, -156.35),
    "IA": ("Iowa", 42.06, -93.50),
    "ID": ("Idaho", 44.32, -114.64),
    "IL": ("Illinois", 40.02, -89.20),
    "IN": ("Indiana", 39.88, -86.28),
    "KS": ("Kansas", 38.47, -98.38),
    "KY": ("Kentucky", 37.52, -85.29),
    "LA": ("Louisiana", 31.00, -91.94),
    "MA": ("Massachusetts", 42.23, -71.76),
    "MD": ("Maryland", 39.02, -76.75),
    "ME": ("Maine", 45.32, -69.22),
    "MI": ("Michigan", 44.31, -85.41),
    "MN": ("Minnesota", 46.25, -94.30),
    "MO": ("Missouri", 38.34, -92.47),
    "MS": ("Mississippi", 32.72, -89.66),
    "MT": ("Montana", 47.00, -109.64),
    "NC": ("North Carolina", 35.53, -79.18),
    "ND": ("North Dakota", 47.42, -100.47),
    "NE": ("Nebraska", 41.51, -99.80),
    "NH": ("New Hampshire", 43.68, -71.58),
    "NJ": ("New Jersey", 40.18, -74.66),
    "NM": ("New Mexico", 34.38, -106.11),
    "NV": ("Nevada", 39.30, -116.64),
    "NY": ("New York", 42.91, -75.50),
    "OH": ("Ohio", 40.28, -82.79),
    "OK": ("Oklahoma", 35.57, -97.50),
    "OR": ("Oregon", 43.90, -120.56),
    "PA": ("Pennsylvania", 40.86, -77.80),
    "RI": ("Rhode Island", 41.66, -71.53),
    "SC": ("South Carolina", 33.90, -80.89),
    "SD": ("South Dakota", 44.42, -100.23),
    "TN": ("Tennessee", 35.84, -86.34),
    "TX": ("Texas", 31.39, -99.32),
    "UT": ("Utah", 39.28, -111.67),
    "VA": ("Virginia", 37.50, -78.79),
    "VT": ("Vermont", 44.06, -72.66),
    "WA": ("Washington", 47.37, -120.50),
    "WI": ("Wisconsin", 44.61, -90.00),
    "WV": ("West Virginia", 38.63, -80.62),
    "WY": ("Wyoming", 42.97, -107.55),
}


def read_pudl_table(name: str, columns: list[str]) -> pd.DataFrame:
    """Download a PUDL parquet table (once) and read the requested columns."""
    path = CACHE_DIR / f"{name}.parquet"
    if not path.exists():
        CACHE_DIR.mkdir(exist_ok=True)
        print(f"Downloading {name}...")
        urllib.request.urlretrieve(f"{PUDL_URL}/{name}.parquet", path)
    return pd.read_parquet(path, columns=columns)


def load_generation() -> pd.DataFrame:
    """Return net generation in TWh with one row per state and year, one column per fuel."""
    gen = read_pudl_table(
        "out_eia923__yearly_generation_fuel_combined",
        ["report_date", "plant_id_eia", "fuel_type_code_pudl", "prime_mover_code", "net_generation_mwh"],
    )
    plants = read_pudl_table("core_eia__entity_plants", ["plant_id_eia", "state"])

    gen = gen[~gen.prime_mover_code.isin(STORAGE_PRIME_MOVERS)]
    gen = gen.merge(plants, on="plant_id_eia", how="left", validate="m:1")
    gen = gen.assign(
        year=pd.to_datetime(gen.report_date).dt.year,
        fuel=gen.fuel_type_code_pudl.astype("string").map(FUEL_GROUPS).fillna("other"),
        twh=gen.net_generation_mwh / 1e6,
    )

    by_fuel = (
        gen.groupby(["state", "year", "fuel"])["twh"]
        .sum()
        .unstack("fuel", fill_value=0)
        .reindex(columns=FUELS, fill_value=0)
    )
    # A few plants report small negative net generation (station use > output).
    # A stacked chart can't show negatives, so floor them at zero.
    return by_fuel.clip(lower=0)


def main() -> None:
    by_fuel = load_generation()
    years = sorted(by_fuel.index.get_level_values("year").unique())

    states = {}
    for code, (name, lat, lon) in STATES.items():
        state_gen = by_fuel.loc[code].reindex(years, fill_value=0)
        states[code] = {
            "name": name,
            "lat": lat,
            "lon": lon,
            "twh": {fuel: state_gen[fuel].round(3).tolist() for fuel in FUELS},
        }

    OUTPUT.write_text(json.dumps({"years": years, "fuels": FUELS, "states": states}))
    print(f"Wrote {len(states)} states, {years[0]}-{years[-1]}, to {OUTPUT}")


if __name__ == "__main__":
    main()
