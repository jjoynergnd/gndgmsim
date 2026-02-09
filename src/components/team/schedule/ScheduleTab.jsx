import React from "react";
import styles from "./ScheduleTab.module.css";

const ScheduleTab = ({ schedule = [] }) => {
  if (!schedule.length) {
    return (
      <div className={styles.empty}>
        Schedule not available.
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {schedule.map((game) => {
        const {
          week,
          opponent,
          home,
          played,
          scoreFor,
          scoreAgainst,
          result
        } = game;

        const isWin = result === "W";
        const location = home ? "vs" : "@";

        return (
          <div
            key={week}
            className={`${styles.card} ${
              played ? styles.played : styles.upcoming
            }`}
          >
            <div className={styles.week}>Week {week}</div>

            <div className={styles.matchup}>
              <span className={styles.location}>{location}</span>
              <span className={styles.opponent}>{opponent}</span>
            </div>

            {played ? (
              <div
                className={`${styles.result} ${
                  isWin ? styles.win : styles.loss
                }`}
              >
                <span className={styles.record}>{result}</span>
                <span className={styles.score}>
                  {scoreFor}–{scoreAgainst}
                </span>
              </div>
            ) : (
              <div className={styles.pending}>Upcoming</div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ScheduleTab;
