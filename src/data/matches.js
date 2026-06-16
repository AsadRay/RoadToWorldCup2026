import { GROUPS } from "./tournament";

// Build name → team object lookup from our GROUPS data
const BY_NAME = {};
GROUPS.forEach((g) => g.teams.forEach((t) => { BY_NAME[t.n] = t; }));

// football-data.org uses these names; map them to ours
const API_NAME = {
  "United States":      "USA",
  "Turkey":             "Türkiye",
  "Ivory Coast":        "Côte d'Ivoire",
  "Bosnia-Herzegovina": "Bosnia",
  "Congo DR":           "DR Congo",
  "Cape Verde Islands": "Cabo Verde",
};

function T(apiName) {
  const name = API_NAME[apiName] || apiName;
  return BY_NAME[name] || { n: name, f: "🏳️", r: 99 };
}

// Venues assigned by group (API doesn't provide them)
const VENUES = {
  A: ["Estadio Azteca",    "Estadio BBVA"],
  B: ["BC Place",          "BMO Field"],
  C: ["Levi's Stadium",    "SoFi Stadium"],
  D: ["AT&T Stadium",      "NRG Stadium"],
  E: ["Allegiant Stadium", "Arrowhead Stadium"],
  F: ["Lumen Field",       "Hard Rock Stadium"],
  G: ["Lincoln Financial", "MetLife Stadium"],
  H: ["SoFi Stadium",      "Allegiant Stadium"],
  I: ["NRG Stadium",       "AT&T Stadium"],
  J: ["MetLife Stadium",   "BC Place"],
  K: ["Hard Rock Stadium", "Lincoln Financial"],
  L: ["Lumen Field",       "BMO Field"],
};

let _vi = {}; // venue index per group
function venue(g) {
  if (_vi[g] === undefined) _vi[g] = 0;
  return VENUES[g][_vi[g]++ % 2];
}

