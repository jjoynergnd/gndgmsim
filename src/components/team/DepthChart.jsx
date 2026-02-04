import React from "react";

const DepthChart = ({ roster }) => {
  if (!roster || roster.length === 0) {
    return <div style={{ opacity: 0.7 }}>No depth chart available.</div>;
  }

  // Group players by position
  const groups = roster.reduce((acc, player) => {
    if (!acc[player.position]) acc[player.position] = [];
    acc[player.position].push(player);
    return acc;
  }, {});

  // Sort each position group by overall (starter first)
  Object.keys(groups).forEach((pos) => {
    groups[pos].sort((a, b) => b.overall - a.overall);
  });

  return (
    <div
      style={{
        marginTop: "10px",
        border: "1px solid #dcdcdc",
        borderRadius: "8px",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "120px 1fr 1fr 1fr",
          background: "#f7f7f7",
          borderBottom: "1px solid #dcdcdc",
          fontWeight: 700,
          fontSize: "14px",
        }}
      >
        <div style={{ padding: "10px 12px", borderRight: "1px solid #e5e5e5" }}>
          Position
        </div>
        <div style={{ padding: "10px 12px", borderRight: "1px solid #e5e5e5" }}>
          Starter
        </div>
        <div style={{ padding: "10px 12px", borderRight: "1px solid #e5e5e5" }}>
          Backup
        </div>
        <div style={{ padding: "10px 12px" }}>3rd String</div>
      </div>

      {/* Rows */}
      {Object.keys(groups).map((pos, idx) => {
        const players = groups[pos];

        return (
          <div
            key={pos}
            style={{
              display: "grid",
              gridTemplateColumns: "120px 1fr 1fr 1fr",
              borderBottom:
                idx < Object.keys(groups).length - 1
                  ? "1px solid #eee"
                  : "none",
              background: idx % 2 === 0 ? "#fff" : "#fafafa",
            }}
          >
            <div
              style={{
                padding: "10px 12px",
                borderRight: "1px solid #f0f0f0",
                fontWeight: 600,
              }}
            >
              {pos}
            </div>

            {[0, 1, 2].map((slot) => (
              <div
                key={slot}
                style={{
                  padding: "10px 12px",
                  borderRight:
                    slot < 2 ? "1px solid #f0f0f0" : "none",
                  opacity: players[slot] ? 1 : 0.4,
                }}
              >
                {players[slot]
                  ? `${players[slot].name} (${players[slot].overall})`
                  : "—"}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
};

export default DepthChart;
