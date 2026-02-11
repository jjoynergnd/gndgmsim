// src/components/team/TeamTabs.jsx
import React from "react";
import styles from "./TeamTabs.module.css";

export default function TeamTabs({ tab, setTab }) {
  const tabs = [
    { key: "roster", label: "Roster" },
    { key: "depthChart", label: "Depth Chart" },
    { key: "staff", label: "Staff" },
    { key: "finances", label: "Finances" },
    { key: "schedule", label: "Schedule" },
    { key: "Standings", label: "Standings" },
    { key: "playoffs", label: "Playoffs" }, // NEW TAB
    { key: "stats", label: "Stats" }
  ];

  return (
    <div className={styles.tabRow}>
      {tabs.map((t) => (
        <div
          key={t.key}
          className={`${styles.tab} ${tab === t.key ? styles.active : ""}`}
          onClick={() => setTab(t.key)}
        >
          {t.label}
        </div>
      ))}
    </div>
  );
}
