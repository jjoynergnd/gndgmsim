// src/screens/StaffUpdate.jsx

import React, { useState } from "react";
import { useFranchise } from "../state/useFranchise.js";
import ReplaceStaffModal from "../components/staff/ReplaceStaffModal.jsx";
import styles from "./StaffUpdate.module.css";

// ---------------------------------------------
// PURE STAFF CARD COMPONENT (outside render)
// ---------------------------------------------
function StaffCard({ roleKey, staffMember, onReplace, computeRating }) {
  if (!staffMember) return null;

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h3>{staffMember.roleName}</h3>
        <button
          className={styles.replaceButton}
          onClick={() => onReplace(roleKey)}
        >
          Replace
        </button>
      </div>

      <div className={styles.cardBody}>
        <div className={styles.name}>
          {staffMember.firstName} {staffMember.lastName}
        </div>
        <div className={styles.meta}>
          Age {staffMember.age} • {staffMember.yearsExperience} yrs exp
        </div>
        <div className={styles.rating}>
          Rating: {computeRating(staffMember)}
        </div>
      </div>
    </div>
  );
}

export default function StaffUpdate() {
  const { franchise, updateFranchise } = useFranchise();
  const league = franchise.league;

  const [selectedRole, setSelectedRole] = useState(null);

  const staff = league.staff;
  const staffBudget = league.staffBudget;
  const reputation = league.user.reputation;

  // ---------------------------------------------
  // REPUTATION + RATING HELPERS
  // ---------------------------------------------
  function computeRating(staffMember) {
    const values = Object.values(staffMember.attributes).filter(
      (v) => typeof v === "number"
    );
    return Math.floor(values.reduce((a, b) => a + b, 0) / values.length);
  }

  function calculateReputationChange(currentScore, candidate, budgetTotal) {
    const rating = computeRating(candidate);

    let delta = 0;

    if (rating >= 85) {
      delta += budgetTotal <= 22000000 ? 15 : 10;
    }

    if (rating <= 65) {
      delta -= budgetTotal >= 28000000 ? 10 : 5;
    }

    return Math.max(0, Math.min(1000, currentScore + delta));
  }

  function getReputationTier(score) {
    if (score >= 850) return "Elite GM";
    if (score >= 650) return "Respected Executive";
    if (score >= 450) return "Emerging GM";
    return "Unknown GM";
  }

  // ---------------------------------------------
  // OPEN / CLOSE MODAL
  // ---------------------------------------------
  function openReplaceModal(roleKey) {
    setSelectedRole(roleKey);
  }

  function closeReplaceModal() {
    setSelectedRole(null);
  }

  // ---------------------------------------------
  // HANDLE STAFF HIRE
  // ---------------------------------------------
  function hireStaff(roleKey, candidate) {
    const salary = candidate.contract.salary;

    const updatedBudget = {
      ...staffBudget,
      used: staffBudget.used + salary,
    };

    const updatedPool = league.staffFreeAgents.filter(
      (c) => c.id !== candidate.id
    );

    const newRepScore = calculateReputationChange(
      reputation.score,
      candidate,
      staffBudget.total
    );

    const updatedReputation = {
      score: newRepScore,
      tier: getReputationTier(newRepScore),
    };

    const updatedStaff = {
      ...staff,
      [roleKey]: candidate,
    };

    updateFranchise({
      ...franchise,
      league: {
        ...league,
        staff: updatedStaff,
        staffBudget: updatedBudget,
        staffFreeAgents: updatedPool,
        user: {
          ...league.user,
          reputation: updatedReputation,
        },
      },
    });

    closeReplaceModal();
  }

  // ---------------------------------------------
  // RENDER
  // ---------------------------------------------
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Staff Update</h1>

      <div className={styles.budgetBox}>
        <div>
          <strong>Staff Budget:</strong>{" "}
          ${staffBudget.used.toLocaleString()} /{" "}
          ${staffBudget.total.toLocaleString()}
        </div>
        <div className={styles.reputationBadge}>
          {reputation.tier} ({reputation.score})
        </div>
      </div>

      <div className={styles.grid}>
        <StaffCard
          roleKey="headCoach"
          staffMember={staff?.headCoach}
          onReplace={openReplaceModal}
          computeRating={computeRating}
        />
        <StaffCard
          roleKey="offensiveCoordinator"
          staffMember={staff?.offensiveCoordinator}
          onReplace={openReplaceModal}
          computeRating={computeRating}
        />
        <StaffCard
          roleKey="defensiveCoordinator"
          staffMember={staff?.defensiveCoordinator}
          onReplace={openReplaceModal}
          computeRating={computeRating}
        />
        <StaffCard
          roleKey="strengthCoach"
          staffMember={staff?.strengthCoach}
          onReplace={openReplaceModal}
          computeRating={computeRating}
        />
        <StaffCard
          roleKey="medicalDirector"
          staffMember={staff?.medicalDirector}
          onReplace={openReplaceModal}
          computeRating={computeRating}
        />
        <StaffCard
          roleKey="scoutingDirector"
          staffMember={staff?.scoutingDirector}
          onReplace={openReplaceModal}
          computeRating={computeRating}
        />
      </div>

      {selectedRole && (
        <ReplaceStaffModal
          roleKey={selectedRole}
          onClose={closeReplaceModal}
          onHire={hireStaff}
        />
      )}
    </div>
  );
}