// -----------------------------------------------------------------------------
// Layout — Corrected, Shadow-Safe, Full-Width Architecture
// -----------------------------------------------------------------------------

import React, { useState } from "react";
import HeaderBar from "./HeaderBar";
import SeasonHeaderBar from "./season/SeasonHeaderBar";

const Layout = ({ children }) => {
  // Tier 1 — Global season context (read-only for now)
  const [seasonContext] = useState({
    year: 2026,
    phase: "REGULAR_SEASON", // PRESEASON | REGULAR_SEASON | PLAYOFFS | OFFSEASON
    week: 4,
  });

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        background: "var(--color-bg)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden", // root clamps ONLY the viewport, not children
      }}
    >
      {/* Global header bar */}
      <HeaderBar title="GND GM Simulator" />

      {/* Tier 1 — Global season orientation */}
      <SeasonHeaderBar season={seasonContext} />

      {/* SINGLE scroll container */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          padding: "24px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        {/* Content shell */}
        <div
          style={{
            width: "100%",
            maxWidth: "1200px",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
