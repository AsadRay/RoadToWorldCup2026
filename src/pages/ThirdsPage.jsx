import { useNavigate } from "react-router-dom";
import { useBracket } from "../context/BracketContext";

export default function ThirdsPage() {
  const { thirds } = useBracket();
  const navigate = useNavigate();

  return (
    <div className="page">
      <div className="sec-header">
        <h2>Best 8 Third-Place Teams</h2>
        <div className="hint-pill">
          Ranked by FIFA ranking · Top 8 advance to Round of 32
        </div>
      </div>

      <div className="thirds-layout">
        <div>
          <div className="thirds-table">
            <div className="table-header">
              <div>#</div>
              <div>Team</div>
              <div style={{ textAlign: "right" }}>FIFA</div>
              <div style={{ textAlign: "right" }}>Group</div>
              <div style={{ textAlign: "right" }}>Status</div>
            </div>

            {thirds.map((t, i) => (
              <>
                {i === 8 && (
                  <div key="cutoff" className="cutoff-line">
                    — Cutoff — 8 teams advance —
                  </div>
                )}
                <div key={t.n} className={`third-row${i < 8 ? " qualified" : " eliminated"}`}>
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
                    {i < 8
                      ? <span className="tr-q">Advances</span>
                      : <span className="tr-x">Eliminated</span>
                    }
                  </div>
                </div>
              </>
            ))}
          </div>

          <button className="proceed-btn" onClick={() => navigate("/bracket")} style={{ marginTop: "1rem" }}>
            Build the bracket →
          </button>
        </div>

        <div className="thirds-info">
          <div className="info-header">How it works</div>
          <div className="info-body">
            {[
              ["Total groups", "12"],
              ["Teams per group", "4"],
              ["Direct qualifiers", "24 (1st + 2nd)"],
              ["3rd-place spots", "8 of 12"],
              ["Total in R32", "32"],
            ].map(([label, val]) => (
              <div key={label} className="info-stat">
                <span className="info-stat-label">{label}</span>
                <span className="info-stat-val">{val}</span>
              </div>
            ))}
            <p className="info-note">
              Each group's 3rd-place team competes for 8 bonus spots. In real
              tournament play these are ranked by points → goal difference →
              goals scored. Here we use FIFA ranking as the tiebreaker since no
              matches have been played yet.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
