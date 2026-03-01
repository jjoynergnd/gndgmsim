// -----------------------------------------------------------------------------
// File: src/components/HeaderBar.jsx
// Purpose:
//   Provides a clean, modern top header bar that sits above all content.
//   Displays the current page title and optional actions (dark mode toggle, etc.)
//
// Notes:
//   - This will be included inside Layout.jsx so every screen gets it.
//   - Later we can wire the title dynamically based on routing.
// -----------------------------------------------------------------------------

import React from "react";

const HeaderBar = ({ title = "Dashboard", actions = null }) => {
  return (
    <div
      style={{
        width: "100%",
        height: "60px",
        borderBottom: "1px solid rgba(0,0,0,0.08)",
        background: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      <h1
        style={{
          margin: 0,
          fontSize: "20px",
          fontWeight: 600,
          color: "var(--color-text)",
        }}
      >
        {title}
      </h1>

      <div>{actions}</div>
    </div>
  );
};

export default HeaderBar;
