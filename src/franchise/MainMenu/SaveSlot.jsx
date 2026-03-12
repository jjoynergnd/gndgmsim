// src/franchise/MainMenu/SaveSlot.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { teams } from "../../data/teams";
import { getPhaseLabel } from "./phaseMap";
import styles from "./MainMenu.module.css";

export default function SaveSlot({ slot }) {
  const navigate = useNavigate();
  const data = slot.data;

  const team = teams.find((t) => t.id === data.userTeamId);
  const teamName = `${team.city} ${team.mascot}`;
  const logoPath = `/logos/${team.id}.png`;

  const lastPlayed = new Date(data.lastSavedAt).toLocaleString();

  function handleLoad() {
    localStorage.setItem("leagueState", JSON.stringify(data));
    navigate("/offseason");
  }

  function handleDelete() {
    if (!window.confirm("Delete this save?")) return;
    localStorage.removeItem(slot.key);
    window.location.reload();
  }

  return (
    <div className={styles.slotCard}>
      {/* Accent bar */}
      <div
        className={styles.accentBar}
        style={{ backgroundColor: team.color }}
      />

      {/* Logo + Info */}
      <div className={styles.slotMain}>
        <img src={logoPath} alt={teamName} className={styles.teamLogo} />

        <div className={styles.slotInfo}>
          <h3>{teamName}</h3>
          <p>GM: {data.gmName}</p>
          <p>Season: {data.currentSeason}</p>
          <p>Phase: {getPhaseLabel(data.currentPhase)}</p>
          <p>Last Played: {lastPlayed}</p>
          <p>Difficulty: {data.difficulty}</p>
        </div>
      </div>

      {/* Actions */}
      <div className={styles.slotActions}>
        <button className={styles.loadButton} onClick={handleLoad}>
          Load
        </button>
        <button className={styles.deleteButton} onClick={handleDelete}>
          Delete
        </button>
      </div>
    </div>
  );
}