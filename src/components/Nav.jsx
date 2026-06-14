import { useNavigate, useLocation } from "react-router-dom";
import { useBracket } from "../context/BracketContext";
import { useToast } from "./Toast";

export default function Nav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { totalPicked, allGroupsDone, resetAll } = useBracket();
  const toast = useToast();
  const page = location.pathname;

  function goTo(path) {
    if (path === "/thirds" && !allGroupsDone) {
      toast("Pick 1st & 2nd for all 12 groups first");
      return;
    }
    if (path === "/bracket" && !allGroupsDone) {
      toast("Complete all groups first");
      return;
    }
    navigate(path);
  }

  function tabClass(path) {
    const isActive = page === path;
    const isLocked =
      (path === "/thirds" || path === "/bracket") && !allGroupsDone;
    return `nav-tab${isActive ? " active" : ""}${isLocked ? " locked" : " unlocked"}`;
  }

  return (
    <nav className="nav">
      <div className="nav-logo-row">
        <a href="/" className="nav-logo" onClick={(e) => { e.preventDefault(); goTo("/"); }}>
          WC<span>2026</span>
        </a>
        <span className="progress-chip">
          <strong>{totalPicked}</strong>/24
        </span>
        <button className="nav-reset" onClick={resetAll}>Reset</button>
      </div>
      <div className="nav-tabs">
        <button className={tabClass("/")} onClick={() => goTo("/")}>
          <span>Groups</span>
          <span className="tab-num">1</span>
        </button>
        <button className={tabClass("/thirds")} onClick={() => goTo("/thirds")}>
          <span>3rd Place</span>
          <span className="tab-num">2</span>
        </button>
        <button className={tabClass("/bracket")} onClick={() => goTo("/bracket")}>
          <span>Bracket</span>
          <span className="tab-num">3</span>
        </button>
      </div>
    </nav>
  );
}
