// src/screens/Offseason/StaffUpdate.jsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./StaffUpdate.module.css";

import { loadFranchise } from "../../franchise/loadFranchise";
import { saveFranchise } from "../../franchise/saveFranchise";

import ProgressTracker from "./components/ProgressTracker";
import StaffCategoryCard from "./components/StaffCategoryCard";
import StaffDecisionFooter from "./components/StaffDecisionFooter";
import ReplaceStaffModal from "./components/ReplaceStaffModal";

export default function StaffUpdate() {
  const [franchise, setFranchise] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalRoleKey, setModalRoleKey] = useState(null);
  const [modalCandidates, setModalCandidates] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const f = loadFranchise();

    // Defer state update to avoid React 19 sync-effect warning
    Promise.resolve().then(() => {
      if (!f) {
        navigate("/main-menu");
        return;
      }

      // Validate offseason phase
      if (!f.league?.offseason || f.league.offseason.phase < 1) {
        navigate("/offseason");
        return;
      }

      setFranchise(f);
    });
  }, [navigate]);

  if (!franchise) {
    return <div className={styles.loading}>Loading Staff...</div>;
  }

  const { league } = franchise;
  const gmProfile = league.gmProfile;
  const ownerProfile = league.ownerProfile;
  const staff = league.staff || {};
  const staffBudget = league.staffBudget || { current: 0, max: 25_000_000 };

  const handleKeepStaff = () => {
    // No-op for now, but we could track "kept vs replaced" if needed
  };

  const openReplaceModal = (roleKey) => {
    const current = staff[roleKey];
    if (!current) return;

    const candidates = generateCandidatesForRole(current);
    setModalRoleKey(roleKey);
    setModalCandidates(candidates);
    setShowModal(true);
  };

  const handleHireCandidate = (candidate) => {
    if (!modalRoleKey) return;

    const updatedFranchise = { ...franchise };
    const updatedLeague = { ...updatedFranchise.league };
    const updatedStaff = { ...(updatedLeague.staff || {}) };

    const previous = updatedStaff[modalRoleKey];

    updatedStaff[modalRoleKey] = candidate;

    // Update budget: replace old salary with new
    const prevSalary = previous?.contract?.salary ?? 0;
    const newSalary = candidate.contract.salary;

    const currentBudget = updatedLeague.staffBudget || {
      current: 0,
      max: 25_000_000,
    };

    const newCurrent =
      currentBudget.current - prevSalary + newSalary;

    updatedLeague.staff = updatedStaff;
    updatedLeague.staffBudget = {
      ...currentBudget,
      current: newCurrent,
    };

    updatedFranchise.league = updatedLeague;

    setFranchise(updatedFranchise);
    saveFranchise(updatedFranchise);

    setShowModal(false);
    setModalRoleKey(null);
    setModalCandidates([]);
  };

  const handleContinue = () => {
    const updatedFranchise = { ...franchise };

    // Advance offseason phase
    updatedFranchise.league.offseason.phase = 2;
    updatedFranchise.meta.currentPhase = "OFFSEASON_CONTRACTS";

    saveFranchise(updatedFranchise);
    setFranchise(updatedFranchise);

    // TODO: when contracts screen exists, update this route
    navigate("/offseason");
  };

  const badges = buildContextBadges(gmProfile, ownerProfile, staff);

  return (
    <div className={styles.page}>
      {/* Top Banner */}
      <header className={styles.header}>
        <h1 className={styles.title}>Front Office Briefing</h1>
        <p className={styles.subtitle}>
          Now that you've taken control of the franchise, you must decide
          whether to retain the current staff or bring in your own people.
        </p>

        <div className={styles.badgeRow}>
          {badges.map((badge) => (
            <span key={badge.label} className={styles.badge}>
              <span className={styles.badgeLabel}>{badge.label}</span>
              <span className={styles.badgeValue}>{badge.value}</span>
            </span>
          ))}
        </div>
      </header>

      {/* Progress / Roadmap */}
      <div className={styles.progressWrapper}>
        <ProgressTracker
          currentPhase={franchise.league.offseason.phase}
        />
      </div>

      {/* Staff Cards */}
      <section className={styles.cardsSection}>
        <h2 className={styles.sectionTitle}>Staff Decisions</h2>
        <p className={styles.sectionSubtitle}>
          Review your key staff roles. Keep trusted voices or replace them
          with new hires that better match your philosophy.
        </p>

        <div className={styles.cardsGrid}>
          {renderStaffCard("headCoach", "Head Coach", staff, gmProfile, handleKeepStaff, openReplaceModal)}
          {renderStaffCard("offensiveCoordinator", "Offensive Coordinator", staff, gmProfile, handleKeepStaff, openReplaceModal)}
          {renderStaffCard("defensiveCoordinator", "Defensive Coordinator", staff, gmProfile, handleKeepStaff, openReplaceModal)}
          {renderStaffCard("scoutingDirector", "Scouting Director", staff, gmProfile, handleKeepStaff, openReplaceModal)}
          {renderStaffCard("medicalDirector", "Medical Director", staff, gmProfile, handleKeepStaff, openReplaceModal)}
          {renderStaffCard("strengthCoach", "Strength & Conditioning", staff, gmProfile, handleKeepStaff, openReplaceModal)}
        </div>
      </section>

      {/* Sticky Footer */}
      <StaffDecisionFooter
        budget={staffBudget}
        onContinue={handleContinue}
      />

      {/* Replace Modal */}
      {showModal && (
        <ReplaceStaffModal
          roleKey={modalRoleKey}
          candidates={modalCandidates}
          onClose={() => setShowModal(false)}
          onHire={handleHireCandidate}
        />
      )}
    </div>
  );
}

