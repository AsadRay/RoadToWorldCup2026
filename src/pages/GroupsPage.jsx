import { useNavigate } from "react-router-dom";
import { GROUPS } from "../data/tournament";
import { useBracket } from "../context/BracketContext";
import { useToast } from "../components/Toast";

function GroupCard({ group }) {
  const { gW, gR, selectGroupTeam } = useBracket();
  const toast = useToast();
  const picked = (gW[group.id] ? 1 : 0) + (gR[group.id] ? 1 : 0);
  const isDone = picked === 2;

  function handleClick(team) {
    const isW = gW[group.id]?.n === team.n;
    const isR = gR[group.id]?.n === team.n;
    if (!isW && !isR && gW[group.id] && gR[group.id]) {
      toast(`Group ${group.id} full — click a pick to remove`);
      return;
    }
    selectGroupTeam(group.id, team);
    if (!isW && !isR) {
      if (!gW[group.id]) toast(`${team.f} ${team.n} → 1st place`);
      else toast(`${team.f} ${team.n} → 2nd place`);
    }
  }

  return (
    <div className="group-card">
      <div className="group-header">
        <span className="group-name">Group {group.id}</span>
        <span className={`group-status${isDone ? " done" : ""}`}>
          {isDone ? "✓ Done" : `${picked}/2`}
        </span>
      </div>
      {group.teams.map((t) => {
        const isW = gW[group.id]?.n === t.n;
        const isR = gR[group.id]?.n === t.n;
        return (
          <div
            key={t.n}
            className={`team-row${isW ? " pick-1" : isR ? " pick-2" : ""}`}
            onClick={() => handleClick(t)}
          >
            <span className="team-flag">{t.f}</span>
            <div className="team-info">
              <div className="team-name">{t.n}</div>
              <div className="team-rank">FIFA #{t.r}</div>
            </div>
            {isW && <span className="team-badge badge-1">1st</span>}
            {isR && <span className="team-badge badge-2">2nd</span>}
          </div>
        );
      })}
    </div>
  );
}

export default function GroupsPage() {
  const { allGroupsDone } = useBracket();
  const navigate = useNavigate();
  const toast = useToast();

  function proceed() {
    if (!allGroupsDone) { toast("Pick 1st & 2nd for all 12 groups first"); return; }
    navigate("/thirds");
  }

  return (
    <div className="page">
      <div className="sec-header">
        <h2>12 Groups · 48 Teams</h2>
        <div className="hint-pill">
          Click once for 1st place · click again for 2nd · click to remove
        </div>
      </div>
      <div className="groups-grid">
        {GROUPS.map((g) => <GroupCard key={g.id} group={g} />)}
      </div>
      <button className="proceed-btn" onClick={proceed} disabled={!allGroupsDone}>
        See 3rd-place qualifiers →
      </button>
    </div>
  );
}
