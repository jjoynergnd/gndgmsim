// -----------------------------------------------------------------------------
// Layout — Corrected, Shadow‑Safe, Full‑Width Architecture
// -----------------------------------------------------------------------------

import React from "react";
import HeaderBar from "./HeaderBar";

const Layout = ({ children }) => {
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
