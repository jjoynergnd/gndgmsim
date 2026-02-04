import React from "react";

const FinancesPanel = ({ meta }) => {
  if (!meta) {
    return <div style={{ opacity: 0.7 }}>No financial data available.</div>;
  }

  return (
    <div
      style={{
        marginTop: "10px",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "16px",
      }}
    >
      <div
        style={{
          border: "1px solid #dcdcdc",
          borderRadius: "8px",
          padding: "12px 14px",
          background: "#fff",
        }}
      >
        <div style={{ fontSize: "13px", opacity: 0.7 }}>Cap Space</div>
        <div style={{ fontSize: "20px", fontWeight: 700 }}>
          {meta.capSpaceDisplay}
        </div>
      </div>

      <div
        style={{
          border: "1px solid #dcdcdc",
          borderRadius: "8px",
          padding: "12px 14px",
          background: "#fff",
        }}
      >
        <div style={{ fontSize: "13px", opacity: 0.7 }}>Fan Morale</div>
        <div style={{ fontSize: "20px", fontWeight: 700 }}>
          {meta.fanMorale}/100
        </div>
      </div>
    </div>
  );
};

export default FinancesPanel;
