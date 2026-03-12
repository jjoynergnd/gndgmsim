import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Settings.module.css";

export default function Settings() {
  const navigate = useNavigate();

  const [settings, setSettings] = useState({
    difficulty: "Pro",
    autosave: true,
    theme: "dark",
    tutorialsReset: false,
  });

  useEffect(() => {
    const saved = localStorage.getItem("appSettings");

    if (saved) {
      Promise.resolve().then(() => {
        setSettings(JSON.parse(saved));
      });
    }
  }, []);

  function updateSetting(key, value) {
    const updated = { ...settings, [key]: value };
    setSettings(updated);
    localStorage.setItem("appSettings", JSON.stringify(updated));
  }

  function resetTutorials() {
    localStorage.removeItem("tutorialFlags");
    updateSetting("tutorialsReset", true);
  }

  function deleteSave() {
    localStorage.removeItem("leagueState");
    alert("Save deleted.");
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Settings</h1>

      {/* GAMEPLAY */}
      <section className={styles.section}>
        <h2>Gameplay</h2>

        <label className={styles.row}>
          Difficulty:
          <select
            value={settings.difficulty}
            onChange={(e) => updateSetting("difficulty", e.target.value)}
          >
            <option>Rookie</option>
            <option>Pro</option>
            <option>All-Pro</option>
            <option>All-Madden</option>
          </select>
        </label>

        <label className={styles.row}>
          Auto-Save:
          <input
            type="checkbox"
            checked={settings.autosave}
            onChange={(e) => updateSetting("autosave", e.target.checked)}
          />
        </label>
      </section>

      {/* APPEARANCE */}
      <section className={styles.section}>
        <h2>Appearance</h2>

        <label className={styles.row}>
          Theme:
          <select
            value={settings.theme}
            onChange={(e) => updateSetting("theme", e.target.value)}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </label>
      </section>

      {/* ONBOARDING */}
      <section className={styles.section}>
        <h2>Onboarding</h2>

        <button className={styles.button} onClick={resetTutorials}>
          Reset Tutorials
        </button>
      </section>

      {/* SAVE MANAGEMENT */}
      <section className={styles.section}>
        <h2>Save Files</h2>

        <button className={styles.buttonDanger} onClick={deleteSave}>
          Delete Current Save
        </button>
      </section>

      {/* PREMIUM FEATURES */}
      <section className={styles.section}>
        <h2>Premium Features</h2>

        <div className={styles.locked}>
          <h3>GM Profile Editor</h3>
          <p>Customize your GM name, avatar, and background.</p>
          <span className={styles.lockIcon}>🔒 Premium</span>
        </div>

        <div className={styles.locked}>
          <h3>Salary Cap Tools</h3>
          <p>Adjust cap, toggle cap rules, and set custom growth.</p>
          <span className={styles.lockIcon}>🔒 Premium</span>
        </div>
      </section>

      <button className={styles.backButton} onClick={() => navigate("/main-menu")}>
        Back to Main Menu
      </button>
    </div>
  );
}