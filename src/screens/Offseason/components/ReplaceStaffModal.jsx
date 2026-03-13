// src/screens/Offseason/components/ReplaceStaffModal.jsx

import React from "react";
import styles from "./ReplaceStaffModal.module.css";
import StaffAttributeBars from "./StaffAttributeBars";

export default function ReplaceStaffModal({
  roleKey,
  candidates,
  onClose,
  onHire,
}) {
  if (!roleKey) return null;

  return (
    <div className={styles.backdrop}>
      <div className={styles.sheet}>
        <header className={styles.header}>
          <h2 className={styles.title}>Replace Staff</h2>
          <button className={styles.close} onClick={onClose}>
            ✕
          </button>
        </header>

        <p className={styles.subtitle}>
          Choose a new staff member for this role. Contract expectations and
          strengths vary by candidate.
        </p>

        <div className={styles.list}>
          {candidates.map((c) => {
            const fullName = `${c.firstName} ${c.lastName}`;
            const salary = c.contract?.salary ?? 0;
            const years = c.contract?.years ?? 0;

            const attrs = [
              {
                key: "impact",
                label: "Overall Impact",
                value: 80,
              },
            ];

            return (
              <div key={c.id} className={styles.card}>
                <div className={styles.cardHeader}>
                  <div>
                    <div className={styles.name}>{fullName}</div>
                    <div className={styles.meta}>
                      {c.roleName} • {years} yrs • $
                      {Math.round(salary / 1_000_000)}M
                    </div>
                  </div>
                </div>

                <div className={styles.attributes}>
                  <StaffAttributeBars attributes={attrs} />
                </div>

                <button
                  className={styles.hireButton}
                  onClick={() => onHire(c)}
                >
                  Hire
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}