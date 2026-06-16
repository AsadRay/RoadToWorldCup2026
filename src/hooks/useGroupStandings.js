import { useState, useEffect, useCallback } from "react";
import { GROUPS } from "../data/tournament";

const isProd = process.env.NODE_ENV === "production";

function buildFallback() {
  const map = {};
  GROUPS.forEach((g) => {
    map[`GROUP_${g.id}`] = g.teams.map((t, i) => ({
      position: i + 1,
      team: { name: t.n, flag: t.f },
      playedGames: 0, won: 0, draw: 0, lost: 0,
      points: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0,
    }));
  });
  return map;
}

export function useGroupStandings() {
  const [standings, setStandings] = useState(buildFallback);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiKey = process.env.REACT_APP_FD_API_KEY;

  const fetchStandings = useCallback(async () => {
    if (!isProd && !apiKey) return;
    setLoading(true);
    try {
      const url = isProd
        ? "/api/standings"
        : "https://api.football-data.org/v4/competitions/WC/standings";
      const headers = isProd ? {} : { "X-Auth-Token": apiKey };

      const res = await fetch(url, { headers });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const { standings: raw } = await res.json();

      const map = {};
      raw
        .filter((s) => s.type === "TOTAL")
        .forEach((s) => { map[s.group] = s.table; });
      setStandings(map);
      setError(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [apiKey]);

  useEffect(() => {
    fetchStandings();
    const id = setInterval(fetchStandings, 120_000);
    return () => clearInterval(id);
  }, [fetchStandings]);

  return { standings, loading, hasApi: isProd || !!apiKey, error };
}
