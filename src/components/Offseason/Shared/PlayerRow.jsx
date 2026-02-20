// src/components/offseason/Shared/PlayerRow.jsx

import React from "react";

export default function PlayerRow({
  player,
  onAction,
  year,
  cutOptions,
  restructureOptions,
  lastAction,
}) {
  const icons = {
    CUT: "✂️",
    RESTRUCTURE: "🔄",
    EXTEND: "✍️",
    TAG: "🏷️",
  };

  const formatM = (value) => {
    if (value === null || value === undefined || Number.isNaN(value)) return "-";
    const rounded = Math.round(value * 10) / 10;
    return `${rounded.toFixed(1)}M`;
  };

  const rawCapHit = player.contract?.capHits?.[year] || 0;
  const isCut = !!player.cut;
  const effectiveCapHit = isCut ? 0 : rawCapHit;
  const capHitDisplay = formatM(effectiveCapHit / 1_000_000);

  const effectiveCutType = player.cutType || "PRE_JUNE";

  let deadDisplay = "-";
  let saveDisplay = "-";

  if (cutOptions) {
    const opt =
      effectiveCutType === "POST_JUNE"
        ? cutOptions.postJune
        : cutOptions.preJune;
    deadDisplay = formatM(opt.deadMoney);
    saveDisplay = formatM(opt.savings);
  }

  const restructDisplay = restructureOptions
    ? formatM(restructureOptions.standard.capSavings)
    : "-";

  const remainingYears = Object.keys(player.contract?.capHits || {}).filter(
    (y) => parseInt(y, 10) >= year
  ).length;

  const ovr = player.ratings?.overall ?? null;

  const getRowBackground = () => {
    if (isCut) return "#FEE2E2"; // cut wins
    switch (lastAction) {
      case "CUT":
        return "#FEE2E2";
      case "EXTEND":
        return "#DCFCE7";
      case "RESTRUCTURE":
        return "#DBEAFE";
      case "TAG":
        return "#FEF3C7";
      default:
        return "#FFFFFF";
    }
  };

  const getOvrStyle = () => {
    if (ovr === null) return styles.ovrPillBase;
    if (ovr >= 85) return { ...styles.ovrPillBase, backgroundColor: "#CCFBF1" };
    if (ovr >= 75) return { ...styles.ovrPillBase, backgroundColor: "#DBEAFE" };
    if (ovr >= 65) return { ...styles.ovrPillBase, backgroundColor: "#E5E7EB" };
    return { ...styles.ovrPillBase, backgroundColor: "#FEE2E2" };
  };

  return (
    <div
      style={{
        ...styles.row,
        backgroundColor: getRowBackground(),
      }}
    >
      <div style={styles.actions}>
        <span
          style={styles.actionIcon}
          onClick={() => onAction(player, "CUT")}
        >
          ✂️
        </span>
        <span
          style={styles.actionIcon}
          onClick={() => onAction(player, "RESTRUCTURE")}
        >
          🔄
        </span>
        <span
          style={styles.actionIcon}
          onClick={() => onAction(player, "EXTEND")}
        >
          ✍️
        </span>
        {player.tagEligible && (
          <span
            style={styles.actionIcon}
            onClick={() => onAction(player, "TAG")}
          >
            🏷️
          </span>
        )}
      </div>

      <div style={styles.ovrCell}>
        {ovr !== null ? <span style={getOvrStyle()}>{ovr}</span> : "-"}
      </div>

      <span style={styles.left}>{player.name}</span>
      <span style={styles.center}>{player.position}</span>
      <span style={styles.center}>{player.vitals?.age ?? "-"}</span>
      <span style={styles.center}>
        {remainingYears > 0 ? `${remainingYears} yr` : "-"}
      </span>
      <span style={styles.center}>${capHitDisplay}</span>
      <span style={styles.center}>${deadDisplay}</span>
      <span style={styles.center}>${saveDisplay}</span>
      <span style={styles.center}>${restructDisplay}</span>
    </div>
  );
}

const styles = {
  row: {
    display: "grid",
    gridTemplateColumns:
      "0.9fr 0.7fr 2fr 0.7fr 0.7fr 0.9fr 1fr 1fr 1fr 1fr",
    padding: "10px 20px",
    borderBottom: "1px solid #F0F4F4",
    fontSize: 14,
    alignItems: "center",
  },
  left: { textAlign: "left", paddingLeft: 4 },
  center: { textAlign: "center" },
  actions: {
    display: "flex",
    gap: 6,
    alignItems: "center",
    paddingLeft: 4,
    borderRight: "1px solid #E5E7EB",
  },
  actionIcon: {
    cursor: "pointer",
    fontSize: 16,
  },
  ovrCell: {
    textAlign: "center",
    borderRight: "1px solid #E5E7EB",
  },
  ovrPillBase: {
    display: "inline-block",
    padding: "2px 6px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 600,
    color: "#111827",
  },
};
