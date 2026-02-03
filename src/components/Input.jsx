// -----------------------------------------------------------------------------
// File: src/components/Input.jsx
// Purpose:
//   Reusable text input component for forms, filters, and user entry.
//
// Notes:
//   - Simple controlled input.
//   - Later we can add variants, validation, labels, etc.
// -----------------------------------------------------------------------------

import React from "react";

const Input = ({ value, onChange, placeholder = "", style = {} }) => {
  const baseStyle = {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    width: "100%",
    fontSize: "14px",
  };

  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{ ...baseStyle, ...style }}
    />
  );
};

export default Input;
