// -----------------------------------------------------------------------------
// File: src/components/Modal.jsx
// Purpose:
//   Simple modal overlay for confirmations, dialogs, and actions.
//
// Notes:
//   - Controlled by `isOpen` prop.
//   - Renders children inside a centered card.
//   - Later we can add animations, close-on-click-outside, etc.
// -----------------------------------------------------------------------------

import React from "react";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 999,
      }}
    >
      <div
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "10px",
          minWidth: "300px",
          maxWidth: "600px",
        }}
      >
        {children}

        <div style={{ marginTop: "20px", textAlign: "right" }}>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
