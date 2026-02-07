import React from "react";
import styles from "./DepthChart.module.css";

export default function DepthChart({ roster = [], onPlayerClick = () => {} }) {
  if (!Array.isArray(roster)) {
    return (
      <div className={styles.container}>
        <div className={styles.debug}>DepthChart: roster is not an array</div>
      </div>
    );
  }

  // Group players by position
  const groups = roster.reduce((acc, player) => {
    const pos = player.position || "UNK";
    if (!acc[pos]) acc[pos] = [];
    acc[pos].push(player);
    return acc;
  }, {});

  // Sort each position by overall rating descending
  Object.values(groups).forEach(list => {
    list.sort((a, b) => (b?.ratings?.overall ?? 0) - (a?.ratings?.overall ?? 0));
  });

  return (
    <div className={styles.container}>
      {Object.entries(groups).map(([pos, players]) => (
        <div key={pos} className={styles.group}>
          <div className={styles.groupHeader}>{pos}</div>
          <div className={styles.players}>
            {players.map((p, index) => (
              <div
                key={`${p.name}-${index}`}
                className={styles.playerCard}
                onClick={() => onPlayerClick(p)}
              >
                <div className={styles.playerInfo}>
                  <div className={styles.playerName}>{p.name}</div>
                  <div className={styles.playerOvr}>OVR: {p?.ratings?.overall ?? "--"}</div>
                </div>
                <div className={styles.playerDepth}>#{index + 1}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
