// src/screens/OwnerGM/GMpage.jsx

import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./GMpage.module.css";

import OwnerBriefing from "./components/OwnerBriefing";
import GMSetup from "./components/GMSetup";

import { createFranchise } from "../../franchise/createFranchise";
import { saveFranchise } from "../../franchise/saveFranchise";
import { teams } from "../../data/teams";

// ------------------------------
// Generate a unique save name (Hardened)
// ------------------------------
function generateSaveName(teamName) {
  if (!teamName || typeof teamName !== "string") {
    console.warn("generateSaveName called with invalid teamName:", teamName);
    teamName = "Franchise";
  }

  const base = teamName.replace(/\s+/g, "");
  let index = 1;

  while (localStorage.getItem(`leagueState_${base}_${index}`)) {
    index++;
  }

  return `${base}_${index}`;
}

// ------------------------------
// Helper: build initial staff roles + budget
// ------------------------------
function buildInitialStaffAndBudget(rawStaffArray) {
  if (!Array.isArray(rawStaffArray)) return { staff: null, staffBudget: null };

  const findByRoleCode = (codes) =>
    rawStaffArray.find((s) => codes.includes(s.roleCode));

  const wrapStaff = (raw, friendlyRoleName, baseSalary) => {
    if (!raw) return null;

    const numericKeys = Object.keys(raw).filter(
      (k) =>
        typeof raw[k] === "number" &&
        !["age", "yearsExperience"].includes(k)
    );
    const avg =
      numericKeys.length > 0
        ? numericKeys.reduce((sum, k) => sum + raw[k], 0) / numericKeys.length
        : 70;

    const salaryMultiplier = avg / 80;
    const salary = Math.round(baseSalary * salaryMultiplier);

    return {
      id: raw.id,
      role: raw.roleName,
      roleCode: raw.roleCode,
      roleName: friendlyRoleName,
      firstName: raw.firstName,
      lastName: raw.lastName,
      age: raw.age,
      yearsExperience: raw.yearsExperience,
      attributes: { ...raw },
      contract: {
        years: 3,
        salary,
      },
    };
  };

  const headCoach = wrapStaff(findByRoleCode(["HC"]), "Head Coach", 6_000_000);
  const offensiveCoordinator = wrapStaff(findByRoleCode(["OC"]), "Offensive Coordinator", 3_500_000);
  const defensiveCoordinator = wrapStaff(findByRoleCode(["DC"]), "Defensive Coordinator", 3_500_000);
  const scoutingDirector = wrapStaff(findByRoleCode(["HEAD_SCOUT", "DPP"]), "Scouting Director", 2_500_000);
  const medicalDirector = wrapStaff(findByRoleCode(["HAT"]), "Medical Director", 2_000_000);
  const strengthCoach = wrapStaff(findByRoleCode(["STC"]), "Strength & Conditioning", 2_000_000);

  const staff = {
    headCoach,
    offensiveCoordinator,
    defensiveCoordinator,
    scoutingDirector,
    medicalDirector,
    strengthCoach,
  };

  const salaries = Object.values(staff)
    .filter(Boolean)
    .map((s) => s.contract.salary);

  const current = salaries.length > 0 ? salaries.reduce((sum, s) => sum + s, 0) : 0;

  return {
    staff,
    staffBudget: {
      current,
      max: 25_000_000,
    },
  };
}

