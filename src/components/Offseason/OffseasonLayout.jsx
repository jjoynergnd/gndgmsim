// src/components/offseason/OffseasonLayout.jsx

import React from "react";

export default function OffseasonLayout({
  children,
  teamMeta,
  capSummary,
  phase,
  year,
}) {
  return (
    <div className="offseason-layout" style={styles.container}>
      {/* Main content only (header + sidebar removed) */}
      <div className="main" style={styles.main}>
        <div style={styles.contentWrapper}>{children}</div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    width: "100%",
    minHeight: "100vh",
    backgroundColor: "#F7F8FA",
  },
  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  contentWrapper: {
    padding: "20px",
    maxWidth: 1200,
    width: "100%",
    margin: "0 auto",
  },
};
