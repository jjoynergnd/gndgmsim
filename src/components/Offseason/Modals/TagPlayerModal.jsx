import React from "react";

export default function TagPlayerModal({
  player,
  tagInfo,
  year,
  onClose,
  onConfirm,
}) {
  const isMobile = window.innerWidth < 640;

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


        {/* TAG VALUE */}
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Franchise Tag Value</div>

          <div style={styles.breakdownRow}>
            <span>Position Tag Value:</span>
            <strong>${tagInfo.tagValue}M</strong>
          </div>

          <div style={styles.breakdownRow}>
            <span>Cap Space After Tag:</span>
            <strong
              style={{
                color: tagInfo.capSpaceAfter >= 0 ? "#16A34A" : "#DC2626",
              }}
            >
              ${tagInfo.capSpaceAfter}M
            </strong>
          </div>
        </div>

        {/* NOTES */}
        <div style={styles.noteBox}>
          • Tag is a fully guaranteed 1‑year contract  
          • Player cannot negotiate with other teams  
          • Counts immediately against the salary cap
        </div>

        {/* FOOTER */}
        <div style={styles.footer}>
          <button style={styles.cancelBtn} onClick={onClose}>
            Cancel
          </button>

          <button
            style={styles.confirmBtn}
            onClick={() => onConfirm()}
          >
            Apply Franchise Tag
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

  breakdownRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "4px 0",
    fontSize: 14,
  },

  noteBox: {
    marginTop: 20,
    padding: 12,
    backgroundColor: "#EFF6FF",
    border: "1px solid #BFDBFE",
    borderRadius: 8,
    fontSize: 13,
    color: "#1E3A8A",
    lineHeight: 1.4,
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
