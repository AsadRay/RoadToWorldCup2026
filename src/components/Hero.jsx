import { useLocation } from "react-router-dom";

const STEPS = [
  { path: "/build", label: "Pick group standings" },
  { path: "/thirds", label: "See best 3rd-place teams" },
  { path: "/bracket", label: "Fill the bracket" },
];

const BUILDER_PATHS = new Set(["/build", "/thirds", "/bracket"]);

export default function Hero() {
  const { pathname } = useLocation();
  if (!BUILDER_PATHS.has(pathname)) return null;
  const currentIdx = STEPS.findIndex((s) => s.path === pathname);

  return (
    <div className="hero">
      <p className="hero-eyebrow">FIFA World Cup 2026 · USA · Canada · Mexico</p>
      <h1>Build your <em>bracket</em></h1>
      <p className="hero-sub">48 teams · 12 groups · your picks, your champion</p>
      <div className="hero-steps">
        {STEPS.map((s, i) => {
          const isDone = i < currentIdx;
          const isCurrent = i === currentIdx;
          return (
            <>
              {i > 0 && <div key={`arrow-${i}`} className="hero-step-arrow">›</div>}
              <div key={s.path} className={`hero-step${isDone ? " done" : ""}${isCurrent ? " current" : ""}`}>
                <div className="hero-step-num">{isDone ? "✓" : i + 1}</div>
                <span>{s.label}</span>
              </div>
            </>
          );
        })}
      </div>
    </div>
  );
}
