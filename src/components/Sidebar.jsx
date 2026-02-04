// -----------------------------------------------------------------------------
// Sidebar — Slate Background + Teal Hover Text
// -----------------------------------------------------------------------------

import React from "react";

const Sidebar = () => {
  return (
    <div
      style={{
        width: "240px",
        background: "#2A3038", // lighter slate tone
        color: "var(--color-text-light)",
        padding: "28px 20px",
        display: "flex",
        flexDirection: "column",
        gap: "32px",
        height: "100vh",
      }}
    >
      <h2
        style={{
          margin: 0,
          fontSize: "22px",
          fontWeight: 700,
          letterSpacing: "0.5px",
        }}
      >
        GND GM Sim
      </h2>

      <nav style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
        <Section title="Team Management" items={["Roster", "Staff", "Finances"]} />
        <Section title="Transactions" items={["Free Agency", "Trades", "Draft"]} />
        <Section title="Season" items={["Weekly Schedule", "Standings", "Stats"]} />
        <Section title="Settings" items={["Save", "Load", "Options"]} />
      </nav>
    </div>
  );
};

const Section = ({ title, items }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
    <div
      style={{
        fontSize: "14px",
        fontWeight: 600,
        opacity: 0.9,
        textTransform: "uppercase",
        letterSpacing: "0.7px",
      }}
    >
      {title}
    </div>

    {items.map((item) => (
      <SidebarButton key={item} label={item} />
    ))}
  </div>
);

const SidebarButton = ({ label }) => {
  const baseStyle = {
    textAlign: "left",
    padding: "10px 14px",
    borderRadius: "var(--radius)",
    background: "transparent",
    border: "none",
    color: "var(--color-text-light)",
    fontSize: "15px",
    fontWeight: 500,
    transition: "0.2s",
  };

  return (
    <button
      style={baseStyle}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = "#7FE7FF"; // light teal hover
        e.currentTarget.style.background = "#353B45"; // subtle hover bg
        e.currentTarget.style.paddingLeft = "18px";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = "var(--color-text-light)";
        e.currentTarget.style.background = "transparent";
        e.currentTarget.style.paddingLeft = "14px";
      }}
    >
      {label}
    </button>
  );
};

export default Sidebar;
