import { createContext, useContext, useState, useCallback } from "react";
import { GROUPS, T_MATCH_INDICES, R16_PAIRS, QF_PAIRS, SF_PAIRS } from "../data/tournament";

export const BracketContext = createContext(null);

export function BracketProvider({ children }) {
  const [gW, setGW] = useState({});   // group winners: { A: team, ... }
  const [gR, setGR] = useState({});   // group runners: { A: team, ... }
  const [r32, setR32] = useState({});
  const [r16, setR16] = useState({});
  const [qf, setQF] = useState({});
  const [sf, setSF] = useState({});
  const [fin, setFin] = useState(null);
  const [thirdPlace, setThirdPlace] = useState(null);

  // ── derived ──────────────────────────────────────────────
  const thirds = (() => {
    const candidates = GROUPS.map((g) => {
      const w = gW[g.id], r = gR[g.id];
      const remaining = g.teams.filter((t) => t.n !== w?.n && t.n !== r?.n);
      if (!remaining.length) return null;
      const best = [...remaining].sort((a, b) => a.r - b.r)[0];
      return { ...best, gid: g.id };
    }).filter(Boolean);
    return candidates.sort((a, b) => a.r - b.r);
  })();

  const allGroupsDone = GROUPS.every((g) => gW[g.id] && gR[g.id]);
  const totalPicked = GROUPS.reduce((s, g) => s + (gW[g.id] ? 1 : 0) + (gR[g.id] ? 1 : 0), 0);

  function resolveSlot(slot, matchIdx) {
    if (!slot) return null;
    if (slot[0] === "1") return gW[slot[1]] || null;
    if (slot[0] === "2") return gR[slot[1]] || null;
    if (slot === "T") {
      const tPos = T_MATCH_INDICES.indexOf(matchIdx);
      return tPos >= 0 ? thirds[tPos] || null : null;
    }
    return null;
  }

  function getSFLoser(sfIdx) {
    const winner = sf[sfIdx];
    if (!winner) return null;
    const pair = SF_PAIRS[sfIdx];
    const t1 = qf[pair[0]] || null;
    const t2 = qf[pair[1]] || null;
    if (!t1 || !t2) return null;
    return winner.n === t1.n ? t2 : t1;
  }

  // ── clear downstream ──────────────────────────────────────
  const clearFromR32 = useCallback((r32i) => {
    const r16i = R16_PAIRS.findIndex((p) => p[0] === r32i || p[1] === r32i);
    setR16((prev) => { const n = { ...prev }; delete n[r16i]; return n; });
    if (r16i >= 0) clearFromR16(r16i);
  }, []); // eslint-disable-line

  const clearFromR16 = useCallback((r16i) => {
    const qfi = QF_PAIRS.findIndex((p) => p[0] === r16i || p[1] === r16i);
    setQF((prev) => { const n = { ...prev }; delete n[qfi]; return n; });
    if (qfi >= 0) clearFromQF(qfi);
  }, []); // eslint-disable-line

  const clearFromQF = useCallback((qfi) => {
    const sfi = SF_PAIRS.findIndex((p) => p[0] === qfi || p[1] === qfi);
    setSF((prev) => { const n = { ...prev }; delete n[sfi]; return n; });
    setFin(null);
    setThirdPlace(null);
  }, []);

  // ── actions ──────────────────────────────────────────────
  const selectGroupTeam = useCallback((gId, team) => {
    const isW = gW[gId]?.n === team.n;
    const isR = gR[gId]?.n === team.n;
    if (isW) {
      setGW((p) => { const n = { ...p }; delete n[gId]; return n; });
      resetBracket(); return;
    }
    if (isR) {
      setGR((p) => { const n = { ...p }; delete n[gId]; return n; });
      resetBracket(); return;
    }
    if (!gW[gId]) {
      setGW((p) => ({ ...p, [gId]: team }));
      resetBracket(); return;
    }
    if (!gR[gId] && gW[gId]?.n !== team.n) {
      setGR((p) => ({ ...p, [gId]: team }));
      resetBracket(); return;
    }
  }, [gW, gR]); // eslint-disable-line

  const pickR32 = useCallback((idx, team) => {
    setR32((p) => ({ ...p, [idx]: team }));
    clearFromR32(idx);
  }, [clearFromR32]);

  const pickR16 = useCallback((idx, team) => {
    setR16((p) => ({ ...p, [idx]: team }));
    clearFromR16(idx);
  }, [clearFromR16]);

  const pickQF = useCallback((idx, team) => {
    setQF((p) => ({ ...p, [idx]: team }));
    clearFromQF(idx);
  }, [clearFromQF]);

  const pickSF = useCallback((idx, team) => {
    setSF((p) => ({ ...p, [idx]: team }));
    setFin(null);
    setThirdPlace(null);
  }, []);

  const pickFinal = useCallback((team) => setFin(team), []);
  const pickThirdPlace = useCallback((team) => setThirdPlace(team), []);

  function resetBracket() {
    setR32({}); setR16({}); setQF({}); setSF({});
    setFin(null); setThirdPlace(null);
  }

  const resetAll = useCallback(() => {
    setGW({}); setGR({});
    resetBracket();
  }, []);

  return (
    <BracketContext.Provider value={{
      gW, gR, thirds, allGroupsDone, totalPicked,
      r32, r16, qf, sf, fin, thirdPlace,
      resolveSlot, getSFLoser,
      selectGroupTeam,
      pickR32, pickR16, pickQF, pickSF, pickFinal, pickThirdPlace,
      resetAll,
    }}>
      {children}
    </BracketContext.Provider>
  );
}

export const useBracket = () => useContext(BracketContext);
