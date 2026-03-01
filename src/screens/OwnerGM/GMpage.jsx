import React, { useEffect, useState, useRef } from "react";
import styles from "./GMpage.module.css";

import OwnerBriefing from "./components/OwnerBriefing";
import GMSetup from "./components/GMSetup";

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

    // Simple owner name fallback
    const ownerName = ownerProfile.name || "Larry Combs";
    const teamName = teamMeta.displayName || "Buffalo Frost Horns";

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
      setOwnerText(
        `So tell me — what should I expect from you as a GM?`
      );
      setShowArchetypes(true);
      setOwnerReaction("");
      scrollToGMPanel();
    } else if (step === 5) {
      // Archetype reaction handled separately
    }
  }, [step, ownerProfile, teamMeta, gmName]);

  function scrollToGMPanel() {
    if (!gmPanelRef.current) return;
    setTimeout(() => {
      gmPanelRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 150);
  }

  function handleNext() {
    if (step === 0) {
      setStep(1);
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      setStep(4);
    }
  }

  function handleSubmitName() {
    if (!gmName.trim()) return;
    setStep(2);
  }

  function handleSelectArchetype(type) {
    setGmType(type);

    const reactions = {
      formerPlayer:
        "I remember watching you in your playing days. Bring that leadership into the locker room.",
      capSpecialist:
        "Good. We’ll need your discipline and creativity with the cap this season.",
      scoutGuru:
        "Your eye for talent will be crucial as we build through the draft.",
      negotiator:
        "Contract talks can get messy. I’m glad you’re comfortable in that arena.",
      analyticsMind:
        "Numbers don’t lie. I respect a GM who trusts the data, even when it’s uncomfortable."
    };

    setOwnerReaction(reactions[type] || "");
    setOwnerText("");
    setStep(5);
  }

  function handleStartCareer() {
    if (!gmName || !gmType) return;

    const career = {
      gm: {
        name: gmName,
        type: gmType,
        reputation: 50
      },
      currentTeamId: teamId,
      jobSecurity: 75,
      seasonNumber: 1
    };

    console.log("START CAREER:", career);
    // later: navigate to offseason phase 1
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
        className={`${styles.startButton} ${
          showStartCareer ? styles.enabled : ""
        }`}
        disabled={!showStartCareer}
        onClick={handleStartCareer}
      >
        Start My Career
      </button>
    </div>
  );
}