import React, { useEffect, useState } from "react";
import styles from "./GMpage.module.css";

import OwnerBriefing from "./components/OwnerBriefing";
import GMSetup from "./components/GMSetup";

export default function GMpage() {
  const [ownerProfile, setOwnerProfile] = useState(null);
  const [teamMeta, setTeamMeta] = useState(null);

  const [gmName, setGmName] = useState("");
  const [gmType, setGmType] = useState(null);

  // Pull teamId from URL
  const teamId = window.location.pathname.split("/").pop();
  console.log("GMpage mounted. teamId =", teamId);

  useEffect(() => {
    async function loadData() {
      if (!teamId) {
        console.error("No teamId found in URL");
        return;
      }

      try {
        console.log("Loading team meta:", `../../data/meta/${teamId}.json`);
        const meta = await import(`../../data/meta/${teamId}.json`);
        console.log("Loaded team meta:", meta.default);
        setTeamMeta(meta.default);
      } catch (err) {
        console.error("ERROR loading team meta:", err);
      }

      try {
        console.log("Loading owner profile:", `../../data/owners/${teamId}.json`);
        const owner = await import(`../../data/owners/${teamId}.json`);
        console.log("Loaded owner profile:", owner.default);
        setOwnerProfile(owner.default);
      } catch (err) {
        console.error("ERROR loading owner profile:", err);
      }
    }

    loadData();
  }, [teamId]);

  function handleStart() {
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
  }

  if (!ownerProfile || !teamMeta) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Meet Your Owner</h1>

      <div className={styles.columns}>
        <OwnerBriefing owner={ownerProfile} team={teamMeta} />
        <GMSetup
          gmName={gmName}
          setGmName={setGmName}
          gmType={gmType}
          setGmType={setGmType}
        />
      </div>

      <button
        className={`${styles.startButton} ${
          gmName && gmType ? styles.enabled : ""
        }`}
        disabled={!gmName || !gmType}
        onClick={handleStart}
      >
        Start My Career
      </button>
    </div>
  );
}