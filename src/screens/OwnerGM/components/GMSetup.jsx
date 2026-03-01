import React, { useEffect, useState } from "react";
import styles from "./GMSetup.module.css";

export default function GMSetup({
  gmName,
  setGmName,
  showNameField,
  gmType,
  onSelectGMType,
  showArchetypes
}) {
  const [archetypes, setArchetypes] = useState([]);

  useEffect(() => {
    async function load() {
      const data = await import("../../../data/gm/archetypes.json");
      setArchetypes(data.default);
    }
    load();
  }, []);

  const showPanel = showNameField || showArchetypes;

  if (!showPanel) {
    return null;
  }

  return (
    <div className={styles.card}>
      <h2 className={styles.header}>GM Setup</h2>

      {showNameField && (
        <div className={styles.section}>
          <label className={styles.label}>GM Name</label>
          <input
            className={styles.input}
            value={gmName}
            onChange={(e) => setGmName(e.target.value)}
            placeholder="Enter your GM name"
          />
          <div className={styles.helper}>
            This is the name you'll be known by throughout your GM career.
          </div>
        </div>
      )}

      {showArchetypes && (
        <div className={styles.section}>
          <label className={styles.label}>GM Archetype</label>
          <div className={styles.helper}>
            Each GM type offers subtle advantages in negotiations, scouting, or
            morale. Choose the style that fits how you want to run your
            franchise.
          </div>

          <div className={styles.archetypeGrid}>
            {archetypes.map((a) => (
              <button
                key={a.id}
                className={`${styles.archetype} ${
                  gmType === a.id ? styles.selected : ""
                }`}
                onClick={() => onSelectGMType(a.id)}
              >
                <div className={styles.archetypeTitle}>{a.name}</div>
                <div className={styles.archetypeDesc}>{a.description}</div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}