// -----------------------------------------------------------------------------
// Button — Option C (NFL‑Style Hybrid)
// -----------------------------------------------------------------------------

import React from "react";

const Button = ({ children, onClick, variant = "primary", style = {} }) => {
  const base = {
    padding: "10px 16px",
    borderRadius: "var(--radius)",
    border: "none",
    fontWeight: 600,
    fontSize: "14px",
    transition: "0.2s",
  };

  const variants = {
    primary: {
      background: "var(--color-accent)",
      color: "white",
    },
    secondary: {
      background: "#e5e7eb",
      color: "#111",
    },
  };

  return (
    <button onClick={onClick} style={{ ...base, ...variants[variant], ...style }}>
      {children}
    </button>
  );
};

export default Button;
