export const GROUPS = [
  { id: "A", teams: [{ n: "Mexico", f: "🇲🇽", r: 14 }, { n: "South Korea", f: "🇰🇷", r: 23 }, { n: "Czechia", f: "🇨🇿", r: 36 }, { n: "South Africa", f: "🇿🇦", r: 66 }] },
  { id: "B", teams: [{ n: "Switzerland", f: "🇨🇭", r: 21 }, { n: "Canada", f: "🇨🇦", r: 40 }, { n: "Qatar", f: "🇶🇦", r: 37 }, { n: "Bosnia", f: "🇧🇦", r: 63 }] },
  { id: "C", teams: [{ n: "Brazil", f: "🇧🇷", r: 5 }, { n: "Morocco", f: "🇲🇦", r: 8 }, { n: "Scotland", f: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", r: 39 }, { n: "Haiti", f: "🇭🇹", r: 95 }] },
  { id: "D", teams: [{ n: "USA", f: "🇺🇸", r: 16 }, { n: "Australia", f: "🇦🇺", r: 25 }, { n: "Türkiye", f: "🇹🇷", r: 31 }, { n: "Paraguay", f: "🇵🇾", r: 60 }] },
  { id: "E", teams: [{ n: "Germany", f: "🇩🇪", r: 10 }, { n: "Ecuador", f: "🇪🇨", r: 43 }, { n: "Côte d'Ivoire", f: "🇨🇮", r: 51 }, { n: "Curaçao", f: "🇨🇼", r: 84 }] },
  { id: "F", teams: [{ n: "Netherlands", f: "🇳🇱", r: 7 }, { n: "Japan", f: "🇯🇵", r: 18 }, { n: "Sweden", f: "🇸🇪", r: 27 }, { n: "Tunisia", f: "🇹🇳", r: 34 }] },
  { id: "G", teams: [{ n: "Belgium", f: "🇧🇪", r: 9 }, { n: "Iran", f: "🇮🇷", r: 28 }, { n: "Egypt", f: "🇪🇬", r: 46 }, { n: "New Zealand", f: "🇳🇿", r: 92 }] },
  { id: "H", teams: [{ n: "Spain", f: "🇪🇸", r: 2 }, { n: "Uruguay", f: "🇺🇾", r: 17 }, { n: "Saudi Arabia", f: "🇸🇦", r: 57 }, { n: "Cabo Verde", f: "🇨🇻", r: 83 }] },
  { id: "I", teams: [{ n: "France", f: "🇫🇷", r: 3 }, { n: "Senegal", f: "🇸🇳", r: 14 }, { n: "Norway", f: "🇳🇴", r: 29 }, { n: "Iraq", f: "🇮🇶", r: 68 }] },
  { id: "J", teams: [{ n: "Argentina", f: "🇦🇷", r: 1 }, { n: "Austria", f: "🇦🇹", r: 24 }, { n: "Algeria", f: "🇩🇿", r: 45 }, { n: "Jordan", f: "🇯🇴", r: 89 }] },
  { id: "K", teams: [{ n: "Portugal", f: "🇵🇹", r: 5 }, { n: "Colombia", f: "🇨🇴", r: 13 }, { n: "DR Congo", f: "🇨🇩", r: 55 }, { n: "Uzbekistan", f: "🇺🇿", r: 72 }] },
  { id: "L", teams: [{ n: "England", f: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", r: 4 }, { n: "Croatia", f: "🇭🇷", r: 11 }, { n: "Ghana", f: "🇬🇭", r: 58 }, { n: "Panama", f: "🇵🇦", r: 74 }] },
];

// Official FIFA 2026 fixed R32 bracket
// Slots: "1X"=winner group X, "2X"=runner group X, "T"=best 3rd (assigned in rank order)
export const R32_PAIRS = [
  ["1E", "T"],  // M1
  ["1I", "T"],  // M2
  ["2A", "2B"], // M3
  ["1F", "2C"], // M4
  ["2K", "2L"], // M5
  ["1H", "2J"], // M6
  ["1D", "T"],  // M7
  ["1G", "T"],  // M8
  ["1C", "2F"], // M9
  ["2E", "2I"], // M10
  ["1A", "T"],  // M11
  ["1L", "T"],  // M12
  ["1J", "2H"], // M13
  ["2D", "2G"], // M14
  ["1B", "T"],  // M15
  ["1K", "T"],  // M16
];

// T-slot match indices (0-based) — T1 goes to M1, T2 to M2, etc.
export const T_MATCH_INDICES = [0, 1, 6, 7, 10, 11, 14, 15];

// R16: [r32_match_a, r32_match_b]
export const R16_PAIRS = [
  [0, 1],   // R16-1: W(M1) vs W(M2)
  [2, 3],   // R16-2: W(M3) vs W(M4)
  [4, 5],   // R16-3: W(M5) vs W(M6)
  [6, 7],   // R16-4: W(M7) vs W(M8)
  [8, 9],   // R16-5: W(M9) vs W(M10)
  [10, 11], // R16-6: W(M11) vs W(M12)
  [12, 13], // R16-7: W(M13) vs W(M14)
  [14, 15], // R16-8: W(M15) vs W(M16)
];

// QF: [r16_a, r16_b]
export const QF_PAIRS = [
  [0, 1], // QF1
  [2, 3], // QF2
  [4, 5], // QF3
  [6, 7], // QF4
];

// SF: [qf_a, qf_b]
export const SF_PAIRS = [
  [0, 1], // SF1
  [2, 3], // SF2
];
