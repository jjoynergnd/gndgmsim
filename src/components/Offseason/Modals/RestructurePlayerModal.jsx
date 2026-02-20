import React, { useState } from "react";

export default function RestructurePlayerModal({
  player,
  options,
  year,
  onClose,
  onConfirm,
}) {
  const [type, setType] = useState("STANDARD"); // or "VOID_YEAR"
  const isMobile = window.innerWidth < 640;

  const selected = type === "STANDARD" ? options.standard : options.voidYear;

  return (
    <div style={styles.backdrop}>
      <div style={isMobile ? styles.sheet : styles.modal}>
        
        {/* HEADER */}
        <div style={styles.header}>
          <div style={styles.playerName}>{player.name}</div>
          <div style={styles.playerMeta}>
            {player.position} • Age {player.vitals?.age ?? "-"}
          </div>
          <div style={styles.capHits}>
            Current Cap Hit: $
            {((player.contract?.capHits?.[year] || 0) / 1_000_000).toFixed(1)}M
          </div>
        </div>


        {/* RESTRUCTURE TYPE */}
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Restructure Type</div>

          {/* Standard */}
          <div
            style={{
              ...styles.optionRow,
              ...(type === "STANDARD" ? styles.optionSelected : {}),
            }}
            onClick={() => setType("STANDARD")}
          >
            <div style={styles.radio(type === "STANDARD")} />
            <div style={styles.optionLabel}>Standard</div>
            <div style={styles.noChangeText}>
              Spread over {options.standard.years} years
            </div>
          </div>

          {/* With Void Year */}
          <div
            style={{
              ...styles.optionRow,
              ...(type === "VOID_YEAR" ? styles.optionSelected : {}),
            }}
            onClick={() => setType("VOID_YEAR")}
          >
            <div style={styles.radio(type === "VOID_YEAR")} />
            <div style={styles.optionLabel}>With Void Year</div>
            <div style={styles.savingsText}>
              Adds {options.voidYear.addedYears} void year
            </div>
          </div>
        </div>

        {/* NEW CAP HIT */}
        <div style={styles.section}>
          <div style={styles.sectionTitle}>New Cap Hit</div>

          <div style={styles.breakdownRow}>
            <span>New Cap Hit:</span>
            <strong>${selected.newCapHit}M</strong>
          </div>

          <div style={styles.breakdownRow}>
            <span>Cap Savings:</span>
            <strong style={styles.savingsText}>
              +${selected.capSavings}M
            </strong>
          </div>
        </div>

        {/* WARNING */}
        <div style={styles.warningBox}>
          ⚠️ Future dead money if cut: ${selected.futureDeadMoney}M
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
                type,
              })
            }
          >
            Restructure
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
    borderColor: "#2563EB",
    backgroundColor: "#EFF6FF",
  },
  radio: (selected) => ({
    width: 14,
    height: 14,
    borderRadius: "50%",
    border: selected ? "5px solid #2563EB" : "2px solid #9CA3AF",
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
    backgroundColor: "#2563EB",
    color: "#FFFFFF",
    border: "none",
    borderRadius: 8,
    fontSize: 14,
  },
};
