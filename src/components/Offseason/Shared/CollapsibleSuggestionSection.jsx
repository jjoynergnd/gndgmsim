import React from "react";

export default function CollapsibleSuggestionSection({
  title,
  items,
  onSelectPlayer,
  isOpen,
  onToggle,
}) {
  return (
    <div style={styles.section}>
      {/* Header */}
      <div style={styles.header} onClick={onToggle}>
        <span style={styles.title}>{title}</span>
        <span style={styles.count}>{items.length}</span>
        <span style={styles.arrow}>{isOpen ? "▲" : "▼"}</span>
      </div>

      {/* Expanded list */}
      {isOpen && (
        <div style={styles.list}>
          {items.length === 0 && (
            <div style={styles.empty}>No players in this category</div>
          )}

          {items.map((p) => (
            <div
              key={p.playerId}
              style={styles.row}
              onClick={() => onSelectPlayer(p)}
            >
              <span style={styles.name}>{p.name}</span>
              <span style={styles.pos}>{p.position}</span>
              <span style={styles.cap}>${p.capHit}M</span>
              <span style={styles.save}>Save: ${p.savings}M</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  section: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
    marginBottom: 12,
  },

  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 14px",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: 15,
  },

  title: { flex: 1 },

  count: {
    backgroundColor: "#E5E7EB",
    padding: "2px 8px",
    borderRadius: 6,
    fontSize: 12,
  },

  arrow: {
    marginLeft: 10,
    fontSize: 12,
    color: "#6B7280",
  },

  list: {
    padding: "8px 14px 12px 14px",
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },

  row: {
    display: "grid",
    gridTemplateColumns: "2fr 0.6fr 1fr 1fr",
    padding: "6px 0",
    borderBottom: "1px solid #F3F4F6",
    cursor: "pointer",
    fontSize: 14,
  },

  name: { fontWeight: 500 },
  pos: { textAlign: "right", color: "#6B7280" },
  cap: { textAlign: "right" },
  save: { textAlign: "right", color: "#16A34A" },

  empty: {
    fontSize: 13,
    color: "#6B7280",
    padding: "6px 0",
  },
};
