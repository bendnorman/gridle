// Source:
// Countries with long/lat => https://developers.google.com/public-data/docs/canonical/countries_csv
// Countries images => https://github.com/djaiss/mapsicon
import { flag } from "country-emoji";

const countryCodesWithImage = [
  "tx",
  "ca",
  "ky",
  "ga",
  "wi",
  "or",
  "mo",
  "va",
  "tn",
  "la",
  "ny",
  "id",
  "fl",
  "il",
  "mt",
  "mn",
  "md",
  "ia",
  "dc",
  "oh",
  "ne",
  "wa",
  "sd",
  "ok",
  "wy",
  "wv",
  "in",
  "ma",
  "nv",
  "nd",
  "ar",
  "ms",
  "co",
  "nc",
  "ut",
  "hi",
  "nm",
  "ks",
  "ri",
  "mi",
  "ak",
  "de",
  "al",
  "sc",
  "me",
  "nj",
  "pa",
  "nh",
  "az",
  "ct",
  "vt",
];

export interface Country {
  code: string;
  latitude: number;
  longitude: number;
  name: string;
}

export const countries: Country[] = [
  {
    code: "TX",
    name: "Texas",
    longitude: -99.31778258185285,
    latitude: 31.385907865810015,
  },
  {
    code: "CA",
    name: "California",
    longitude: -119.54293417535214,
    latitude: 37.112207776755746,
  },
  {
    code: "KY",
    name: "Kentucky",
    longitude: -85.29460175915924,
    latitude: 37.51898795649199,
  },
  {
    code: "GA",
    name: "Georgia",
    longitude: -83.43827048902831,
    latitude: 32.6245975928912,
  },
  {
    code: "WI",
    name: "Wisconsin",
    longitude: -90.00068089100202,
    latitude: 44.60805805678411,
  },
  {
    code: "OR",
    name: "Oregon",
    longitude: -120.55972814583627,
    latitude: 43.90486385106968,
  },
  {
    code: "MO",
    name: "Missouri",
    longitude: -92.46831772485945,
    latitude: 38.33866796758217,
  },
  {
    code: "VA",
    name: "Virginia",
    longitude: -78.79272705591207,
    latitude: 37.503106428695055,
  },
  {
    code: "TN",
    name: "Tennessee",
    longitude: -86.34420158227884,
    latitude: 35.83934230330546,
  },
  {
    code: "LA",
    name: "Louisiana",
    longitude: -91.93891236515823,
    latitude: 31.001642553829164,
  },
  {
    code: "NY",
    name: "New York",
    longitude: -75.50027143889564,
    latitude: 42.91429365601229,
  },
  {
    code: "ID",
    name: "Idaho",
    longitude: -114.6352901155054,
    latitude: 44.315817624324424,
  },
  {
    code: "FL",
    name: "Florida",
    longitude: -82.47502966442742,
    latitude: 28.556400389191726,
  },
  {
    code: "IL",
    name: "Illinois",
    longitude: -89.19669333390728,
    latitude: 40.023626443201245,
  },
  {
    code: "MT",
    name: "Montana",
    longitude: -109.63698355930873,
    latitude: 46.99538114781548,
  },
  {
    code: "MN",
    name: "Minnesota",
    longitude: -94.30448674950524,
    latitude: 46.25006741570036,
  },
  {
    code: "MD",
    name: "Maryland",
    longitude: -76.74684662292893,
    latitude: 39.02251518011256,
  },
  {
    code: "IA",
    name: "Iowa",
    longitude: -93.49689627072817,
    latitude: 42.05925320374078,
  },
  {
    code: "DC",
    name: "District of Columbia",
    longitude: -77.01655199588065,
    latitude: 38.904138425835136,
  },
  {
    code: "OH",
    name: "Ohio",
    longitude: -82.79344683299816,
    latitude: 40.28036559427173,
  },
  {
    code: "NE",
    name: "Nebraska",
    longitude: -99.80242122937582,
    latitude: 41.51130170157333,
  },
  {
    code: "WA",
    name: "Washington",
    longitude: -120.49507083170192,
    latitude: 47.36749810243378,
  },
  {
    code: "SD",
    name: "South Dakota",
    longitude: -100.22894102419889,
    latitude: 44.41701497921902,
  },
  {
    code: "OK",
    name: "Oklahoma",
    longitude: -97.50185545949427,
    latitude: 35.56897998627242,
  },
  {
    code: "WY",
    name: "Wyoming",
    longitude: -107.55120862361497,
    latitude: 42.96755129213882,
  },
  {
    code: "WV",
    name: "West Virginia",
    longitude: -80.61650921042595,
    latitude: 38.63488470753805,
  },
  {
    code: "IN",
    name: "Indiana",
    longitude: -86.27783263998701,
    latitude: 39.88308628201737,
  },
  {
    code: "MA",
    name: "Massachusetts",
    longitude: -71.75756340330204,
    latitude: 42.23317945766943,
  },
  {
    code: "NV",
    name: "Nevada",
    longitude: -116.6436616407996,
    latitude: 39.299094822557,
  },
  {
    code: "ND",
    name: "North Dakota",
    longitude: -100.46711360346731,
    latitude: 47.42436745131989,
  },
  {
    code: "AR",
    name: "Arkansas",
    longitude: -92.43965724859811,
    latitude: 34.88280283479158,
  },
  {
    code: "MS",
    name: "Mississippi",
    longitude: -89.66340079067899,
    latitude: 32.72477746889273,
  },
  {
    code: "CO",
    name: "Colorado",
    longitude: -105.547550423154,
    latitude: 38.97058018306944,
  },
  {
    code: "NC",
    name: "North Carolina",
    longitude: -79.18132908800699,
    latitude: 35.53233157206344,
  },
  {
    code: "UT",
    name: "Utah",
    longitude: -111.6740585685802,
    latitude: 39.28414980639967,
  },
  {
    code: "HI",
    name: "Hawaii",
    longitude: -156.3502304243683,
    latitude: 20.248328120630052,
  },
  {
    code: "NM",
    name: "New Mexico",
    longitude: -106.11039927790091,
    latitude: 34.382045886773064,
  },
  {
    code: "KS",
    name: "Kansas",
    longitude: -98.37813513876596,
    latitude: 38.46994634156428,
  },
  {
    code: "RI",
    name: "Rhode Island",
    longitude: -71.53176289336065,
    latitude: 41.66163551535037,
  },
  {
    code: "MI",
    name: "Michigan",
    longitude: -85.41023917383467,
    latitude: 44.30800016340471,
  },
  {
    code: "AK",
    name: "Alaska",
    longitude: -151.78453551079667,
    latitude: 63.27320915419647,
  },
  {
    code: "DE",
    name: "Delaware",
    longitude: -75.50041703574603,
    latitude: 38.99742764330282,
  },
  {
    code: "AL",
    name: "Alabama",
    longitude: -86.82915348513555,
    latitude: 32.764939286398494,
  },
  {
    code: "SC",
    name: "South Carolina",
    longitude: -80.8922232465851,
    latitude: 33.89917770533006,
  },
  {
    code: "ME",
    name: "Maine",
    longitude: -69.21967884612346,
    latitude: 45.31867651904591,
  },
  {
    code: "NJ",
    name: "New Jersey",
    longitude: -74.6618700298442,
    latitude: 40.17714022513752,
  },
  {
    code: "PA",
    name: "Pennsylvania",
    longitude: -77.79939924895645,
    latitude: 40.864499568846924,
  },
  {
    code: "NH",
    name: "New Hampshire",
    longitude: -71.57810296709323,
    latitude: 43.67519188986806,
  },
  {
    code: "AZ",
    name: "Arizona",
    longitude: -111.66250194576263,
    latitude: 34.25088140079992,
  },
  {
    code: "CT",
    name: "Connecticut",
    longitude: -72.7273312401927,
    latitude: 41.61732974050593,
  },
  {
    code: "VT",
    name: "Vermont",
    longitude: -72.66390583612417,
    latitude: 44.06468434391671,
  },
];

