import { useState, useEffect, useCallback } from "react";

const isProd = process.env.NODE_ENV === "production";

export function useLiveScores() {
  const [scores, setScores] = useState({});
  const [error, setError]   = useState(null);

  const apiKey = process.env.REACT_APP_FD_API_KEY;

  const fetchScores = useCallback(async () => {
    if (!isProd && !apiKey) return;
    try {
      const url = isProd
        ? "/api/scores"
        : "https://api.football-data.org/v4/competitions/WC/matches?stage=GROUP_STAGE";
      const headers = isProd ? {} : { "X-Auth-Token": apiKey };

      const res = await fetch(url, { headers });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const { matches } = await res.json();

      const map = {};
      matches.forEach((m) => {
        map[m.id] = {
          status: m.status,
          home:   m.score?.fullTime?.home  ?? null,
          away:   m.score?.fullTime?.away  ?? null,
          ht:     m.score?.halfTime ? `${m.score.halfTime.home ?? "-"}–${m.score.halfTime.away ?? "-"}` : null,
        };
      });
      setScores(map);
      setError(null);
    } catch (e) {
      setError(e.message);
    }
  }, [apiKey]);

  useEffect(() => {
    fetchScores();
    const id = setInterval(fetchScores, 60_000);
    return () => clearInterval(id);
  }, [fetchScores]);

  function getScore(apiId) {
    return scores[apiId] || null;
  }

  return { getScore, hasApi: isProd || !!apiKey, error };
}
