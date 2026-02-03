// -----------------------------------------------------------------------------
// File: src/components/Layout.jsx
// Purpose:
//   Wraps the main content area of the app. This ensures consistent spacing,
//   scroll behavior, and layout structure across all screens.
//
// Notes:
//   - Sidebar sits to the left; Layout fills the remaining space.
//   - All routed screens will render inside <Layout>{children}</Layout>.
// -----------------------------------------------------------------------------

import React from "react";

const Layout = ({ children }) => {
  return (
    <div
      style={{
        flex: 1,
        background: "#f5f5f5",
        overflowY: "auto",
      }}
    >
      {children}
    </div>
  );
};

export default Layout;
