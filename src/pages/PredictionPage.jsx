import { useState, useMemo, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { GROUP_MATCHES } from "../data/matches";
import { TEAM_STATS } from "../data/teamStats";
import { useLiveScores } from "../hooks/useLiveScores";

const TODAY = new Date();

function getLocalStatus(date, time) {
  const dt = new Date(`${date}T${time}:00`);
  if (dt < TODAY) return "FT";
  if ((dt - TODAY) / 3_600_000 < 2) return "LIVE";
  return null;
}

function calcProb(r1, r2) {
  const s1 = Math.max(10, 100 - r1 * 0.8);
  const s2 = Math.max(10, 100 - r2 * 0.8);
  const raw = s1 / (s1 + s2);
  const draw = Math.max(0.10, Math.min(0.30, 0.27 - Math.abs(raw - 0.5) * 0.35));
  const t1 = Math.round(raw * (1 - draw) * 100);
  const t2 = Math.round((1 - raw) * (1 - draw) * 100);
  return { t1, t2, draw: 100 - t1 - t2 };
}

function FormDots({ form }) {
  return (
    <span className="pred-form">
      {form.split("").map((c, i) => (
        <span key={i} className={`pred-form-dot ${c === "W" ? "w" : c === "D" ? "d" : "l"}`}>{c}</span>
      ))}
    </span>
  );
}

const LIVE_URL = "https://www.livesports088.is/football.html";

function highlightsUrl(t1name, t2name) {
  const q = encodeURIComponent(`FIFA World Cup 2026 ${t1name} vs ${t2name} highlights`);
  return `https://www.youtube.com/results?search_query=${q}`;
}

// watchState: "highlights" | "live" | "upcoming"
function MatchStats({ t1, t2, watchState }) {
  const prob = calcProb(t1.r, t2.r);
  const s1 = TEAM_STATS[t1.n] || { attack: 60, defense: 60, form: "DDDDD", players: [] };
  const s2 = TEAM_STATS[t2.n] || { attack: 60, defense: 60, form: "DDDDD", players: [] };

  return (
    <div className="pred-stats">
      <div className="pred-stats-block">
        <div className="pred-stats-heading">Win Probability</div>
        <div className="pred-prob-row">
          <span className="pred-prob-label t1">{t1.f} {prob.t1}%</span>
          <div className="pred-prob-track">
            <div className="pred-prob-fill t1-fill" style={{ width: `${prob.t1}%` }} />
            <div className="pred-prob-fill draw-fill" style={{ width: `${prob.draw}%` }} />
            <div className="pred-prob-fill t2-fill" style={{ width: `${prob.t2}%` }} />
          </div>
          <span className="pred-prob-label t2">{prob.t2}% {t2.f}</span>
        </div>
        <div className="pred-draw-note">Draw chance: {prob.draw}%</div>
      </div>

      <div className="pred-stats-block">
        <div className="pred-stats-heading">Squad Stats</div>
        <div className="pred-squad-table">
          <div className="pred-squad-row header">
            <span />
            <span>{t1.f} {t1.n}</span>
            <span>{t2.f} {t2.n}</span>
          </div>
          {[
            ["Attack",   s1.attack,  s2.attack],
            ["Defense",  s1.defense, s2.defense],
            ["FIFA Rank",t1.r,       t2.r, true],
          ].map(([label, v1, v2, lower]) => (
            <div key={label} className="pred-squad-row">
              <span>{label}</span>
              <span className={(!lower ? v1 > v2 : v1 < v2) ? "stat-higher" : ""}>
                {lower ? `#${v1}` : v1}
              </span>
              <span className={(!lower ? v2 > v1 : v2 < v1) ? "stat-higher" : ""}>
                {lower ? `#${v2}` : v2}
              </span>
            </div>
          ))}
          <div className="pred-squad-row">
            <span>Form</span>
            <span><FormDots form={s1.form} /></span>
            <span><FormDots form={s2.form} /></span>
          </div>
        </div>
      </div>

      <div className="pred-stats-block">
        <div className="pred-stats-heading">Key Players</div>
        <div className="pred-players-grid">
          <div className="pred-players-col">
            <div className="pred-players-team">{t1.f} {t1.n}</div>
            {s1.players.map((p) => <div key={p} className="pred-player-name">{p}</div>)}
          </div>
          <div className="pred-players-col">
            <div className="pred-players-team">{t2.f} {t2.n}</div>
            {s2.players.map((p) => <div key={p} className="pred-player-name">{p}</div>)}
          </div>
        </div>
      </div>

      <button
        className={`pred-watch-btn${watchState === "upcoming" ? " unavailable" : ""}`}
        disabled={watchState === "upcoming"}
        onClick={(e) => {
          e.stopPropagation();
          window.open(watchState === "highlights" ? highlightsUrl(t1.n, t2.n) : LIVE_URL, "_blank", "noopener,noreferrer");
        }}
      >
        {watchState === "highlights" ? "Watch Highlights →" : watchState === "live" ? "Watch Live →" : "Watch Live Available on Match Day"}
      </button>
    </div>
  );
}

function ScoreBadge({ scoreData, localStatus, date, time }) {
  if (scoreData) {
    const { status, home, away } = scoreData;
    const hasScore = home !== null && away !== null;
    if (status === "IN_PLAY" || status === "PAUSED") {
      return <span className="pred-status live">● LIVE{hasScore ? ` · ${home}–${away}` : ""}</span>;
    }
    if (status === "FINISHED") {
      return <span className="pred-status ft">FT{hasScore ? ` · ${home}–${away}` : ""}</span>;
    }
    // TIMED = upcoming per football-data.org — fall through to time display
  }
  // fallback: use local date/time
  if (localStatus === "LIVE") return <span className="pred-status live">● LIVE</span>;
  if (localStatus === "FT")   return <span className="pred-status ft">FT</span>;
  const label = new Date(date + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return <span className="pred-status upcoming">{label} · {time} UTC</span>;
}

function MatchCard({ match, getScore }) {
  const [open, setOpen] = useState(false);
  const localStatus = getLocalStatus(match.date, match.time);
  const scoreData = getScore(match.apiId);  // reliable ID-based lookup

  const hasLiveScore = scoreData &&
    (scoreData.status === "IN_PLAY" || scoreData.status === "PAUSED" || scoreData.status === "FINISHED") &&
    scoreData.home !== null;

  const isFinished = scoreData?.status === "FINISHED" || localStatus === "FT";
  const isLive = scoreData?.status === "IN_PLAY" || scoreData?.status === "PAUSED" || localStatus === "LIVE";
  const watchState = isFinished ? "highlights" : isLive ? "live" : "upcoming";

  return (
    <div className={`pred-match${open ? " expanded" : ""}`} onClick={() => setOpen((v) => !v)}>
      <div className="pred-match-main">
        <div className="pred-teams">
          <div className="pred-team">
            <span className="pred-team-flag">{match.t1.f}</span>
            <span className="pred-team-name">{match.t1.n}</span>
          </div>
          {hasLiveScore ? (
            <div className="pred-score-center">
              <span className="pred-score">{scoreData.home} – {scoreData.away}</span>
              {scoreData.ht && scoreData.status === "FINISHED" && (
                <span className="pred-ht">HT {scoreData.ht}</span>
              )}
            </div>
          ) : (
            <div className="pred-vs">VS</div>
          )}
          <div className="pred-team right">
            <span className="pred-team-name">{match.t2.n}</span>
            <span className="pred-team-flag">{match.t2.f}</span>
          </div>
        </div>
        <div className="pred-match-footer">
          <span className="pred-match-meta">Group {match.group} · {match.venue}</span>
          <div className="pred-match-right">
            <ScoreBadge scoreData={scoreData} localStatus={localStatus} date={match.date} time={match.time} />
            <span className="pred-arrow">{open ? "▲" : "▼"}</span>
          </div>
        </div>
      </div>
      {open && <MatchStats t1={match.t1} t2={match.t2} watchState={watchState} />}
    </div>
  );
}

const MD_LABELS = ["All Matches", "1st Week", "2nd Week", "3rd Week"];

export default function PredictionPage() {
  const [mdFilter, setMdFilter] = useState(0);
  const navigate = useNavigate();
  const { getScore, hasApi, error } = useLiveScores();

  const filtered = useMemo(() =>
    mdFilter === 0 ? GROUP_MATCHES : GROUP_MATCHES.filter((m) => m.matchday === mdFilter),
    [mdFilter]
  );

  const byDate = useMemo(() => {
    const map = new Map();
    filtered.forEach((m) => {
      if (!map.has(m.date)) map.set(m.date, []);
      map.get(m.date).push(m);
    });
    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [filtered]);

  return (
    <div className="page">
      <div className="schedule-hero">
        <div className="sh-top">
          <span className="sh-trophy">🏆</span>
          <div className="sh-title-block">
            <div className="sh-eyebrow">FIFA World Cup</div>
            <div className="sh-year">2026</div>
          </div>
          <div className="sh-hosts">🇺🇸 USA &nbsp;·&nbsp; 🇨🇦 Canada &nbsp;·&nbsp; 🇲🇽 Mexico</div>
        </div>
        <div className="sh-stats">
          {[["48","Teams"],["12","Groups"],["104","Matches"],["3","Nations"]].map(([num, label], i, arr) => (
            <Fragment key={label}>
              <div className="sh-stat">
                <div className="sh-stat-num">{num}</div>
                <div className="sh-stat-label">{label}</div>
              </div>
              {i < arr.length - 1 && <div className="sh-divider" />}
            </Fragment>
          ))}
        </div>
        <button className="sh-cta" onClick={() => navigate("/build")}>
          Build your Prediction →
        </button>
      </div>

      <div className="sec-header">
        <h2>Group Stage · Match Schedule</h2>
        <div className="hint-pill">Click any match to see win chances &amp; squad stats</div>
      </div>

      {/* API status */}
      {!hasApi && (
        <div className="pred-api-note">
          Live scores need a <code>REACT_APP_FD_API_KEY</code> from football-data.org in your <code>.env</code> file
        </div>
      )}
      {error && <div className="pred-api-note error">Score API error: {error}</div>}

      <div className="pred-filters">
        {MD_LABELS.map((label, i) => (
          <button
            key={i}
            className={`pred-filter-btn${mdFilter === i ? " active" : ""}`}
            onClick={() => setMdFilter(i)}
          >
            {label}
          </button>
        ))}
      </div>

      {byDate.map(([date, matches]) => {
        const label = new Date(date + "T12:00:00").toLocaleDateString("en-US", {
          weekday: "long", month: "long", day: "numeric", year: "numeric",
        });
        return (
          <div key={date} className="pred-date-section">
            <div className="pred-date-label">{label}</div>
            <div className="pred-matches">
              {matches.map((m) => <MatchCard key={m.id} match={m} getScore={getScore} />)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
