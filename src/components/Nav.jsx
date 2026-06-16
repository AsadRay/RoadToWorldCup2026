import { useNavigate, useLocation } from "react-router-dom";
import { useBracket } from "../context/BracketContext";

const BUILDER_PATHS = new Set(["/build", "/thirds", "/bracket"]);

export default function Nav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { totalPicked, resetAll } = useBracket();
  const page = location.pathname;
  const isBuilder = BUILDER_PATHS.has(page);

  function goTo(path) {
    navigate(path);
  }

  function tabClass(path) {
    return `nav-tab${page === path ? " active" : " unlocked"}`;
  }

  return (
    <nav className="nav">
      <div className="nav-logo-row">
        <a href="/" className="nav-logo" onClick={(e) => { e.preventDefault(); goTo("/"); }}>
          WC<span>2026</span>
        </a>
        {isBuilder && (
          <>
            <span className="progress-chip">
              <strong>{totalPicked}</strong>/24
            </span>
            <button className="nav-reset" onClick={resetAll}>Reset</button>
          </>
        )}
      </div>
      <div className="nav-tabs">
        <button className={tabClass("/")} onClick={() => goTo("/")}>
          <span>Schedule</span>
        </button>
        <button className={tabClass("/prediction")} onClick={() => goTo("/prediction")}>
          <span>Groups</span>
        </button>
      </div>
    </nav>
  );
}
