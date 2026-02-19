import React, { useState } from "react";

export default function CutPlayerModal({
  player,
  options,
  onClose,
  onConfirm,
}) {
  const [cutType, setCutType] = useState("PRE_JUNE"); // or "POST_JUNE"
  const isMobile = window.innerWidth < 640;

  const selected = cutType === "PRE_JUNE" ? options.preJune : options.postJune;

  return (
    <div style={styles.backdrop}>
      <div style={isMobile ? styles.sheet : styles.modal}>
        
        {/* HEADER */}
        <div style={styles.header}>
          <div style={styles.playerName}>{player.name}</div>
          <div style={styles.playerMeta}>
            {player.position} • Age {player.age}
          </div>
          <div style={styles.capHits}>
            Current Cap Hit: ${player.capHit}M
          </div>
        </div>

        {/* CUT TYPE */}
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Cut Type</div>

          {/* Pre-June 1 */}
          <div
            style={{
              ...styles.optionRow,
              ...(cutType === "PRE_JUNE" ? styles.optionSelected : {}),
            }}
            onClick={() => setCutType("PRE_JUNE")}
          >
            <div style={styles.radio(cutType === "PRE_JUNE")} />
            <div style={styles.optionLabel}>Pre-June 1</div>
            <div style={styles.noChangeText}>Dead hits immediately</div>
          </div>

          {/* Post-June 1 */}
          <div
            style={{
              ...styles.optionRow,
              ...(cutType === "POST_JUNE" ? styles.optionSelected : {}),
            }}
            onClick={() => setCutType("POST_JUNE")}
          >
            <div style={styles.radio(cutType === "POST_JUNE")} />
            <div style={styles.optionLabel}>Post-June 1</div>
            <div style={styles.savingsText}>Dead split over 2 years</div>
          </div>
        </div>

        {/* CAP IMPACT */}
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Cap Impact</div>

          <div style={styles.breakdownRow}>
            <span>Dead Money:</span>
            <strong>${selected.deadMoney}M</strong>
          </div>

          <div style={styles.breakdownRow}>
            <span>Cap Savings:</span>
            <strong style={styles.savingsText}>
              +${selected.savings}M
            </strong>
          </div>
        </div>

        {/* WARNING */}
        <div style={styles.warningBox}>
          ⚠️ Cutting this player will remove them from your roster permanently.
        </div>

        {/* FOOTER */}
        <div style={styles.footer}>
          <button style={styles.cancelBtn} onClick={onClose}>
            Cancel
          </button>

          <button
            style={styles.confirmBtn}
            onClick={() =>
              onConfirm({
                cutType,
              })
            }
          >
            Confirm Cut
          </button>
        </div>
      </div>
    </div>
  );
}

/* -------------------- STYLES -------------------- */

const styles = {
  backdrop: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.45)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },

  modal: {
    width: 500,
    maxHeight: "90vh",
    overflowY: "auto",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
  },

  sheet: {
    position: "fixed",
    bottom: 0,
    width: "100%",
    maxHeight: "90vh",
    overflowY: "auto",
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 24,
    boxShadow: "0 -4px 20px rgba(0,0,0,0.15)",
  },

  header: {
    marginBottom: 20,
  },
  playerName: {
    fontSize: 20,
    fontWeight: 700,
  },
  playerMeta: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 2,
  },
  capHits: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 6,
  },

  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 600,
    marginBottom: 10,
  },

  optionRow: {
    display: "flex",
    alignItems: "center",
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid #E5E7EB",
    marginBottom: 10,
    cursor: "pointer",
  },
  optionSelected: {
    borderColor: "#DC2626",
    backgroundColor: "#FEF2F2",
  },
  radio: (selected) => ({
    width: 14,
    height: 14,
    borderRadius: "50%",
    border: selected ? "5px solid #DC2626" : "2px solid #9CA3AF",
    marginRight: 10,
  }),
  optionLabel: {
    fontSize: 14,
    flex: 1,
  },
  savingsText: {
    fontSize: 13,
    color: "#16A34A",
  },
  noChangeText: {
    fontSize: 13,
    color: "#6B7280",
  },

  breakdownRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "4px 0",
    fontSize: 14,
  },

  warningBox: {
    marginTop: 20,
    padding: 12,
    backgroundColor: "#FEF3C7",
    border: "1px solid #FCD34D",
    borderRadius: 8,
    fontSize: 13,
    color: "#92400E",
  },

  footer: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: 30,
  },
  cancelBtn: {
    padding: "10px 16px",
    backgroundColor: "#F3F4F6",
    border: "1px solid #D1D5DB",
    borderRadius: 8,
    fontSize: 14,
  },
  confirmBtn: {
    padding: "10px 16px",
    backgroundColor: "#DC2626",
    color: "#FFFFFF",
    border: "none",
    borderRadius: 8,
    fontSize: 14,
  },
};
