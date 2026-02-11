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
  Object.keys(bracket).forEach((round) => {
    bracket[round].forEach((g) => {
      if (g.home === userTeamId || g.away === userTeamId) {
        userRun.push({ round, game: g });
      }
    });
  });

  return (
    <div className={styles.container}>
      {userRun.length > 0 && (
        <div className={styles.userRunBox}>
          <div className={styles.userRunHeader}>
            Your Playoff Run
          </div>
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

      {Object.keys(bracket).map((roundKey) => (
        <div key={roundKey} className={styles.roundSection}>
          <div className={styles.roundHeader}>
            {roundKey.replace("_", " ")}
          </div>

          <div className={styles.roundGrid}>
            {bracket[roundKey].map((g) => renderGame(g))}
          </div>
        </div>
      ))}
    </div>
  );
}