export const fictionalCountries: Country[] = [
  { code: "AA", latitude: 12.546245, longitude: 1.601554, name: "Atlantis" },
  {
    code: "AB",
    latitude: 12.546245,
    longitude: 1.601554,
    name: "Central City",
  },
  {
    code: "AC",
    latitude: 12.546245,
    longitude: 1.601554,
    name: "Cerulean City",
  },
  {
    code: "AD",
    latitude: 12.546245,
    longitude: 1.601554,
    name: "Deepheart Valley",
  },
  {
    code: "AE",
    latitude: 12.546245,
    longitude: 1.601554,
    name: "Friendship Island",
  },
  { code: "AF", latitude: 12.546245, longitude: 1.601554, name: "Gallifrey" },
  { code: "AG", latitude: 12.546245, longitude: 1.601554, name: "Gotham" },
  {
    code: "AH",
    latitude: 12.546245,
    longitude: 1.601554,
    name: "Green Hills",
  },
  {
    code: "AI",
    latitude: 12.546245,
    longitude: 1.601554,
    name: "Hill Valley",
  },
  { code: "AJ", latitude: 42.546245, longitude: 1.601554, name: "Land of Oz" },
  {
    code: "AK",
    latitude: 12.546245,
    longitude: 1.601554,
    name: "Liberty City",
  },
  { code: "AL", latitude: 12.546245, longitude: 1.601554, name: "Metropolis" },
  { code: "AM", latitude: 12.546245, longitude: 1.601554, name: "Mos Eisley" },
  {
    code: "AN",
    latitude: 12.546245,
    longitude: 1.601554,
    name: "Mushroom Kingdom",
  },
  { code: "AO", latitude: 12.546245, longitude: 1.601554, name: "Narnia" },
  {
    code: "AP",
    latitude: 12.546245,
    longitude: 1.601554,
    name: "Pelotillehue",
  },
  {
    code: "AQ",
    latitude: 12.546245,
    longitude: 1.601554,
    name: "Phantom Island",
  },
  {
    code: "AR",
    latitude: 12.546245,
    longitude: 1.601554,
    name: "Pleasantville",
  },
  {
    code: "AS",
    latitude: 12.546245,
    longitude: 1.601554,
    name: "Raccoon City",
  },
  {
    code: "AT",
    latitude: 12.546245,
    longitude: 1.601554,
    name: "San Andreas",
  },
  { code: "AU", latitude: 12.546245, longitude: 1.601554, name: "Smallville" },
  {
    code: "AV",
    latitude: 12.546245,
    longitude: 1.601554,
    name: "Springfield",
  },
  { code: "AW", latitude: 12.546245, longitude: 1.601554, name: "The Shire" },
  { code: "AX", latitude: 12.546245, longitude: 1.601554, name: "Twin Peaks" },
  { code: "AY", latitude: 12.546245, longitude: 1.601554, name: "Vice City" },
  { code: "AZ", latitude: 12.546245, longitude: 1.601554, name: "Wakanda" },
  { code: "BA", latitude: 12.546245, longitude: 1.601554, name: "Westeros" },
  { code: "BB", latitude: 12.546245, longitude: 1.601554, name: "Westview" },
  { code: "BC", latitude: 12.546245, longitude: 1.601554, name: "Westworld" },
  { code: "BD", latitude: 12.546245, longitude: 1.601554, name: "Winterfell" },
  { code: "BE", latitude: 12.546245, longitude: 1.601554, name: "Zion" },
];

