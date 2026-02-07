import React from "react";
import styles from "./SeasonHeaderBar.module.css";

const PHASES = [
  { key: "PRESEASON", label: "Preseason" },
  { key: "REGULAR_SEASON", label: "Regular Season" },
  { key: "PLAYOFFS", label: "Playoffs" },
  { key: "OFFSEASON", label: "Offseason" },
];

export default function SeasonHeaderBar({ season }) {
  if (!season) return null;

  const { year, phase, week } = season;

  return (
    <div className={styles.container}>
      <div className={styles.year}>{year} Season</div>

      <div className={styles.phases}>
        {PHASES.map(p => {
          const isActive = p.key === phase;
          return (
            <div
              key={p.key}
              className={`${styles.phase} ${isActive ? styles.active : ""}`}
            >
              {p.label}
              {isActive && phase === "REGULAR_SEASON" && week && (
                <span className={styles.week}>Week {week}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
