import { useState, useEffect, useCallback } from "react";

export function useLiveScores() {
  const [scores, setScores] = useState({});   // keyed by football-data.org match id
  const [error, setError]   = useState(null);

  const apiKey = process.env.REACT_APP_FD_API_KEY;

  const fetchScores = useCallback(async () => {
    if (!apiKey) return;
    try {
      // Relative URL — CRA dev proxy forwards to https://api.football-data.org
      // This bypasses the CORS restriction (api only allows Origin: http://localhost, not :3000)
      const res = await fetch(
        "/v4/competitions/WC/matches?stage=GROUP_STAGE",
        { headers: { "X-Auth-Token": apiKey } }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const { matches } = await res.json();

      const map = {};
      matches.forEach((m) => {
        map[m.id] = {
          // TIMED = scheduled; IN_PLAY / PAUSED = live; FINISHED = done
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
    // Poll every 60 s — fine for free tier (10 req/min)
    const id = setInterval(fetchScores, 60_000);
    return () => clearInterval(id);
  }, [fetchScores]);

  // Lookup by the match's apiId field
  function getScore(apiId) {
    return scores[apiId] || null;
  }

  return { getScore, hasApi: !!apiKey, error };
}
