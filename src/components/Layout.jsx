// -----------------------------------------------------------------------------
// Layout — Multi-Mode (App + Onboarding)
// -----------------------------------------------------------------------------

import React, { useState } from "react";
import HeaderBar from "./HeaderBar";
import SeasonHeaderBar from "./season/SeasonHeaderBar";

const Layout = ({ children, variant = "app" }) => {
  const [seasonContext] = useState({
    year: 2026,
    phase: "REGULAR_SEASON",
    week: 4,
  });

  const isOnboarding = variant === "onboarding";

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        background: "var(--color-bg)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Header stays visible */}
      <HeaderBar title="GND GM Simulator" />

      {/* Hide season bar during onboarding */}
      {!isOnboarding && (
        <SeasonHeaderBar season={seasonContext} />
      )}

      {/* SINGLE scroll container */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",

          /* onboarding removes dashboard padding */
          padding: isOnboarding ? "0px" : "24px",

          display: "flex",
          justifyContent: "center",
        }}
      >
        {/* Content shell */}
        <div
          style={{
            width: "100%",

            /* onboarding gets full width */
            maxWidth: isOnboarding ? "100%" : "1200px",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
