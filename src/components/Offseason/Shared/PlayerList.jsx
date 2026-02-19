import React from "react";
import PlayerRow from "./PlayerRow";

export default function PlayerList({ players, onAction }) {
  return (
    <div style={styles.card}>
      <h3 style={styles.title}>Players Under Contract</h3>

      <div style={styles.tableHeader}>
        <span style={styles.colName}>Name</span>
        <span style={styles.col}>Pos</span>
        <span style={styles.col}>Age</span>
        <span style={styles.col}>Cap Hit</span>
        <span style={styles.col}>Dead $</span>
        <span style={styles.col}>Cut Save</span>
        <span style={styles.col}>Restruct</span>
        <span style={styles.colActions}>Actions</span>
      </div>

      {players.map((p) => (
        <PlayerRow key={p.id} player={p} onAction={onAction} />
      ))}
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
  title: {
    marginBottom: 12,
    fontSize: 16,
    fontWeight: 600,
  },
  tableHeader: {
    display: "grid",
    gridTemplateColumns: "2fr 0.6fr 0.6fr 1fr 1fr 1fr 1fr 1.4fr",
    padding: "8px 0",
    borderBottom: "1px solid #E5E7EB",
    fontSize: 13,
    color: "#6B7280",
  },
  colName: { fontWeight: 500 },
  col: { textAlign: "right" },
  colActions: { textAlign: "right" },
};
