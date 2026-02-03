// -----------------------------------------------------------------------------
// File: src/components/Table.jsx
// Purpose:
//   Reusable table component for displaying structured data such as rosters,
//   free agents, draft prospects, standings, etc.
//
// Notes:
//   - Extremely simple for Phase 1.
//   - Accepts columns (array) and data (array).
//   - Later we can add sorting, pagination, sticky headers, etc.
// -----------------------------------------------------------------------------

import React from "react";

const Table = ({ columns = [], data = [] }) => {
  return (
    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
        background: "white",
      }}
    >
      <thead>
        <tr>
          {columns.map((col) => (
            <th
              key={col.key}
              style={{
                textAlign: "left",
                padding: "10px",
                borderBottom: "2px solid #ddd",
                fontWeight: "600",
              }}
            >
              {col.label}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {data.map((row, idx) => (
          <tr key={idx}>
            {columns.map((col) => (
              <td
                key={col.key}
                style={{
                  padding: "10px",
                  borderBottom: "1px solid #eee",
                }}
              >
                {row[col.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
