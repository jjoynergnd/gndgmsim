// src/screens/Offseason/components/StaffDecisionFooter.jsx

import React from "react";
import styles from "./StaffDecisionFooter.module.css";

export default function StaffDecisionFooter({ budget, onContinue }) {
  const current = budget?.current ?? 0;
  const max = budget?.max ?? 25_000_000;

  const pct = Math.min(100, Math.round((current / max) * 100));

  return (
    <div className={styles.footer}>
      <div className={styles.budget}>
        <div className={styles.budgetLabel}>Staff Budget</div>
        <div className={styles.budgetValue}>
          ${Math.round(current / 1_000_000)}M / $
          {Math.round(max / 1_000_000)}M
        </div>
        <div className={styles.budgetBar}>
          <div
            className={styles.budgetFill}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <button className={styles.cta} onClick={onContinue}>
        Continue to Player Contracts
      </button>
    </div>
  );
}