export default function GMpage() {
  const [ownerProfile, setOwnerProfile] = useState(null);
  const [teamMeta, setTeamMeta] = useState(null);

  const [gmName, setGmName] = useState("");
  const [gmType, setGmType] = useState(null);

  const [step, setStep] = useState(0);
  const [ownerText, setOwnerText] = useState("");
  const [showNameField, setShowNameField] = useState(false);
  const [showArchetypes, setShowArchetypes] = useState(false);
  const [ownerReaction, setOwnerReaction] = useState("");

  const gmPanelRef = useRef(null);
  const navigate = useNavigate();

  const teamId = window.location.pathname.split("/").pop();

  useEffect(() => {
    async function loadData() {
      try {
        const meta = await import(`../../data/meta/${teamId}.json`);
        setTeamMeta(meta.default);
      } catch (err) {
        console.error("Error loading team meta:", err);
      }

      try {
        const owner = await import(`../../data/owners/${teamId}.json`);
        setOwnerProfile(owner.default);
      } catch (err) {
        console.error("Error loading owner profile:", err);
      }
    }

    loadData();
  }, [teamId]);

  useEffect(() => {
    if (!ownerProfile || !teamMeta) return;

    const teamInfo = teams.find((t) => t.id === teamId);
    const teamName = teamInfo ? `${teamInfo.city} ${teamInfo.mascot}` : teamId;
    const ownerName = ownerProfile.name || "Team Owner";

    if (step === 0) {
      setOwnerText(
        `Welcome aboard. You aren’t the first GM we’ve brought in, but something tells me you’re different.`
      );
      setShowNameField(false);
      setShowArchetypes(false);
      setOwnerReaction("");
    } else if (step === 1) {
      setOwnerText(
        `Let’s start with introductions. I’m ${ownerName}, owner of the ${teamName}. What should I call you?`
      );
      setShowNameField(true);
      setShowArchetypes(false);
      setOwnerReaction("");
      scrollToGMPanel();
    } else if (step === 2) {
      setOwnerText(
        `Great, ${gmName || "Coach"}. I’ve been at this a long time and I’ve seen every type of GM walk through that door.`
      );
      setShowNameField(false);
      setShowArchetypes(false);
      setOwnerReaction("");
    } else if (step === 3) {
      setOwnerText(
        `I believe in long-term team building and sustainable success. This season I expect accountability, communication, and a clear plan.`
      );
      setShowNameField(false);
      setShowArchetypes(false);
      setOwnerReaction("");
    } else if (step === 4) {
      setOwnerText(`So tell me — what should I expect from you as a GM?`);
      setShowArchetypes(true);
      setOwnerReaction("");
      scrollToGMPanel();
    }
  }, [step, ownerProfile, teamMeta, gmName, teamId]);

  function scrollToGMPanel() {
    if (!gmPanelRef.current) return;
    setTimeout(() => {
      gmPanelRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 150);
  }

  function handleNext() {
    if (step === 0) setStep(1);
    else if (step === 2) setStep(3);
    else if (step === 3) setStep(4);
  }

  function handleSubmitName() {
    if (!gmName.trim()) return;
    setStep(2);
  }

  function handleSelectArchetype(type) {
    setGmType(type);

    const reactions = {
      formerPlayer: "I remember watching you in your playing days. Bring that leadership into the locker room.",
      capSpecialist: "Good. We’ll need your discipline and creativity with the cap this season.",
      scoutGuru: "Your eye for talent will be crucial as we build through the draft.",
      negotiator: "Contract talks can get messy. I’m glad you’re comfortable in that arena.",
      analyticsMind: "Numbers don’t lie. I respect a GM who trusts the data, even when it’s uncomfortable.",
    };

    setOwnerReaction(reactions[type] || "");
    setOwnerText("");
    setStep(5);
  }

  async function handleStartCareer() {
    if (!gmName || !gmType || !teamMeta || !ownerProfile) return;

    const teamInfo = teams.find((t) => t.id === teamId);
    const baseName = teamInfo ? `${teamInfo.city} ${teamInfo.mascot}` : teamId;

    const saveName = generateSaveName(baseName);

    const franchise = createFranchise({
      franchiseId: crypto.randomUUID(),
      saveName,
      gmName,
      userTeamId: teamId,
      difficulty: "sim",
    });

    franchise.league.gmProfile = {
      name: gmName,
      type: gmType,
    };

    franchise.league.ownerProfile = {
      name: ownerProfile.name,
      type: ownerProfile.type,
      patience: ownerProfile.patience,
      spendingAggression: ownerProfile.spendingAggression,
      involvementLevel: ownerProfile.involvementLevel,
      priorities: { ...ownerProfile.priorities },
    };

    if (franchise.league.user) {
      franchise.league.user.gmType = gmType;
    }

    try {
      const staffModule = await import(`../../data/staff/${teamId}.json`);
      const rawStaffArray = staffModule.default;
      const { staff, staffBudget } = buildInitialStaffAndBudget(rawStaffArray);

      if (staff) franchise.league.staff = staff;
      if (staffBudget) franchise.league.staffBudget = staffBudget;
    } catch (err) {
      console.error("Error loading staff data:", err);
    }

    franchise.meta.currentPhase = "OFFSEASON_STAFF";
    franchise.league.offseason.phase = 1;

    franchise.meta.lastSavedAt = Date.now();
    localStorage.setItem(`leagueState_${saveName}`, JSON.stringify(franchise));

    saveFranchise(franchise);

    navigate("/offseason/staff");
  }

  if (!ownerProfile || !teamMeta) {
    return <div className={styles.loading}>Loading...</div>;
  }

  const showNextButton = step === 0 || step === 2 || step === 3;
  const showNameSubmit = step === 1;
  const showStartCareer = step === 5 && gmName && gmType;

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Meet Your Owner</h1>

      <div className={styles.columns}>
        <OwnerBriefing
          text={ownerText}
          showNext={showNextButton}
          onNext={handleNext}
          showNameSubmit={showNameSubmit}
          onSubmitName={handleSubmitName}
          gmName={gmName}
          reaction={ownerReaction}
        />

        <div ref={gmPanelRef}>
          <GMSetup
            gmName={gmName}
            setGmName={setGmName}
            showNameField={showNameField}
            gmType={gmType}
            onSelectGMType={handleSelectArchetype}
            showArchetypes={showArchetypes}
          />
        </div>
      </div>

      <button
        className={`${styles.startButton} ${showStartCareer ? styles.enabled : ""}`}
        disabled={!showStartCareer}
        onClick={handleStartCareer}
      >
        Start My Career
      </button>
    </div>
  );
}