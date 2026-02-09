import React, { useState, useMemo } from "react";

const formatCapSpace = (value) => {
  if (typeof value !== "number") return "—";
  return `$${(value / 1_000_000).toFixed(1)}M`;
};

const deriveRecord = (schedule = []) => {
  let wins = 0;
  let losses = 0;

  schedule.forEach((game) => {
    if (!game.played) return;
    if (game.result === "W") wins += 1;
    if (game.result === "L") losses += 1;
  });

  return `${wins}-${losses}`;
};

const TeamHeader = ({ team, season, meta }) => {
  const [logoError, setLogoError] = useState(false);

  const record = useMemo(() => {
    return deriveRecord(season?.schedule);
  }, [season]);

  const capSpace = useMemo(() => {
    return formatCapSpace(meta?.capSpace);
  }, [meta]);

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
            marginTop: "6px",
            fontSize: "16px",
            opacity: 0.75,
            display: "flex",
            gap: "24px",
          }}
        >
          <span>Record: {record}</span>
          <span>Cap Space: {capSpace}</span>
        </div>
      </div>
    </div>
  );
};

export default TeamHeader;