export const countriesWithImage = countries.filter((c) =>
  countryCodesWithImage.includes(c.code.toLowerCase())
);

export function getCountryName(language: string, country: Country | undefined) {
  return country?.name;
}

export function sanitizeCountryName(countryName: string | undefined): string {
  return countryName
    ? countryName
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[- '()]/g, "")
        .toLowerCase()
    : "";
}

export interface Iso {
  [id: string]: string;
}

export const countryISOMapping: Iso = {
  AK: "41",
  AL: "27",
  AR: "63",
  AZ: "49",
  CA: "33",
  CO: "67",
  CT: "97",
  DC: "107",
  DE: "103",
  FL: "55",
  GA: "109",
  HI: "113",
  IA: "123",
  ID: "115",
  IL: "65",
  IN: "119",
  KS: "51",
  KY: "37",
  LA: "35",
  MA: "99",
  MD: "105",
  ME: "117",
  MI: "125",
  MN: "31",
  MO: "111",
  MS: "",
  MT: "",
  NC: "121",
  ND: "",
  NE: "39",
  NH: "",
  NJ: "",
  NM: "43",
  NV: "57",
  NY: "45",
  OH: "",
  OK: "61",
  OR: "",
  PA: "",
  RI: "",
  SC: "53",
  SD: "",
  TN: "",
  TX: "29",
  UT: "59",
  VA: "",
  VT: "101",
  WA: "47",
  WI: "",
  WV: "",
  W: "69",
};

export function getCountryPrettyName(
  str: string | undefined,
  isAprilFools = false
): string {
  const items = isAprilFools ? fictionalCountries : countries;
  if (str) {
    const country = items.find(
      (c) => sanitizeCountryName(c.name.toLowerCase()) === str
    );
    if (country) {
      return `${country.name}`;
    }
  }
  return `${str}`;
}
