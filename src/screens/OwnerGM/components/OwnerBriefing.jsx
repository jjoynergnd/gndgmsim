import React from "react";
import styles from "./OwnerBriefing.module.css";

export default function OwnerBriefing({
  text,
  showNext,
  onNext,
  showNameSubmit,
  onSubmitName,
  gmName,
  reaction
}) {
  return (
    <div className={styles.card}>
      <h2 className={styles.header}>Owner Briefing</h2>

      {text && (
        <p key={text} className={styles.fadeIn}>
          {text}
        </p>
      )}

      {reaction && (
        <div className={`${styles.reaction} ${styles.fadeIn}`}>
          {reaction}
        </div>
      )}

      <div className={styles.actions}>
        {showNext && (
          <button className={styles.primary} onClick={onNext}>
            Next
          </button>
        )}

        {showNameSubmit && (
          <button
            className={styles.primary}
            onClick={onSubmitName}
            disabled={!gmName.trim()}
          >
            Tell the Owner
          </button>
        )}
      </div>
    </div>
  );
}