// Actual WC 2026 group-stage schedule — apiId links to football-data.org match IDs
// Times are UTC
export const GROUP_MATCHES = [
  // ── GROUP A ──────────────────────────────────────────────────────────────
  { id:"A1", apiId:537327, group:"A", matchday:1, t1:T("Mexico"),       t2:T("South Africa"), date:"2026-06-11", time:"19:00", venue:venue("A") },
  { id:"A2", apiId:537328, group:"A", matchday:1, t1:T("South Korea"),  t2:T("Czechia"),      date:"2026-06-12", time:"02:00", venue:venue("A") },
  { id:"A3", apiId:537329, group:"A", matchday:2, t1:T("Czechia"),      t2:T("South Africa"), date:"2026-06-18", time:"16:00", venue:venue("A") },
  { id:"A4", apiId:537330, group:"A", matchday:2, t1:T("Mexico"),       t2:T("South Korea"),  date:"2026-06-19", time:"01:00", venue:venue("A") },
  { id:"A5", apiId:537331, group:"A", matchday:3, t1:T("Czechia"),      t2:T("Mexico"),       date:"2026-06-25", time:"01:00", venue:venue("A") },
  { id:"A6", apiId:537332, group:"A", matchday:3, t1:T("South Africa"), t2:T("South Korea"),  date:"2026-06-25", time:"01:00", venue:venue("A") },
  // ── GROUP B ──────────────────────────────────────────────────────────────
  { id:"B1", apiId:537333, group:"B", matchday:1, t1:T("Canada"),      t2:T("Bosnia-Herzegovina"), date:"2026-06-12", time:"19:00", venue:venue("B") },
  { id:"B2", apiId:537334, group:"B", matchday:1, t1:T("Qatar"),       t2:T("Switzerland"),         date:"2026-06-13", time:"19:00", venue:venue("B") },
  { id:"B3", apiId:537335, group:"B", matchday:2, t1:T("Switzerland"), t2:T("Bosnia-Herzegovina"), date:"2026-06-18", time:"19:00", venue:venue("B") },
  { id:"B4", apiId:537336, group:"B", matchday:2, t1:T("Canada"),      t2:T("Qatar"),               date:"2026-06-18", time:"22:00", venue:venue("B") },
  { id:"B5", apiId:537337, group:"B", matchday:3, t1:T("Switzerland"), t2:T("Canada"),              date:"2026-06-24", time:"19:00", venue:venue("B") },
  { id:"B6", apiId:537338, group:"B", matchday:3, t1:T("Bosnia-Herzegovina"), t2:T("Qatar"),        date:"2026-06-24", time:"19:00", venue:venue("B") },
  // ── GROUP C ──────────────────────────────────────────────────────────────
  { id:"C1", apiId:537339, group:"C", matchday:1, t1:T("Brazil"),   t2:T("Morocco"),  date:"2026-06-13", time:"22:00", venue:venue("C") },
  { id:"C2", apiId:537340, group:"C", matchday:1, t1:T("Haiti"),    t2:T("Scotland"), date:"2026-06-14", time:"01:00", venue:venue("C") },
  { id:"C3", apiId:537341, group:"C", matchday:2, t1:T("Brazil"),   t2:T("Haiti"),    date:"2026-06-20", time:"00:30", venue:venue("C") },
  { id:"C4", apiId:537342, group:"C", matchday:2, t1:T("Scotland"), t2:T("Morocco"),  date:"2026-06-19", time:"22:00", venue:venue("C") },
  { id:"C5", apiId:537343, group:"C", matchday:3, t1:T("Scotland"), t2:T("Brazil"),   date:"2026-06-24", time:"22:00", venue:venue("C") },
  { id:"C6", apiId:537344, group:"C", matchday:3, t1:T("Morocco"),  t2:T("Haiti"),    date:"2026-06-24", time:"22:00", venue:venue("C") },
  // ── GROUP D ──────────────────────────────────────────────────────────────
  { id:"D1", apiId:537345, group:"D", matchday:1, t1:T("United States"), t2:T("Paraguay"),     date:"2026-06-13", time:"01:00", venue:venue("D") },
  { id:"D2", apiId:537346, group:"D", matchday:1, t1:T("Australia"),     t2:T("Turkey"),       date:"2026-06-14", time:"04:00", venue:venue("D") },
  { id:"D3", apiId:537347, group:"D", matchday:2, t1:T("Turkey"),        t2:T("Paraguay"),     date:"2026-06-20", time:"03:00", venue:venue("D") },
  { id:"D4", apiId:537348, group:"D", matchday:2, t1:T("United States"), t2:T("Australia"),    date:"2026-06-19", time:"19:00", venue:venue("D") },
  { id:"D5", apiId:537349, group:"D", matchday:3, t1:T("Turkey"),        t2:T("United States"),date:"2026-06-26", time:"02:00", venue:venue("D") },
  { id:"D6", apiId:537350, group:"D", matchday:3, t1:T("Paraguay"),      t2:T("Australia"),    date:"2026-06-26", time:"02:00", venue:venue("D") },
  // ── GROUP E ──────────────────────────────────────────────────────────────
  { id:"E1", apiId:537351, group:"E", matchday:1, t1:T("Germany"),        t2:T("Curaçao"),      date:"2026-06-14", time:"17:00", venue:venue("E") },
  { id:"E2", apiId:537352, group:"E", matchday:1, t1:T("Ivory Coast"),    t2:T("Ecuador"),      date:"2026-06-14", time:"23:00", venue:venue("E") },
  { id:"E3", apiId:537353, group:"E", matchday:2, t1:T("Germany"),        t2:T("Ivory Coast"),  date:"2026-06-20", time:"20:00", venue:venue("E") },
  { id:"E4", apiId:537354, group:"E", matchday:2, t1:T("Ecuador"),        t2:T("Curaçao"),      date:"2026-06-21", time:"00:00", venue:venue("E") },
  { id:"E5", apiId:537355, group:"E", matchday:3, t1:T("Ecuador"),        t2:T("Germany"),      date:"2026-06-25", time:"20:00", venue:venue("E") },
  { id:"E6", apiId:537356, group:"E", matchday:3, t1:T("Curaçao"),        t2:T("Ivory Coast"),  date:"2026-06-25", time:"20:00", venue:venue("E") },
  // ── GROUP F ──────────────────────────────────────────────────────────────
  { id:"F1", apiId:537357, group:"F", matchday:1, t1:T("Netherlands"), t2:T("Japan"),       date:"2026-06-14", time:"20:00", venue:venue("F") },
  { id:"F2", apiId:537358, group:"F", matchday:1, t1:T("Sweden"),      t2:T("Tunisia"),     date:"2026-06-15", time:"02:00", venue:venue("F") },
  { id:"F3", apiId:537359, group:"F", matchday:2, t1:T("Netherlands"), t2:T("Sweden"),      date:"2026-06-20", time:"17:00", venue:venue("F") },
  { id:"F4", apiId:537360, group:"F", matchday:2, t1:T("Tunisia"),     t2:T("Japan"),       date:"2026-06-21", time:"04:00", venue:venue("F") },
  { id:"F5", apiId:537361, group:"F", matchday:3, t1:T("Tunisia"),     t2:T("Netherlands"), date:"2026-06-25", time:"23:00", venue:venue("F") },
  { id:"F6", apiId:537362, group:"F", matchday:3, t1:T("Japan"),       t2:T("Sweden"),      date:"2026-06-25", time:"23:00", venue:venue("F") },
  // ── GROUP G ──────────────────────────────────────────────────────────────
  { id:"G1", apiId:537363, group:"G", matchday:1, t1:T("Belgium"),     t2:T("Egypt"),       date:"2026-06-15", time:"19:00", venue:venue("G") },
  { id:"G2", apiId:537364, group:"G", matchday:1, t1:T("Iran"),        t2:T("New Zealand"), date:"2026-06-16", time:"01:00", venue:venue("G") },
  { id:"G3", apiId:537365, group:"G", matchday:2, t1:T("Belgium"),     t2:T("Iran"),        date:"2026-06-21", time:"19:00", venue:venue("G") },
  { id:"G4", apiId:537366, group:"G", matchday:2, t1:T("New Zealand"), t2:T("Egypt"),       date:"2026-06-22", time:"01:00", venue:venue("G") },
  { id:"G5", apiId:537367, group:"G", matchday:3, t1:T("New Zealand"), t2:T("Belgium"),     date:"2026-06-27", time:"03:00", venue:venue("G") },
  { id:"G6", apiId:537368, group:"G", matchday:3, t1:T("Egypt"),       t2:T("Iran"),        date:"2026-06-27", time:"03:00", venue:venue("G") },
  // ── GROUP H ──────────────────────────────────────────────────────────────
  { id:"H1", apiId:537369, group:"H", matchday:1, t1:T("Spain"),        t2:T("Cape Verde Islands"), date:"2026-06-15", time:"16:00", venue:venue("H") },
  { id:"H2", apiId:537370, group:"H", matchday:1, t1:T("Saudi Arabia"), t2:T("Uruguay"),            date:"2026-06-15", time:"22:00", venue:venue("H") },
  { id:"H3", apiId:537371, group:"H", matchday:2, t1:T("Spain"),        t2:T("Saudi Arabia"),       date:"2026-06-21", time:"16:00", venue:venue("H") },
  { id:"H4", apiId:537372, group:"H", matchday:2, t1:T("Uruguay"),      t2:T("Cape Verde Islands"), date:"2026-06-21", time:"22:00", venue:venue("H") },
  { id:"H5", apiId:537373, group:"H", matchday:3, t1:T("Uruguay"),      t2:T("Spain"),              date:"2026-06-27", time:"00:00", venue:venue("H") },
  { id:"H6", apiId:537374, group:"H", matchday:3, t1:T("Cape Verde Islands"), t2:T("Saudi Arabia"), date:"2026-06-27", time:"00:00", venue:venue("H") },
  // ── GROUP I ──────────────────────────────────────────────────────────────
  { id:"I1", apiId:537391, group:"I", matchday:1, t1:T("France"),   t2:T("Senegal"), date:"2026-06-16", time:"19:00", venue:venue("I") },
  { id:"I2", apiId:537392, group:"I", matchday:1, t1:T("Iraq"),     t2:T("Norway"),  date:"2026-06-16", time:"22:00", venue:venue("I") },
  { id:"I3", apiId:537393, group:"I", matchday:2, t1:T("France"),   t2:T("Iraq"),    date:"2026-06-22", time:"21:00", venue:venue("I") },
  { id:"I4", apiId:537394, group:"I", matchday:2, t1:T("Norway"),   t2:T("Senegal"), date:"2026-06-23", time:"00:00", venue:venue("I") },
  { id:"I5", apiId:537395, group:"I", matchday:3, t1:T("Norway"),   t2:T("France"),  date:"2026-06-26", time:"19:00", venue:venue("I") },
  { id:"I6", apiId:537396, group:"I", matchday:3, t1:T("Senegal"),  t2:T("Iraq"),    date:"2026-06-26", time:"19:00", venue:venue("I") },
  // ── GROUP J ──────────────────────────────────────────────────────────────
  { id:"J1", apiId:537397, group:"J", matchday:1, t1:T("Argentina"), t2:T("Algeria"), date:"2026-06-17", time:"01:00", venue:venue("J") },
  { id:"J2", apiId:537398, group:"J", matchday:1, t1:T("Austria"),   t2:T("Jordan"),  date:"2026-06-17", time:"04:00", venue:venue("J") },
  { id:"J3", apiId:537399, group:"J", matchday:2, t1:T("Argentina"), t2:T("Austria"), date:"2026-06-22", time:"17:00", venue:venue("J") },
  { id:"J4", apiId:537400, group:"J", matchday:2, t1:T("Jordan"),    t2:T("Algeria"), date:"2026-06-23", time:"03:00", venue:venue("J") },
  { id:"J5", apiId:537401, group:"J", matchday:3, t1:T("Jordan"),    t2:T("Argentina"),date:"2026-06-28", time:"02:00", venue:venue("J") },
  { id:"J6", apiId:537402, group:"J", matchday:3, t1:T("Algeria"),   t2:T("Austria"), date:"2026-06-28", time:"02:00", venue:venue("J") },
  // ── GROUP K ──────────────────────────────────────────────────────────────
  { id:"K1", apiId:537403, group:"K", matchday:1, t1:T("Portugal"),   t2:T("Congo DR"),   date:"2026-06-17", time:"17:00", venue:venue("K") },
  { id:"K2", apiId:537404, group:"K", matchday:1, t1:T("Uzbekistan"), t2:T("Colombia"),   date:"2026-06-18", time:"02:00", venue:venue("K") },
  { id:"K3", apiId:537405, group:"K", matchday:2, t1:T("Portugal"),   t2:T("Uzbekistan"), date:"2026-06-23", time:"17:00", venue:venue("K") },
  { id:"K4", apiId:537406, group:"K", matchday:2, t1:T("Colombia"),   t2:T("Congo DR"),   date:"2026-06-24", time:"02:00", venue:venue("K") },
  { id:"K5", apiId:537407, group:"K", matchday:3, t1:T("Colombia"),   t2:T("Portugal"),   date:"2026-06-27", time:"23:30", venue:venue("K") },
  { id:"K6", apiId:537408, group:"K", matchday:3, t1:T("Congo DR"),   t2:T("Uzbekistan"), date:"2026-06-27", time:"23:30", venue:venue("K") },
  // ── GROUP L ──────────────────────────────────────────────────────────────
  { id:"L1", apiId:537409, group:"L", matchday:1, t1:T("England"),  t2:T("Croatia"), date:"2026-06-17", time:"20:00", venue:venue("L") },
  { id:"L2", apiId:537410, group:"L", matchday:1, t1:T("Ghana"),    t2:T("Panama"),  date:"2026-06-17", time:"23:00", venue:venue("L") },
  { id:"L3", apiId:537411, group:"L", matchday:2, t1:T("England"),  t2:T("Ghana"),   date:"2026-06-23", time:"20:00", venue:venue("L") },
  { id:"L4", apiId:537412, group:"L", matchday:2, t1:T("Panama"),   t2:T("Croatia"), date:"2026-06-23", time:"23:00", venue:venue("L") },
  { id:"L5", apiId:537413, group:"L", matchday:3, t1:T("Panama"),   t2:T("England"), date:"2026-06-27", time:"21:00", venue:venue("L") },
  { id:"L6", apiId:537414, group:"L", matchday:3, t1:T("Croatia"),  t2:T("Ghana"),   date:"2026-06-27", time:"21:00", venue:venue("L") },
];
