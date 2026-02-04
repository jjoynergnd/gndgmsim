import React from "react";

const tabs = ["roster", "depth", "staff", "finances", "schedule", "stats"];

const TeamTabs = ({ tab, setTab }) => {
  return (
    <div
      style={{
        display: "flex",
        gap: "24px",
        marginBottom: "20px",
        borderBottom: "2px solid #e2e2e2",
        paddingBottom: "10px",
        paddingTop: "6px",
      }}
    >
      {tabs.map((t) => {
        const active = tab === t;

        return (
          <div
            key={t}
            onClick={() => setTab(t)}
            style={{
              cursor: "pointer",
              fontWeight: active ? 700 : 500,
              fontSize: "16px",
              paddingBottom: "8px",
              borderBottom: active ? "3px solid var(--color-accent)" : "3px solid transparent",
              color: active ? "var(--color-accent)" : "#444",
              transition: "0.2s ease",
            }}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </div>
        );
      })}
    </div>
  );
};

export default TeamTabs;
