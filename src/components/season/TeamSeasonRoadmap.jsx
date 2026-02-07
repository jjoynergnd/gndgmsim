import React from "react";
import styles from "./TeamSeasonRoadmap.module.css";

const PHASES = [
  { key: "PRESEASON", label: "Preseason" },
  { key: "REGULAR_SEASON", label: "Regular Season" },
  { key: "PLAYOFFS", label: "Playoffs" },
  { key: "OFFSEASON", label: "Offseason" },
];

const OFFSEASON_STEPS = [
  "Player Re-Signings",
  "Free Agency",
  "NFL Draft",
];

export default function TeamSeasonRoadmap({ season }) {
  if (!season) return null;

  const currentIndex = PHASES.findIndex(p => p.key === season.phase);

  return (
    <div className={styles.container}>
      <div className={styles.title}>Season Progress</div>

      <div className={styles.phases}>
        {PHASES.map((phase, index) => {
          const isCompleted = index < currentIndex;
          const isActive = index === currentIndex;

          return (
            <div
              key={phase.key}
              className={`${styles.phase}
                ${isCompleted ? styles.completed : ""}
                ${isActive ? styles.active : ""}
              `}
            >
              <div className={styles.phaseHeader}>
                <span>{phase.label}</span>

                {isActive && season.week && phase.key === "REGULAR_SEASON" && (
                  <span className={styles.subtle}>Week {season.week}</span>
                )}
              </div>

              {isActive && phase.key === "OFFSEASON" && (
                <div className={styles.subSteps}>
                  {OFFSEASON_STEPS.map(step => (
                    <div key={step} className={styles.subStep}>
                      {step}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
