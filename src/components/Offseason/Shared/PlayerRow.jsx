import React from "react";

export default function PlayerRow({ player, onAction }) {
  return (
    <div style={styles.row}>
      <span>{player.name}</span>
      <span style={styles.right}>{player.position}</span>
      <span style={styles.right}>{player.age}</span>
      <span style={styles.right}>${player.capHit}M</span>
      <span style={styles.right}>${player.deadMoney}M</span>
      <span style={styles.right}>${player.cutSavings}M</span>
      <span style={styles.right}>${player.restructureSavings}M</span>

      <div style={styles.actions}>
        <button style={styles.btn} onClick={() => onAction(player, "EXTEND")}>
          Extend
        </button>
        <button style={styles.btn} onClick={() => onAction(player, "RESTRUCTURE")}>
          Restructure
        </button>
        <button style={styles.btnDanger} onClick={() => onAction(player, "CUT")}>
          Cut
        </button>

        {player.tagEligible && (
          <button style={styles.btn} onClick={() => onAction(player, "TAG")}>
            Tag
          </button>
        )}
      </div>
    </div>
  );
}

const styles = {
  row: {
    display: "grid",
    gridTemplateColumns: "2fr 0.6fr 0.6fr 1fr 1fr 1fr 1fr 1.4fr",
    padding: "10px 0",
    borderBottom: "1px solid #F3F4F6",
    fontSize: 14,
    alignItems: "center",
  },
  right: { textAlign: "right" },
  actions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 6,
  },
  btn: {
    padding: "4px 10px",
    backgroundColor: "#F3F4F6",
    border: "1px solid #E5E7EB",
    borderRadius: 6,
    fontSize: 12,
  },
  btnDanger: {
    padding: "4px 10px",
    backgroundColor: "#FEE2E2",
    border: "1px solid #FCA5A5",
    borderRadius: 6,
    fontSize: 12,
    color: "#B91C1C",
  },
};
