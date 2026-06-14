import { GROUPS } from "../data/tournament";
import { useBracket } from "../context/BracketContext";

function QualRow({ pos, team, badge }) {
  return (
    <div className={`b-qual-row${!team ? " empty" : ""}`}>
      <span className="b-qual-pos">{pos}</span>
      {team ? (
        <>
          <span className="b-qual-flag">{team.f}</span>
          <span className="b-qual-name">{team.n}</span>
          {badge && <span className={`b-qual-badge ${badge}`}>{badge === "t" ? "3rd" : ""}</span>}
        </>
      ) : (
        <span className="b-qual-name">—</span>
      )}
    </div>
  );
}

export default function BracketSidebar() {
  const { gW, gR, thirds } = useBracket();

  return (
    <div className="b-sidebar">
      <div className="b-sidebar-hdr">32 Qualified teams</div>

      <div className="b-sidebar-section">
        <div className="b-sidebar-sublabel">Group winners (1st)</div>
        {GROUPS.map((g) => (
          <QualRow key={g.id} pos={`1${g.id}`} team={gW[g.id]} />
        ))}
      </div>

      <div className="b-sidebar-section">
        <div className="b-sidebar-sublabel">Runners-up (2nd)</div>
        {GROUPS.map((g) => (
          <QualRow key={g.id} pos={`2${g.id}`} team={gR[g.id]} />
        ))}
      </div>

      <div className="b-sidebar-section">
        <div className="b-sidebar-sublabel">Best 3rd-place (T1–T8)</div>
        {Array.from({ length: 8 }, (_, i) => (
          <QualRow key={i} pos={`T${i + 1}`} team={thirds[i]} badge="t" />
        ))}
      </div>
    </div>
  );
}
