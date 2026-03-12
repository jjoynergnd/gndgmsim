// src/franchise/MainMenu/LoadGame.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SaveSlot from "./SaveSlot";
import styles from "./MainMenu.module.css";

export default function LoadGame() {
  const navigate = useNavigate();
  const [slots, setSlots] = useState([]);

  useEffect(() => {
    const keys = Object.keys(localStorage).filter((k) =>
      k.startsWith("leagueState_")
    );

    const parsed = keys
      .map((key) => ({
        key,
        data: JSON.parse(localStorage.getItem(key)),
      }))
      .sort((a, b) => b.data.lastSavedAt - a.data.lastSavedAt);

    Promise.resolve().then(() => setSlots(parsed));
  }, []);

  return (
    <>
      <div className={styles.header}>Load Franchise</div>

      <div className={styles.container}>
        <div className={styles.slotList}>
          {slots.length === 0 && (
            <p className={styles.empty}>No saved franchises found.</p>
          )}

          {slots.map((slot) => (
            <SaveSlot key={slot.key} slot={slot} />
          ))}
        </div>

        <button
          className={styles.backButton}
          onClick={() => navigate("/main-menu")}
        >
          Back to Main Menu
        </button>
      </div>
    </>
  );
}