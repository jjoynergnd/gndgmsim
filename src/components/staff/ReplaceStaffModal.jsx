// src/components/staff/ReplaceStaffModal.jsx

import React from "react";
import { useFranchise } from "../../state/useFranchise.js";
import styles from "./ReplaceStaffModal.module.css";

export default function ReplaceStaffModal({ roleKey, onClose, onHire }) {
  const { franchise } = useFranchise();
  const { league } = franchise;

  const staffBudget = league.staffBudget;
  const pool = league.staffFreeAgents;

  const roleToCodeMap = {
    headCoach: "HC",
    offensiveCoordinator: "OC",
    defensiveCoordinator: "DC",
    strengthCoach: "STC",
    medicalDirector: "HAT",
    scoutingDirector: "HEAD_SCOUT",
  };

  const targetRoleCode = roleToCodeMap[roleKey];

  const candidates = pool
  .filter((c) => c.role === targetRoleCode)
  .sort((a, b) => computeRating(b) - computeRating(a));

  function computeRating(staffMember) {
    const values = Object.values(staffMember.attributes).filter(
      (v) => typeof v === "number"
    );
    return Math.floor(values.reduce((a, b) => a + b, 0) / values.length);
  }

  function canAfford(candidate) {
    const salary = candidate.contract.salary;
    return staffBudget.used + salary <= staffBudget.total;
  }

  function handleHire(candidate) {
    if (!canAfford(candidate)) return;
    onHire(roleKey, candidate);
  }

  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>Replace {roleKey}</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ✕
          </button>
        </div>

        <div className={styles.budgetLine}>
          Budget: ${staffBudget.used.toLocaleString()} /{" "}
          ${staffBudget.total.toLocaleString()}
        </div>

        <div className={styles.list}>
          {candidates.length === 0 && (
            <div className={styles.empty}>No available candidates for this role.</div>
          )}

          {candidates.map((c) => {
            const rating = computeRating(c);
            const affordable = canAfford(c);

            return (
              <button
                key={c.id}
                className={`${styles.candidate} ${
                  !affordable ? styles.candidateDisabled : ""
                }`}
                onClick={() => handleHire(c)}
                disabled={!affordable}
              >
                <div className={styles.candidateMain}>
                  <div className={styles.candidateName}>
                    {c.firstName} {c.lastName}
                  </div>
                  <div className={styles.candidateMeta}>
                    Age {c.age} • {c.yearsExperience} yrs exp
                  </div>
                </div>
                <div className={styles.candidateRight}>
                  <div className={styles.candidateRating}>OVR {rating}</div>
                  <div className={styles.candidateSalary}>
                    ${c.contract.salary.toLocaleString()}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}