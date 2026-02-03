// -----------------------------------------------------------------------------
// File: src/components/Sidebar.jsx
// Purpose:
//   Provides the always-visible navigation sidebar. This is the primary way
//   users move between Team Management, Transactions, Season, and Settings.
//
// Notes:
//   - This is a simple static sidebar for now.
//   - Later we will wire these buttons to actual navigation routes.
//   - Sidebar stays visible at all times (your requirement).
// -----------------------------------------------------------------------------

import React from "react";

const Sidebar = () => {
  return (
    <div
      style={{
        width: "240px",
        background: "#1e1e1e",
        color: "white",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      <h2 style={{ margin: 0 }}>GND GM Sim</h2>

      <nav style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <strong>Team Management</strong>
        <button>Roster</button>
        <button>Staff</button>
        <button>Finances</button>

        <strong style={{ marginTop: "20px" }}>Transactions</strong>
        <button>Free Agency</button>
        <button>Trades</button>
        <button>Draft</button>

        <strong style={{ marginTop: "20px" }}>Season</strong>
        <button>Weekly Schedule</button>
        <button>Standings</button>
        <button>Stats</button>

        <strong style={{ marginTop: "20px" }}>Settings</strong>
        <button>Save</button>
        <button>Load</button>
        <button>Options</button>
      </nav>
    </div>
  );
};

export default Sidebar;
