// src/screens/Offseason/components/ProgressTracker.jsx

import React from "react";
import styles from "./ProgressTracker.module.css";

const STEPS = [
  { id: "staff", label: "Staff Updates", phase: 1 },
  { id: "contracts", label: "Extend | Cut | Restructure", phase: 2 },
  { id: "freeAgency", label: "Free Agency", phase: 3 },
  { id: "preseason", label: "Preseason", phase: null },
  { id: "season", label: "Season", phase: null },
  { id: "playoffs", label: "Playoffs", phase: null },
];

export default function ProgressTracker({ currentPhase }) {
  return (
    <div className={styles.wrapper}>
      {STEPS.map((step, index) => {
        const isActive = step.phase === currentPhase;
        const isCompleted =
          step.phase !== null && step.phase < currentPhase;

        return (
          <div key={step.id} className={styles.stepWrapper}>
            <div
              className={`${styles.step} ${
                isActive ? styles.active : ""
              } ${isCompleted ? styles.completed : ""}`}
            >
              <span className={styles.stepLabel}>{step.label}</span>
            </div>
            {index < STEPS.length - 1 && (
              <div className={styles.connector} />
            )}
          </div>
        );
      })}
    </div>
  );
}