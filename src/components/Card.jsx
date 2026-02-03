// -----------------------------------------------------------------------------
// File: src/components/Card.jsx
// Purpose:
//   Generic card container used for grouping UI elements. Provides consistent
//   padding, border radius, and background styling.
//
// Notes:
//   - This is a structural component, not interactive.
//   - Used heavily in screens like Team Management, Free Agency, Draft, etc.
// -----------------------------------------------------------------------------

import React from "react";

const Card = ({ children, style = {} }) => {
  const baseStyle = {
    background: "white",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
    marginBottom: "20px",
  };

  return <div style={{ ...baseStyle, ...style }}>{children}</div>;
};

export default Card;
