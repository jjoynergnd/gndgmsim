// -----------------------------------------------------------------------------
// File: src/components/PageHeader.jsx
// Purpose:
//   Standardized header for all screens. Displays a title and optional actions
//   (buttons, filters, etc.) aligned to the right.
//
// Notes:
//   - Keeps screen headers consistent across the entire app.
//   - Actions prop is typically a <Button /> or group of buttons.
// -----------------------------------------------------------------------------

import React from "react";

const PageHeader = ({ title, actions = null }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px",
      }}
    >
      <h1 style={{ margin: 0 }}>{title}</h1>
      <div>{actions}</div>
    </div>
  );
};

export default PageHeader;
