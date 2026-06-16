import { GROUPS } from "../data/tournament";
import { useGroupStandings } from "../hooks/useGroupStandings";

const API_NAME = {
  "United States":      "USA",
  "Turkey":             "Türkiye",
  "Ivory Coast":        "Côte d'Ivoire",
  "Bosnia-Herzegovina": "Bosnia",
  "Congo DR":           "DR Congo",
  "Cape Verde Islands": "Cabo Verde",
};

const FLAG = {};
GROUPS.forEach((g) => g.teams.forEach((t) => { FLAG[t.n] = t.f; }));

function getFlag(apiName) {
  if (!apiName) return "🏳️";
  const name = API_NAME[apiName] || apiName;
  return FLAG[name] || "🏳️";
}

function friendlyName(apiName) {
  return API_NAME[apiName] || apiName || "";
}

function GroupTable({ groupKey, table }) {
  const letter = groupKey.replace("GROUP_", "");
  return (
    <div className="group-card">
      <div className="group-header">
        <span className="group-name">Group {letter}</span>
        <span className="group-status">Top 2 advance</span>
      </div>
      <div className="st-table-wrap">
        <table className="st-table">
          <thead>
            <tr>
              <th className="st-pos">#</th>
              <th className="st-th-team">Team</th>
              <th>P</th>
              <th>W</th>
              <th>D</th>
              <th>L</th>
              <th>GD</th>
              <th className="st-pts">Pts</th>
            </tr>
          </thead>
          <tbody>
            {table.map((row, i) => {
              const flag = row.team?.flag || getFlag(row.team?.name);
              const name = friendlyName(row.team?.name);
              const gd = row.goalDifference;
              return (
                <tr key={row.team?.id || i} className={i < 2 ? "st-qualify" : ""}>
                  <td className="st-pos">{row.position}</td>
                  <td className="st-td-team">
                    <span className="st-flag">{flag}</span>
                    <span className="st-tname">{name}</span>
                  </td>
                  <td>{row.playedGames}</td>
                  <td>{row.won}</td>
                  <td>{row.draw}</td>
                  <td>{row.lost}</td>
                  <td>{gd > 0 ? `+${gd}` : gd}</td>
                  <td className="st-pts">{row.points}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function StandingsPage() {
  const { standings, loading, hasApi, error } = useGroupStandings();
  const groupKeys = Object.keys(standings).sort();

  return (
    <div className="page">
      <div className="sec-header">
        <h2>Group Stage · Standings</h2>
        <div className="hint-pill">
          {loading ? "Updating…" : "Top 2 per group qualify"}
        </div>
      </div>

      {!hasApi && (
        <div className="pred-api-note">
          Live standings need a <code>REACT_APP_FD_API_KEY</code> from football-data.org in your <code>.env</code> file
        </div>
      )}
      {error && <div className="pred-api-note error">Standings API error: {error}</div>}

      <div className="standings-grid">
        {groupKeys.map((key) => (
          <GroupTable key={key} groupKey={key} table={standings[key]} />
        ))}
      </div>
    </div>
  );
}
