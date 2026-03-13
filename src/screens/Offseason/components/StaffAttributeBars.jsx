// src/screens/Offseason/components/StaffAttributeBars.jsx

import React from "react";
import styles from "./StaffAttributeBars.module.css";

function toLetterGrade(value) {
  if (value >= 95) return "A+";
  if (value >= 90) return "A";
  if (value >= 85) return "A-";
  if (value >= 80) return "B+";
  if (value >= 75) return "B";
  if (value >= 70) return "B-";
  if (value >= 65) return "C+";
  if (value >= 60) return "C";
  return "C-";
}

export default function StaffAttributeBars({ attributes }) {
  return (
    <div className={styles.container}>
      {attributes.map((attr) => {
        const value = Math.max(0, Math.min(100, attr.value ?? 0));
        const grade = toLetterGrade(value);

        return (
          <div key={attr.key} className={styles.row}>
            <div className={styles.label}>{attr.label}</div>
            <div className={styles.barWrapper}>
              <div className={styles.barTrack}>
                <div
                  className={styles.barFill}
                  style={{ width: `${value}%` }}
                />
              </div>
              <div className={styles.grade}>{grade}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}