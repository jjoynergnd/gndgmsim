import React from "react";

export default function SuggestionCard({ item }) {
  return (
    <div style={styles.card}>
      <div style={styles.name}>{item.name}</div>
      <div style={styles.meta}>{item.position} • Age {item.age}</div>

      <div style={styles.row}>
        <span>Cap Hit:</span>
        <strong>${item.capHit}M</strong>
      </div>

      <div style={styles.row}>
        <span>Dead:</span>
        <strong>${item.deadMoney}M</strong>
      </div>

      <div style={styles.row}>
        <span>Savings:</span>
        <strong style={styles.savings}>${item.savings}M</strong>
      </div>

      <div style={styles.reason}>{item.reason}</div>
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: "#FFFFFF",
    border: "1px solid #E5E7EB",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  name: {
    fontWeight: 600,
    fontSize: 14,
  },
  meta: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 8,
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: 13,
    padding: "2px 0",
  },
  savings: {
    color: "#16A34A",
  },
  reason: {
    marginTop: 6,
    fontSize: 12,
    color: "#6B7280",
  },
};
