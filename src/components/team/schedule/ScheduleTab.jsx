import React from "react";
import { teams } from "../../../data/teams";

import styles from "./ScheduleTab.module.css";

function getOpponentLabel(game) {
  if (game.result === "BYE" || game.opponent === null) {
    return "BYE WEEK";
  }

  const oppTeam = teams.find((t) => t.id === game.opponent);
  const oppName = oppTeam ? `${oppTeam.city} ${oppTeam.mascot}` : game.opponent;
  const prefix = game.home ? "vs" : "@";
  return `${prefix} ${oppName}`;
}

function getWeekLabel(game) {
  if (game.type === "REGULAR_SEASON") {
    return `Week ${game.week}`;
  }
  // Defensive only; preseason is filtered out.
  return `Pre ${game.week}`;
}

function getScoreLabel(game) {
  if (game.result === "BYE" || game.opponent === null) {
    return "-";
  }
  if (!game.played || game.scoreFor == null || game.scoreAgainst == null) {
    return "—";
  }
  return `${game.scoreFor} - ${game.scoreAgainst}`;
}

function getResultClass(result) {
  if (result === "W") return styles.resultWin;
  if (result === "L") return styles.resultLoss;
  if (result === "T") return styles.resultTie;
  if (result === "BYE") return styles.resultBye;
  return styles.resultNeutral;
}

export default function ScheduleTab({ schedule }) {
  if (!schedule || schedule.length === 0) {
    return <div>No schedule available.</div>;
  }

  const regularSeasonGames = schedule
    .filter((g) => g.type === "REGULAR_SEASON")
    .sort((a, b) => a.week - b.week);

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <div>Week</div>
        <div>Matchup</div>
        <div className={styles.center}>Score</div>
        <div className={styles.center}>Result</div>
      </div>

      {regularSeasonGames.map((game, idx) => (
        <div
          key={`${game.week}-${game.opponent ?? "BYE"}-${idx}`}
          className={styles.row}
        >
          <div>{getWeekLabel(game)}</div>
          <div>{getOpponentLabel(game)}</div>
          <div className={`${styles.center} ${styles.score}`}>
            {getScoreLabel(game)}
          </div>
          <div className={`${styles.center} ${getResultClass(game.result)}`}>
            {game.result === "BYE" ? "BYE" : game.result || ""}
          </div>
        </div>
      ))}
    </div>
  );
}
