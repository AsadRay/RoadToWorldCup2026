import { useNavigate } from "react-router-dom";
import { GROUPS, R32_PAIRS, R16_PAIRS, QF_PAIRS, SF_PAIRS } from "../data/tournament";
import { useBracket } from "../context/BracketContext";
import BracketSidebar from "../components/BracketSidebar";
import MatchCard from "../components/MatchCard";

function BracketRound({ label, children }) {
  return (
    <div className="b-round">
      <div className="b-round-label">{label}</div>
      <div className="b-matches">{children}</div>
    </div>
  );
}

function ChampionCard({ winner, third }) {
  function share() {
    navigator.clipboard.writeText(
      `🏆 My FIFA World Cup 2026 Champion: ${winner.f} ${winner.n}${third ? `\n🥉 3rd place: ${third.f} ${third.n}` : ""}`
    ).then(() => alert("Copied!")).catch(() => {});
  }

  return (
    <div className="champion-wrap">
      <div className="champ-trophy">🏆</div>
      <div className="champ-eyebrow">Your World Cup 2026 Champion</div>
      <span className="champ-flag">{winner.f}</span>
      <div className="champ-name">{winner.n}</div>
      {third && <div className="champ-third">🥉 3rd place: {third.f} {third.n}</div>}
      <button className="champ-share" onClick={share}>Copy bracket summary</button>
    </div>
  );
}

export default function BracketPage() {
  const {
    resolveSlot, getSFLoser,
    r32, r16, qf, sf, fin, thirdPlace,
    pickR32, pickR16, pickQF, pickSF, pickFinal, pickThirdPlace,
  } = useBracket();

  const tp1 = getSFLoser(0);
  const tp2 = getSFLoser(1);

  return (
    <div className="page">
      <div className="bracket-layout">
        <BracketSidebar />

        <div className="bracket-main">
          <div className="bracket-wrap">
            <div className="bracket-rounds">

              {/* Round of 32 */}
              <BracketRound label="Round of 32">
                {R32_PAIRS.map((pair, i) => (
                  <MatchCard
                    key={i}
                    label={`M${i + 1}${pair[1] === "T" ? " · 3rd" : ""}`}
                    t1={resolveSlot(pair[0], i)}
                    t2={resolveSlot(pair[1], i)}
                    winner={r32[i] || null}
                    onPick={(team) => pickR32(i, team)}
                  />
                ))}
              </BracketRound>

              {/* Round of 16 */}
              <BracketRound label="Round of 16">
                {R16_PAIRS.map((pair, i) => (
                  <MatchCard
                    key={i}
                    label={`R16-${i + 1}`}
                    t1={r32[pair[0]] || null}
                    t2={r32[pair[1]] || null}
                    winner={r16[i] || null}
                    onPick={(team) => pickR16(i, team)}
                  />
                ))}
              </BracketRound>

              {/* Quarterfinals */}
              <BracketRound label="Quarterfinals">
                {QF_PAIRS.map((pair, i) => (
                  <MatchCard
                    key={i}
                    label={`QF-${i + 1}`}
                    t1={r16[pair[0]] || null}
                    t2={r16[pair[1]] || null}
                    winner={qf[i] || null}
                    onPick={(team) => pickQF(i, team)}
                  />
                ))}
              </BracketRound>

              {/* Semifinals */}
              <BracketRound label="Semifinals">
                {SF_PAIRS.map((pair, i) => (
                  <MatchCard
                    key={i}
                    label={`SF-${i + 1}`}
                    t1={qf[pair[0]] || null}
                    t2={qf[pair[1]] || null}
                    winner={sf[i] || null}
                    onPick={(team) => pickSF(i, team)}
                  />
                ))}
              </BracketRound>

              {/* 3rd Place */}
              <BracketRound label="3rd Place · Jul 19">
                <MatchCard
                  label="🥉 3rd place"
                  t1={tp1}
                  t2={tp2}
                  winner={thirdPlace}
                  onPick={pickThirdPlace}
                />
              </BracketRound>

              {/* Final */}
              <BracketRound label="Final · Jul 19">
                <MatchCard
                  label="🏆 Final"
                  t1={sf[0] || null}
                  t2={sf[1] || null}
                  winner={fin}
                  onPick={pickFinal}
                />
              </BracketRound>

            </div>
          </div>

          {fin && <ChampionCard winner={fin} third={thirdPlace} />}
        </div>
      </div>
    </div>
  );
}
