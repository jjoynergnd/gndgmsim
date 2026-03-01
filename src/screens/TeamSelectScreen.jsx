// src/screens/TeamSelectScreen.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./TeamSelectScreen.module.css";

/*
-----------------------------------
Conference Mapping
-----------------------------------
*/

const AFC_TEAMS = [
  "BUF","MIA","NE","NYJ",
  "BAL","CIN","CLE","PIT",
  "HOU","IND","JAX","TEN",
  "DEN","KC","LV","LAC"
];

const NFC_TEAMS = [
  "DAL","NYG","PHI","WAS",
  "CHI","DET","GB","MIN",
  "ATL","CAR","NO","TB",
  "ARI","LAR","SF","SEA"
];

const metaFiles = import.meta.glob("../data/meta/*.json");

function formatCapSpace(value) {
  return `${(value / 1_000_000).toFixed(1)}M`;
}

export default function TeamSelectScreen() {
  const navigate = useNavigate();

  const [teams, setTeams] = useState({});
  const [selectedTeam, setSelectedTeam] = useState(null);

  useEffect(() => {
    async function loadTeams() {
      const loaded = {};

      for (const path in metaFiles) {
        const mod = await metaFiles[path]();
        const data = mod.default;

        loaded[data.teamId] = {
          ...data,
          formattedCap: formatCapSpace(data.capSpace)
        };
      }

      setTeams(loaded);
    }

    loadTeams();
  }, []);

  const renderConference = (list) =>
    list.map((teamId) => {
      const team = teams[teamId];
      if (!team) return null;

      return (
        <button
          key={teamId}
          className={`${styles.teamItem} ${
            selectedTeam === teamId ? styles.selected : ""
          }`}
          onClick={() => setSelectedTeam(teamId)}
        >
          <img
            src={`/logos/${teamId}.png`}
            className={styles.logo}
            alt={teamId}
          />

          <div className={styles.teamCode}>{teamId}</div>
          <div className={styles.cap}>${team.formattedCap}</div>
        </button>
      );
    });

  function handleContinue() {
    if (!selectedTeam) return;
    navigate(`/gm/${selectedTeam}`);
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Select Your Franchise</h1>

      <div className={styles.columns}>
        <section>
          <h2 className={`${styles.confTitle} ${styles.afc}`}>
            AFC
          </h2>
          <div className={styles.grid}>
            {renderConference(AFC_TEAMS)}
          </div>
        </section>

        <section>
          <h2 className={`${styles.confTitle} ${styles.nfc}`}>
            NFC
          </h2>
          <div className={styles.grid}>
            {renderConference(NFC_TEAMS)}
          </div>
        </section>
      </div>

      <button
        className={`${styles.continue} ${
          selectedTeam ? styles.enabled : ""
        }`}
        disabled={!selectedTeam}
        onClick={handleContinue}
      >
        Continue
      </button>
    </div>
  );
}