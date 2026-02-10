import React from "react";
import styles from "./NextActionCard.module.css";

export default function NextActionCard({
  season,
  onAdvance,
  canAdvance = true,
  warnings = []
}) {
  if (!season) return null;

  const { title, subtitle, actionLabel } = getActionConfig(season);

  return (
    <div className={styles.container}>
      {/* LEFT COLUMN */}
      <div className={styles.leftCol}>
        <div className={styles.title}>{title}</div>
        <div className={styles.subtitle}>{subtitle}</div>

        {warnings.length > 0 && (
          <div className={styles.warningBlock}>
            <div className={styles.warningHeader}>Warnings</div>
            <ul className={styles.warningList}>
              {warnings.map((w, i) => (
                <li key={i}>{w}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* MIDDLE COLUMN */}
      <div className={styles.middleCol}>
        <button
          className={`${styles.button} ${!canAdvance ? styles.disabled : ""}`}
          disabled={!canAdvance}
          onClick={() => canAdvance && onAdvance?.(season)}
        >
          {actionLabel}
        </button>
      </div>

      {/* RIGHT COLUMN */}
      <div className={styles.rightCol}>
        <div className={styles.resultBlock}>
          {season.lastResult?.summary && (
            <div className={styles.resultSummary}>
              {season.lastResult.summary}
            </div>
          )}
          {season.lastResult?.details && (
            <div className={styles.resultDetails}>
              {season.lastResult.details}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function getActionConfig(season) {
  switch (season.phase) {
    case "PRESEASON":
      return {
        title: `Preseason — Week ${season.preseasonWeek}`,
        subtitle: `Preseason Week ${season.preseasonWeek}`,
        actionLabel: `Sim Preseason Week ${season.preseasonWeek}`
      };

    case "REGULAR_SEASON": {
      const prevWeekKey = `REGULAR_SEASON-${season.week - 1}`;
      const hasPrevWeek = season.gamesByKey?.[prevWeekKey];

      return {
        title: `Regular Season — Week ${season.week}`,
        subtitle: hasPrevWeek
          ? `Week ${season.week - 1} Complete`
          : `Ready to begin Week ${season.week}`,
        actionLabel: `Sim Week ${season.week}`
      };
    }

    case "PLAYOFFS":
      return {
        title: `Playoffs — ${season.playoffRound}`,
        subtitle: "Win or go home",
        actionLabel: "Sim Next Round"
      };

    case "OFFSEASON":
      return {
        title: `Offseason — ${season.offseasonStep}`,
        subtitle: "Team building phase",
        actionLabel: "Advance"
      };

    default:
      return {
        title: "Season",
        subtitle: "",
        actionLabel: "Advance"
      };
  }
}