// ------------------------------
// Helpers
// ------------------------------
function buildContextBadges(gmProfile, ownerProfile, staff) {
  const gmLabel = gmProfile?.type
    ? gmProfile.type
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (c) => c.toUpperCase())
    : "Unknown";

  const ownerType = ownerProfile?.type || "Unknown";
  const ownerExpectation =
    ownerType === "spender"
      ? "Aggressive spender"
      : ownerType === "budget"
      ? "Cost-conscious"
      : "Balanced";

  const staffQuality = estimateStaffQuality(staff);

  return [
    {
      label: "GM Philosophy",
      value: gmLabel,
    },
    {
      label: "Owner",
      value: ownerProfile?.name || "Unknown Owner",
    },
    {
      label: "Owner Focus",
      value: ownerExpectation,
    },
    {
      label: "Staff Snapshot",
      value: staffQuality,
    },
  ];
}

function estimateStaffQuality(staff) {
  const members = Object.values(staff || {}).filter(Boolean);
  if (members.length === 0) return "Unknown";

  let total = 0;
  let count = 0;

  members.forEach((m) => {
    const attrs = m.attributes || {};
    const numericKeys = Object.keys(attrs).filter(
      (k) => typeof attrs[k] === "number"
    );
    if (numericKeys.length === 0) return;
    const avg =
      numericKeys.reduce((sum, k) => sum + attrs[k], 0) /
      numericKeys.length;
    total += avg;
    count++;
  });

  if (count === 0) return "Unknown";

  const overall = total / count;

  if (overall >= 90) return "A";
  if (overall >= 80) return "B+";
  if (overall >= 75) return "B";
  if (overall >= 65) return "C+";
  return "C";
}

function renderStaffCard(
  roleKey,
  label,
  staff,
  gmProfile,
  onKeep,
  onReplace
) {
  const member = staff[roleKey];
  if (!member) return null;

  return (
    <StaffCategoryCard
      key={roleKey}
      roleKey={roleKey}
      displayRole={label}
      staffMember={member}
      gmProfile={gmProfile}
      onKeep={() => onKeep(roleKey)}
      onReplace={() => onReplace(roleKey)}
    />
  );
}

function generateCandidatesForRole(current) {
  const baseSalary = current.contract?.salary || 2_000_000;

  const makeCandidate = (delta, labelSuffix) => {
    const salary = Math.round(baseSalary * (1 + delta));
    return {
      ...current,
      id: `${current.id}-${labelSuffix}`,
      firstName: current.firstName,
      lastName: `${current.lastName} ${labelSuffix}`,
      contract: {
        years: current.contract.years,
        salary,
      },
    };
  };

  return [
    makeCandidate(-0.1, "Jr."),
    makeCandidate(0.0, "II"),
    makeCandidate(0.15, "Sr."),
  ];
}