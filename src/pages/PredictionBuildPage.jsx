import { useState } from "react";
import { GROUPS } from "../data/tournament";
import { useBracket } from "../context/BracketContext";
import { usePrediction } from "../context/PredictionContext";
import { useToast } from "../components/Toast";
import BracketPage from "./BracketPage";

// ── Step 1: group picker ──────────────────────────────────────────────────────

function PredGroupCard({ group }) {
  const { gW, gR, selectGroupTeam } = useBracket(); // picks up prediction state
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

function GroupsStep() {
  return (
    <>
      <div className="sec-header">
        <h2>Pick Group Standings · 24 Teams</h2>
        <div className="hint-pill">Pick 1st &amp; 2nd for all 12 groups</div>
      </div>
      <div className="groups-grid">
        {GROUPS.map((g) => <PredGroupCard key={g.id} group={g} />)}
      </div>
    </>
  );
}

// ── Step 2: best 8 third-place ────────────────────────────────────────────────

function ThirdsStep() {
  const { thirds } = useBracket(); // prediction state
  return (
    <>
      <div className="sec-header">
        <h2>Best 8 Third-Place · Auto-Ranked</h2>
        <div className="hint-pill">Top 8 by FIFA ranking advance to Round of 32</div>
      </div>
      <div className="thirds-table">
        <div className="table-header">
          <div>#</div><div>Team</div>
          <div style={{ textAlign: "right" }}>FIFA</div>
          <div style={{ textAlign: "right" }}>Group</div>
          <div style={{ textAlign: "right" }}>Status</div>
        </div>
        {thirds.length === 0 && (
          <div style={{ padding: "1.5rem", color: "var(--ink-3)", textAlign: "center", fontSize: 13 }}>
            Complete Step 1 (group picks) first
          </div>
        )}
        {thirds.map((t, i) => (
          <div key={t.n}>
            {i === 8 && (
              <div className="cutoff-line">— Cutoff — 8 teams advance —</div>
            )}
            <div className={`third-row${i < 8 ? " qualified" : " eliminated"}`}>
              <div className={`tr-rank${i < 8 ? " top" : ""}`}>{i + 1}</div>
              <div className="tr-team">
                <span className="tr-flag">{t.f}</span>
                <div className="tr-info">
                  <div className="tr-name">{t.n}</div>
                  <div className="tr-group">Group {t.gid} · 3rd place</div>
                </div>
              </div>
              <div className="tr-val" style={{ textAlign: "right" }}>#{t.r}</div>
              <div className="tr-val" style={{ textAlign: "right" }}>3rd</div>
              <div className="tr-badge">
                {i < 8 ? <span className="tr-q">Advances</span> : <span className="tr-x">Eliminated</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

// ── Step 3: bracket ───────────────────────────────────────────────────────────
// BracketPage calls useBracket() which, inside PredictionProvider,
// returns prediction state. No changes needed to BracketPage at all.

function BracketStep() {
  return (
    <div className="pred-bracket-step">
      <BracketPage />
    </div>
  );
}

// ── Stepper shell ─────────────────────────────────────────────────────────────

const STEPS = [
  { label: "Select 24",  desc: "Group Stage" },
  { label: "Best 8",     desc: "3rd Place"   },
  { label: "Bracket",    desc: "Knockout"    },
];

export default function PredictionBuildPage() {
  const [step, setStep] = useState(0);
  const { allGroupsDone, totalPicked } = useBracket(); // prediction state
  const { resetAll } = usePrediction();

  const canNext =
    (step === 0 && allGroupsDone) ||
    (step === 1) ||
    (step === 2);

  return (
    <div className="page">
      {/* Stepper header */}
      <div className="pb-stepper">
        {STEPS.map((s, i) => (
          <button
            key={i}
            className={`pb-step${step === i ? " active" : ""}${i < step ? " done" : ""}`}
            onClick={() => { if (i < step || (i === 1 && allGroupsDone) || i === 0) setStep(i); }}
          >
            <span className="pb-step-num">{i < step ? "✓" : i + 1}</span>
            <span className="pb-step-label">{s.label}</span>
            <span className="pb-step-desc">{s.desc}</span>
          </button>
        ))}
        <button className="pb-reset" onClick={resetAll}>Reset prediction</button>
      </div>

      {/* Step progress pill */}
      {step === 0 && (
        <div className="pb-progress">
          {totalPicked}/24 group picks · {allGroupsDone ? "All done!" : "pick 1st & 2nd for every group"}
        </div>
      )}

      {/* Step content */}
      <div className="pb-content">
        {step === 0 && <GroupsStep />}
        {step === 1 && <ThirdsStep />}
        {step === 2 && <BracketStep />}
      </div>

      {/* Navigation */}
      {step < 2 && (
        <div className="pb-nav">
          {step > 0 && (
            <button className="pb-back-btn" onClick={() => setStep(step - 1)}>← Back</button>
          )}
          <button
            className="proceed-btn"
            style={{ flex: 1 }}
            disabled={!canNext}
            onClick={() => setStep(step + 1)}
          >
            {step === 0 ? `Next: Best 8 Third-Place Teams →` : `Next: Build the Bracket →`}
          </button>
        </div>
      )}
    </div>
  );
}
