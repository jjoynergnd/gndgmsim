import React, { useEffect, useState } from "react";
import styles from "./GMSetup.module.css";

export default function GMSetup({ gmName, setGmName, gmType, setGmType }) {
  const [archetypes, setArchetypes] = useState([]);

  useEffect(() => {
    async function load() {
      const data = await import("../../../data/gm/archetypes.json");
      setArchetypes(data.default);
    }
    load();
  }, []);

  return (
    <div className={styles.card}>
      <h2 className={styles.header}>GM Setup</h2>

      <label className={styles.label}>GM Name</label>
      <input
        className={styles.input}
        value={gmName}
        onChange={(e) => setGmName(e.target.value)}
        placeholder="Enter your name"
      />

      <label className={styles.label}>GM Archetype</label>

      <div className={styles.archetypeGrid}>
        {archetypes.map((a) => (
          <button
            key={a.id}
            className={`${styles.archetype} ${
              gmType === a.id ? styles.selected : ""
            }`}
            onClick={() => setGmType(a.id)}
          >
            <div className={styles.archetypeTitle}>{a.name}</div>
            <div className={styles.archetypeDesc}>{a.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
}