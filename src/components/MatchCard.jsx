export default function MatchCard({ label, t1, t2, winner, onPick }) {
  function handleClick(team) {
    if (!team || !t1 || !t2) return;
    if (onPick) onPick(team);
  }

  return (
    <div className="b-match">
      {label && <div className="b-match-label">{label}</div>}
      {[t1, t2].map((team, i) => {
        const isTbd = !team;
        const isWin = winner && team && winner.n === team.n;
        return (
          <>
            {i === 1 && <div key="vs" className="b-vs">vs</div>}
            <button
              key={team ? team.n : `tbd-${i}`}
              className={`b-team${isTbd ? " tbd" : ""}${isWin ? " winner" : ""}`}
              onClick={() => handleClick(team)}
              disabled={isTbd || !t1 || !t2}
            >
              <span className="b-tflag">{team ? team.f : ""}</span>
              <span className="b-tname">{team ? team.n : "TBD"}</span>
              {isWin && <span className="b-check">✓</span>}
            </button>
          </>
        );
      })}
    </div>
  );
}
