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
      {/* Top row: evenly spaced metrics + team needs on the right */}
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

        {/* Team Needs moved to top-right */}
        <div style={styles.needsBlock}>
          <span style={styles.label}>Team Needs</span>
          <div style={styles.needsRow}>
            {teamNeeds.length === 0 ? (
              <span style={styles.noNeeds}>None identified</span>
            ) : (
              teamNeeds.map((need) => (
                <div key={need} style={styles.needChip}>
                  {need}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
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
    minWidth: 160,
  },

  needsRow: {
    display: "flex",
    gap: 6,
    flexWrap: "wrap",
    justifyContent: "flex-end",
  },

  needChip: {
    backgroundColor: "#F3F4F6",
    padding: "3px 8px",
    borderRadius: 6,
    fontSize: 12,
  },

  noNeeds: {
    fontSize: 13,
    color: "#6B7280",
  },
};
