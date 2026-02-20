import React, { useState } from "react";

export default function ExtendPlayerModal({ player, options, year, onClose, onConfirm }) {
  const [extendType, setExtendType] = useState("EXTEND_RESTRUCTURE"); // or "EXTEND_ONLY"
  const [yearsToAdd, setYearsToAdd] = useState(2);
  const [apy, setApy] = useState(options.marketApy);

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
            {year}: $
            {((player.contract?.capHits?.[year] || 0) / 1_000_000).toFixed(1)}M •{" "}
            {year + 1}: $
            {(
              (player.contract?.capHits?.[year + 1] || 0) / 1_000_000
            ).toFixed(1)}
            M
          </div>
        </div>


        {/* EXTENSION TYPE */}
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Extension Type</div>

          <div
            style={{
              ...styles.optionRow,
              ...(extendType === "EXTEND_RESTRUCTURE" ? styles.optionSelected : {})
            }}
            onClick={() => setExtendType("EXTEND_RESTRUCTURE")}
          >
            <div style={styles.radio(extendType === "EXTEND_RESTRUCTURE")} />
            <div style={styles.optionLabel}>Extend + Restructure</div>
            <div style={styles.savingsText}>Saves ${options.restructureSavings}M</div>
          </div>

          <div
            style={{
              ...styles.optionRow,
              ...(extendType === "EXTEND_ONLY" ? styles.optionSelected : {})
            }}
            onClick={() => setExtendType("EXTEND_ONLY")}
          >
            <div style={styles.radio(extendType === "EXTEND_ONLY")} />
            <div style={styles.optionLabel}>Extend Only</div>
            <div style={styles.noChangeText}>No cap change</div>
          </div>
        </div>

        {/* MARKET RATE */}
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Market Rate</div>
          <div style={styles.marketApy}>
            APY: <strong>${apy.toFixed(1)}M</strong>
            <div style={styles.rangeText}>
              Range: ${options.marketRange.min}M – ${options.marketRange.max}M
            </div>
          </div>

          <input
            type="range"
            min={options.marketRange.min}
            max={options.marketRange.max}
            step={0.1}
            value={apy}
            onChange={(e) => setApy(parseFloat(e.target.value))}
            style={styles.slider}
          />
        </div>

        {/* YEARS TO ADD */}
        <div style={styles.section}>
          <div style={styles.sectionTitle}>New Years to Add</div>

          <div style={styles.yearButtons}>
            {[1, 2, 3, 4, 5].map((yr) => (
              <button
                key={yr}
                style={{
                  ...styles.yearBtn,
                  ...(yearsToAdd === yr ? styles.yearBtnSelected : {})
                }}
                onClick={() => setYearsToAdd(yr)}
              >
                +{yr}
              </button>
            ))}
          </div>
        </div>

        {/* CONTRACT BREAKDOWN */}
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Contract Breakdown</div>

          <div style={styles.breakdownRow}>
            <span>Existing Contract:</span>
            <strong>${options.existingValue}M ({options.existingYears} yr)</strong>
          </div>

          <div style={styles.breakdownRow}>
            <span>New Money:</span>
            <strong>
              ${(apy * yearsToAdd).toFixed(1)}M ({yearsToAdd} yr @ ${apy.toFixed(1)}M)
            </strong>
          </div>

          <div style={styles.breakdownRowTotal}>
            <span>Total Deal:</span>
            <strong>
              ${(options.existingValue + apy * yearsToAdd).toFixed(1)}M (
              {options.existingYears + yearsToAdd} yr)
            </strong>
          </div>
        </div>

        {/* GUARANTEES */}
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Guarantees</div>

          <div style={styles.breakdownRow}>
            <span>At Signing:</span>
            <strong>${options.guarantees.atSigning}M</strong>
          </div>

          <div style={styles.breakdownRow}>
            <span>Total (incl. rolling):</span>
            <strong>${options.guarantees.total}M</strong>
          </div>
        </div>

        {/* FOOTER BUTTONS */}
        <div style={styles.footer}>
          <button style={styles.cancelBtn} onClick={onClose}>
            Cancel
          </button>

          <button
            style={styles.confirmBtn}
            onClick={() =>
              onConfirm({
                extendType,
                yearsToAdd,
                apy,
              })
            }
          >
            Confirm Extension
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
    width: 700,
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

  marketApy: {
    fontSize: 14,
    marginBottom: 8,
  },
  rangeText: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
  slider: {
    width: "100%",
    marginTop: 6,
  },

  yearButtons: {
    display: "flex",
    gap: 8,
  },
  yearBtn: {
    padding: "6px 12px",
    borderRadius: 8,
    border: "1px solid #D1D5DB",
    backgroundColor: "#F9FAFB",
    fontSize: 14,
    cursor: "pointer",
  },
  yearBtnSelected: {
    backgroundColor: "#2563EB",
    color: "#FFFFFF",
    borderColor: "#2563EB",
  },

  breakdownRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "4px 0",
    fontSize: 14,
  },
  breakdownRowTotal: {
    display: "flex",
    justifyContent: "space-between",
    padding: "6px 0",
    fontSize: 15,
    fontWeight: 600,
    marginTop: 4,
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
