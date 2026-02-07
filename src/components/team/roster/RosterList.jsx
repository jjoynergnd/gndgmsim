import React from "react";
import styles from "./RosterList.module.css";

const RosterList = ({ roster, onPlayerClick }) => {
  if (!roster) return null;

  const groups = {};
  roster.forEach((p) => {
    if (!groups[p.position]) groups[p.position] = [];
    groups[p.position].push(p);
  });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.position}>Pos</div>
        <div className={styles.name}>Name</div>
        <div className={styles.ovr}>OVR</div>
        <div className={styles.age}>Age</div>
      </div>

      {Object.keys(groups).map((pos) => {
        const groupClass = styles[`groupLabel_${pos}`] || styles.groupLabel;

        // Sort players by OVR descending
        const sortedPlayers = [...groups[pos]].sort(
          (a, b) => (b.ratings?.overall ?? 0) - (a.ratings?.overall ?? 0)
        );

        return (
          <div key={pos}>
            <div className={`${styles.groupLabel} ${groupClass}`}>
              {pos}
            </div>

            {sortedPlayers.map((player, idx) => {
              const ovr = player.ratings?.overall ?? "-";
              const ovrClass =
                ovr >= 90 ? styles.ovrElite :
                ovr >= 80 ? styles.ovrGreat :
                ovr >= 70 ? styles.ovrGood :
                styles.ovrLow;

              return (
                <div
                  key={idx}
                  className={styles.row}
                  onClick={() => onPlayerClick?.(player)}
                >
                  <div className={styles.position}>{player.position}</div>
                  <div className={styles.name}>{player.name}</div>
                  <div className={`${styles.ovr} ${ovrClass}`}>{ovr}</div>
                  <div className={styles.age}>{player.vitals?.age ?? "-"}</div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default RosterList;
