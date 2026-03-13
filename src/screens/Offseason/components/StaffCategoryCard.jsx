// src/screens/Offseason/components/StaffCategoryCard.jsx

import React from "react";
import styles from "./StaffCategoryCard.module.css";

import StaffAttributeBars from "./StaffAttributeBars";

function computeFitColor(gmProfile, staffMember) {
  if (!gmProfile || !staffMember) return "neutral";

  const gmType = gmProfile.type;

  const attrs = staffMember.attributes || {};
  const dev =
    attrs.playerDevelopment ??
    attrs.qbDevelopment ??
    attrs.skillPlayerDevelopment ??
    attrs.prospectEvaluation ??
    70;
  const scheme =
    attrs.schemeFlexibility ??
    attrs.schemeFitAwareness ??
    attrs.offensiveSchemeKnowledge ??
    attrs.defensiveSchemeKnowledge ??
    70;
  const leadership =
    attrs.leadership ??
    attrs.culture ??
    attrs.moraleBoost ??
    70;

  let score = (dev + scheme + leadership) / 3;

  if (gmType === "scoutGuru") {
    score += (attrs.prospectEvaluation ?? 0) * 0.1;
  } else if (gmType === "capSpecialist") {
    score += (attrs.contractInsight ?? 0) * 0.1;
  } else if (gmType === "analyticsMind") {
    score += (attrs.tendencyAnalysis ?? 0) * 0.1;
  }

  if (score >= 85) return "good";
  if (score >= 70) return "neutral";
  return "poor";
}

export default function StaffCategoryCard({
  roleKey,
  displayRole,
  staffMember,
  gmProfile,
  onKeep,
  onReplace,
}) {
  const fullName = `${staffMember.firstName} ${staffMember.lastName}`;
  const fit = computeFitColor(gmProfile, staffMember);

  const attributes = buildAttributesForRole(staffMember);

  const salary = staffMember.contract?.salary ?? 0;
  const years = staffMember.contract?.years ?? 0;

  return (
    <article
      className={`${styles.card} ${
        fit === "good"
          ? styles.fitGood
          : fit === "poor"
          ? styles.fitPoor
          : ""
      }`}
    >
      <header className={styles.header}>
        <div>
          <div className={styles.role}>{displayRole}</div>
          <div className={styles.name}>{fullName}</div>
          <div className={styles.meta}>
            Age {staffMember.age} • {staffMember.yearsExperience} yrs exp
          </div>
        </div>
        <div className={styles.fitBadge}>
          {fit === "good" && "Strong Fit"}
          {fit === "neutral" && "Solid Fit"}
          {fit === "poor" && "Questionable Fit"}
        </div>
      </header>

      <div className={styles.attributes}>
        <StaffAttributeBars attributes={attributes} />
      </div>

      <div className={styles.contractRow}>
        <span className={styles.contractLabel}>Contract</span>
        <span className={styles.contractValue}>
          {years} yrs • ${Math.round(salary / 1_000_000)}M
        </span>
      </div>

      <footer className={styles.footer}>
        <button className={styles.keepButton} onClick={onKeep}>
          Keep Staff
        </button>
        <button className={styles.replaceButton} onClick={onReplace}>
          Replace
        </button>
      </footer>
    </article>
  );
}

function buildAttributesForRole(staffMember) {
  const attrs = staffMember.attributes || {};
  const roleCode = staffMember.roleCode;

  if (roleCode === "HC") {
    return [
      {
        key: "playerDevelopment",
        label: "Player Development",
        value: attrs.playerDevelopment ?? attrs.strategy ?? 75,
      },
      {
        key: "leadership",
        label: "Leadership",
        value: attrs.leadership ?? attrs.culture ?? 80,
      },
      {
        key: "gameManagement",
        label: "Game Management",
        value: attrs.strategy ?? 78,
      },
    ];
  }

  if (roleCode === "OC") {
    return [
      {
        key: "qbDevelopment",
        label: "QB Development",
        value: attrs.qbDevelopment ?? 80,
      },
      {
        key: "scheme",
        label: "Scheme Fit",
        value: attrs.offensiveSchemeKnowledge ?? 78,
      },
      {
        key: "creativity",
        label: "Creativity",
        value: attrs.creativity ?? 72,
      },
    ];
  }

  if (roleCode === "DC") {
    return [
      {
        key: "secondaryDev",
        label: "Secondary Development",
        value: attrs.secondaryDevelopment ?? 75,
      },
      {
        key: "discipline",
        label: "Discipline",
        value: attrs.discipline ?? 80,
      },
      {
        key: "scheme",
        label: "Scheme Fit",
        value: attrs.defensiveSchemeKnowledge ?? 76,
      },
    ];
  }

  if (roleCode === "HEAD_SCOUT" || roleCode === "DPP") {
    return [
      {
        key: "prospectEval",
        label: "Prospect Evaluation",
        value: attrs.prospectEvaluation ?? attrs.proEvaluation ?? 80,
      },
      {
        key: "boardMgmt",
        label: "Draft Board",
        value: attrs.draftBoardManagement ?? attrs.rosterConstruction ?? 78,
      },
      {
        key: "schemeFit",
        label: "Scheme Fit Awareness",
        value: attrs.schemeFitAwareness ?? attrs.schemeFitProjection ?? 74,
      },
    ];
  }

  if (roleCode === "HAT") {
    return [
      {
        key: "diagnosis",
        label: "Diagnosis Accuracy",
        value: attrs.diagnosisAccuracy ?? 82,
      },
      {
        key: "rehab",
        label: "Rehab Quality",
        value: attrs.rehabQuality ?? 80,
      },
      {
        key: "longTerm",
        label: "Long-Term Health",
        value: attrs.longTermHealthManagement ?? 78,
      },
    ];
  }

  if (roleCode === "STC") {
    return [
      {
        key: "injuryPrevention",
        label: "Injury Prevention",
        value: attrs.injuryPrevention ?? 85,
      },
      {
        key: "conditioning",
        label: "Conditioning",
        value: attrs.conditioning ?? 78,
      },
      {
        key: "strength",
        label: "Strength Training",
        value: attrs.strengthTraining ?? 80,
      },
    ];
  }

  // Fallback
  return [
    {
      key: "overall",
      label: "Overall Impact",
      value: 75,
    },
  ];
}