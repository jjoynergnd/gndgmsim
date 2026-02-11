// src/components/team/playoffs/PlayoffsTab.jsx
import React from "react";
import styles from "./PlayoffsTab.module.css";
import { teams } from "../../../data/teams";

export default function PlayoffsTab({ season, userTeamId }) {
  if (!season?.playoffs) {
    return (
      <div className={styles.container}>
        Playoffs have not been initialized yet.
      </div>
    );
  }

  const { bracket } = season.playoffs;

  const getTeamName = (id) => {
    const t = teams.find((x) => x.id === id);
    return t ? `${t.city} ${t.mascot}` : id;
  };

  const isUserTeam = (id) => id === userTeamId;

  const renderGame = (g) => {
    if (!g) return null;

    const played = g.played;
    const winner = played && (g.homeScore > g.awayScore ? g.home : g.away);

    const rowClass = (teamId) =>
      `${styles.teamRow} 
       ${winner === teamId ? styles.winner : ""} 
       ${isUserTeam(teamId) ? styles.userTeam : ""}`;

    return (
      <div key={g.id} className={styles.gameBox}>
        <div className={rowClass(g.home)}>
          <span className={styles.seed}>#{g.homeSeed}</span>
          <span>{getTeamName(g.home)}</span>
          {played && <span className={styles.score}>{g.homeScore}</span>}
        </div>

        <div className={rowClass(g.away)}>
          <span className={styles.seed}>#{g.awaySeed}</span>
          <span>{getTeamName(g.away)}</span>
          {played && <span className={styles.score}>{g.awayScore}</span>}
        </div>
      </div>
    );
  };

  // Build user team playoff run
  const userRun = [];
  ["WILDCARD", "DIVISIONAL", "CONFERENCE"].forEach((round) => {
    ["AFC", "NFC"].forEach((conf) => {
      const games = bracket[round]?.[conf] || [];
      games.forEach((g) => {
        if (g.home === userTeamId || g.away === userTeamId) {
          userRun.push({ round, game: g });
        }
      });
    });
  });

  const sbGame = bracket.SUPER_BOWL?.GAME;
  if (sbGame && (sbGame.home === userTeamId || sbGame.away === userTeamId)) {
    userRun.push({ round: "SUPER_BOWL", game: sbGame });
  }

  return (
    <div className={styles.container}>
      {userRun.length > 0 && (
        <div className={styles.userRunBox}>
          <div className={styles.userRunHeader}>Your Playoff Run</div>
          {userRun.map(({ round, game }) => (
            <div key={game.id} className={styles.userRunRow}>
              <strong>{round.replace("_", " ")}:</strong>
              <span>
                {getTeamName(game.home)} vs {getTeamName(game.away)}
              </span>
              {game.played && (
                <span className={styles.userRunScore}>
                  {game.homeScore} - {game.awayScore}
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      <div className={styles.bracketGrid}>
        {/* AFC side */}
        <div className={styles.confColumn}>
          <div className={styles.confHeader}>AFC</div>

          {["WILDCARD", "DIVISIONAL", "CONFERENCE"].map((round) => (
            <div key={round} className={styles.roundSection}>
              <div className={styles.roundHeader}>
                {round.replace("_", " ")}
              </div>
              <div className={styles.roundGrid}>
                {(bracket[round]?.AFC || []).map((g) => renderGame(g))}
              </div>
            </div>
          ))}
        </div>

        {/* Super Bowl center */}
        <div className={styles.centerColumn}>
          <div className={styles.confHeader}>SUPER BOWL</div>
          <div className={styles.roundSection}>
            <div className={styles.roundHeader}>Championship</div>
            <div className={styles.roundGrid}>
              {sbGame ? renderGame(sbGame) : <div>No matchup yet.</div>}
            </div>
          </div>
        </div>

        {/* NFC side */}
        <div className={styles.confColumn}>
          <div className={styles.confHeader}>NFC</div>

          {["WILDCARD", "DIVISIONAL", "CONFERENCE"].map((round) => (
            <div key={round} className={styles.roundSection}>
              <div className={styles.roundHeader}>
                {round.replace("_", " ")}
              </div>
              <div className={styles.roundGrid}>
                {(bracket[round]?.NFC || []).map((g) => renderGame(g))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
