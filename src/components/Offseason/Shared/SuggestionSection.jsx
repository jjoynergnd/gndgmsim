import React from "react";
import SuggestionCard from "./SuggestionCard";

export default function SuggestionSection({ suggestions }) {
  const { cutCandidates, restructureCandidates, resignPriority } = suggestions;

  return (
    <div style={styles.card}>
      <div style={styles.columns}>
        <div style={styles.column}>
          <h4 style={styles.header}>Cut Candidates</h4>
          {cutCandidates.map((s) => (
            <SuggestionCard key={s.playerId} item={s} />
          ))}
        </div>

        <div style={styles.column}>
          <h4 style={styles.header}>Restructure Candidates</h4>
          {restructureCandidates.map((s) => (
            <SuggestionCard key={s.playerId} item={s} />
          ))}
        </div>

        <div style={styles.column}>
          <h4 style={styles.header}>Re‑Sign Priority</h4>
          {resignPriority.map((s) => (
            <SuggestionCard key={s.playerId} item={s} />
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 12,
    boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
  },
  columns: {
    display: "flex",
    gap: 16,
    flexWrap: "wrap",
  },
  column: {
    flex: "1 1 200px",
  },
  header: {
    fontSize: 15,
    fontWeight: 600,
    marginBottom: 10,
  },
};
