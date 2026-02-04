// -----------------------------------------------------------------------------
// Layout — Now includes HeaderBar at the top
// -----------------------------------------------------------------------------

import React from "react";
import HeaderBar from "./HeaderBar";

const Layout = ({ children }) => {
  return (
    <div
      style={{
        flex: 1,
        background: "var(--color-bg)",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      {/* Global header bar */}
      <HeaderBar title="GND GM Simulator" />

      {/* Scrollable content area */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "24px",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
