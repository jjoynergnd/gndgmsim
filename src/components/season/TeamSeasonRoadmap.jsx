import React from "react";
import styles from "./TeamSeasonRoadmap.module.css";
import { getOffseasonSteps, getPlayoffRounds } from "../../utils/seasonEngine";

const PHASES = [
  { key: "PRESEASON", label: "Preseason" },
  { key: "REGULAR_SEASON", label: "Regular Season" },
  { key: "PLAYOFFS", label: "Playoffs" },
  { key: "OFFSEASON", label: "Offseason" },
];

export default function TeamSeasonRoadmap({ season, onSelectPhase }) {
  if (!season) return null;

  const currentIndex = PHASES.findIndex((p) => p.key === season.phase);
  const offseasonSteps = getOffseasonSteps();
  const playoffRounds = getPlayoffRounds();

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
                ${onSelectPhase ? styles.clickable : ""}
              `}
              onClick={() => onSelectPhase?.(phase.key)}
            >
              <div className={styles.phaseHeader}>
                <span>{phase.label}</span>

                {isActive &&
                  phase.key === "REGULAR_SEASON" &&
                  season.week && (
                    <span className={styles.subtle}>Week {season.week}</span>
                  )}

                {isActive &&
                  phase.key === "PLAYOFFS" &&
                  season.playoffRound && (
                    <span className={styles.subtle}>
                      {season.playoffRound.replace("_", " ")}
                    </span>
                  )}

                {isActive &&
                  phase.key === "OFFSEASON" &&
                  season.offseasonStep && (
                    <span className={styles.subtle}>
                      {season.offseasonStep.replace("_", " ")}
                    </span>
                  )}
              </div>

              {isActive && phase.key === "OFFSEASON" && (
                <div className={styles.subSteps}>
                  {offseasonSteps.map((step) => {
                    const isStepActive = step === season.offseasonStep;
                    return (
                      <div
                        key={step}
                        className={`${styles.subStep} ${
                          isStepActive ? styles.subStepActive : ""
                        }`}
                      >
                        {step.replace("_", " ")}
                      </div>
                    );
                  })}
                </div>
              )}

              {isActive && phase.key === "PLAYOFFS" && (
                <div className={styles.subSteps}>
                  {playoffRounds.map((round) => {
                    const isRoundActive = round === season.playoffRound;
                    return (
                      <div
                        key={round}
                        className={`${styles.subStep} ${
                          isRoundActive ? styles.subStepActive : ""
                        }`}
                      >
                        {round.replace("_", " ")}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
