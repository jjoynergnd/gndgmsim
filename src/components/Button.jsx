// -----------------------------------------------------------------------------
// File: src/components/Button.jsx
// Purpose:
//   Reusable button component used throughout the app. Provides consistent
//   styling and supports primary/secondary variants.
//
// Notes:
//   - This is intentionally simple for Phase 1.
//   - Later we can expand with size variants, icons, disabled states, etc.
// -----------------------------------------------------------------------------

import React from "react";

const Button = ({ children, onClick, variant = "primary", style = {} }) => {
  const baseStyle = {
    padding: "10px 16px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
    transition: "0.2s",
  };

  const variants = {
    primary: {
      background: "#0078ff",
      color: "white",
    },
    secondary: {
      background: "#e0e0e0",
      color: "#333",
    },
  };

  return (
    <button
      onClick={onClick}
      style={{ ...baseStyle, ...variants[variant], ...style }}
    >
      {children}
    </button>
  );
};

export default Button;
