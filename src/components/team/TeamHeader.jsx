import React, { useState } from "react";
import metaBAL from "../../data/meta/BAL.json";
import metaBUF from "../../data/meta/BUF.json";

// Map team → metadata JSON
const metaMap = {
  BAL: metaBAL,
  BUF: metaBUF,
};

const TeamHeader = ({ team }) => {
  const [logoError, setLogoError] = useState(false);

  // Pull metadata (record, cap space, etc.)
  const meta = metaMap[team.id] || {
    record: "0-0",
    capSpace: "$42.1M",
  };

  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: "14px",
        padding: "20px",
        boxShadow: "0 3px 10px rgba(0,0,0,0.12)",
        display: "flex",
        alignItems: "center",
        gap: "20px",
        borderLeft: `10px solid ${team.color}`,
      }}
    >
      {/* LOGO */}
      <div style={{ width: "90px", height: "90px" }}>
        {!logoError ? (
          <img
            src={`/logos/${team.id}.png`}
            alt={team.name}
            onError={() => setLogoError(true)}
            style={{
              width: "90px",
              height: "90px",
              borderRadius: "50%",
              objectFit: "cover",
              border: `3px solid ${team.color}`,
            }}
          />
        ) : (
          <div
            style={{
              width: "90px",
              height: "90px",
              borderRadius: "50%",
              background: team.color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "32px",
              fontWeight: 800,
              color: "#fff",
            }}
          >
            {team.id}
          </div>
        )}
      </div>

      {/* TEAM INFO */}
      <div style={{ flexGrow: 1 }}>
        <h1
          style={{
            margin: 0,
            fontSize: "32px",
            fontWeight: 800,
            letterSpacing: "-0.5px",
          }}
        >
          {team.city} {team.mascot}
        </h1>

        <div
          style={{
            marginTop: "5px",
            fontSize: "16px",
            opacity: 0.75,
            display: "flex",
            gap: "20px",
          }}
        >
          <span>Record: {meta.record}</span>
          <span>Cap Space: {meta.capSpace}</span>
        </div>
      </div>
    </div>
  );
};

export default TeamHeader;
