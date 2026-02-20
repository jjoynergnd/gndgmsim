// src/components/offseason/Shared/TeamStatusCard.jsx

import React from "react";

export default function TeamStatusCard({ state }) {
  const capSummary = state?.capSummary ?? {
    capSpace: 0,
    capHealth: "GREEN",
  };

  const playersUnderContract = state?.playersUnderContract ?? [];
  const expiringContracts = state?.expiringContracts ?? [];
  const teamNeeds = state?.teamNeeds ?? [];

  return (
    <div style={styles.card}>
      <div style={styles.topRow}>
        <div style={styles.item}>
          <span style={styles.label}>Cap Space</span>
          <strong style={styles.cap(capSummary.capHealth)}>
            ${Number(capSummary.capSpace).toFixed(1)}M
          </strong>
        </div>

        <div style={styles.item}>
          <span style={styles.label}>Under Contract</span>
          <strong>{playersUnderContract.length} / 53</strong>
        </div>

        <div style={styles.item}>
          <span style={styles.label}>Expiring Deals</span>
          <strong>{expiringContracts.length}</strong>
        </div>

        <div style={styles.needsBlock}>
          <span style={styles.label}>Team Needs</span>
          <div style={styles.needsRow}>
            {teamNeeds.length === 0 ? (
              <span style={styles.noNeeds}>None identified</span>
            ) : (
              teamNeeds.map((need) => (
                <div key={need.position} style={styles.needChip}>
                  <span style={styles.needPos}>{need.position}</span>
                  <div style={styles.severityBarRow}>
                    {buildSeverityBars(need.score).map((bar, idx) => (
                      <span
                        key={idx}
                        style={styles.severityDot(bar.filled, bar.color)}
                      />
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function buildSeverityBars(score) {
  // Map score to 0–5
  const clamped = Math.max(0, Math.min(score, 1.5));
  const filledCount = Math.round((clamped / 1.5) * 5);

  const color =
    clamped > 1.1
      ? "#FCA5A5" // critical
      : clamped > 0.8
      ? "#FDBA74" // high
      : clamped > 0.5
      ? "#FDE68A" // medium
      : clamped > 0.2
      ? "#A7F3D0" // low
      : "#E5E7EB"; // very low

  return Array.from({ length: 5 }).map((_, i) => ({
    filled: i < filledCount,
    color,
  }));
}

const styles = {
  card: {
    backgroundColor: "#FFFFFF",
    padding: "10px 16px",
    borderRadius: 10,
    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
  },
  topRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexWrap: "wrap",
    gap: 20,
  },
  item: {
    display: "flex",
    flexDirection: "column",
    minWidth: 120,
  },
  label: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 2,
  },
  cap: (health) => ({
    color:
      health === "GREEN"
        ? "#16A34A"
        : health === "YELLOW"
        ? "#CA8A04"
        : "#DC2626",
    fontSize: 15,
  }),
  needsBlock: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    minWidth: 200,
  },
  needsRow: {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
    justifyContent: "flex-end",
  },
  needChip: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#F9FAFB",
    padding: "4px 8px",
    borderRadius: 999,
    border: "1px solid #E5E7EB",
    fontSize: 12,
  },
  needPos: {
    fontWeight: 600,
    color: "#111827",
  },
  severityBarRow: {
    display: "flex",
    gap: 2,
    alignItems: "center",
  },
  severityDot: (filled, color) => ({
    width: 6,
    height: 2,
    borderRadius: 999,
    backgroundColor: filled ? color : "#E5E7EB",
  }),
  noNeeds: {
    fontSize: 13,
    color: "#6B7280",
  },
};
