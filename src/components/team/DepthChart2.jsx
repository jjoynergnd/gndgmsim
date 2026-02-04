import React from "react";
import { depthChartStructure } from "../../data/depthChartStructure";

const DepthChart2 = ({ roster, onPlayerClick }) => {
  if (!roster) return null;

  const grouped = roster.reduce((acc, p) => {
    if (!acc[p.position]) acc[p.position] = [];
    acc[p.position].push(p);
    return acc;
  }, {});

  Object.keys(grouped).forEach((pos) => {
    grouped[pos].sort((a, b) => b.overall - a.overall);
  });

  const renderSection = (title, rows) => (
    <div style={{ marginBottom: "24px" }}>
      <h3 style={{ marginBottom: "8px", fontSize: "18px" }}>{title}</h3>

      <div
        style={{
          border: "1px solid #dcdcdc",
          borderRadius: "8px",
          overflow: "hidden"
        }}
      >
        {rows.map((row, idx) => {
          const players = row.positions.flatMap((pos) => grouped[pos] || []);

          return (
            <div
              key={row.label}
              style={{
                display: "grid",
                gridTemplateColumns: `140px repeat(${row.slots}, 1fr)`,
                background: idx % 2 === 0 ? "#fff" : "#fafafa",
                borderBottom:
                  idx < rows.length - 1 ? "1px solid #eee" : "none"
              }}
            >
              <div
                style={{
                  padding: "10px 12px",
                  fontWeight: 600,
                  borderRight: "1px solid #eee"
                }}
              >
                {row.label}
              </div>

              {[...Array(row.slots)].map((_, slotIndex) => {
                const player = players[slotIndex];

                return (
                  <div
                    key={slotIndex}
                    onClick={() => player && onPlayerClick(player)}
                    style={{
                      padding: "10px 12px",
                      borderRight:
                        slotIndex < row.slots - 1
                          ? "1px solid #eee"
                          : "none",
                      opacity: player ? 1 : 0.4,
                      cursor: player ? "pointer" : "default"
                    }}
                  >
                    {player
                      ? `${player.name} (${player.overall})`
                      : "—"}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div style={{ marginTop: "10px" }}>
      {renderSection("Offense", depthChartStructure.offense)}
      {renderSection("Defense", depthChartStructure.defense)}
      {renderSection("Special Teams", depthChartStructure.specialTeams)}
    </div>
  );
};

export default DepthChart2;
