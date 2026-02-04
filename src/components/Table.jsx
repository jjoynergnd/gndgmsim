import React from "react";

const Table = ({ columns, data }) => {
  return (
    <div
      style={{
        border: "1px solid #dcdcdc",
        borderRadius: "8px",
        overflow: "hidden",
        background: "#fff",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: columns.map(() => "1fr").join(" "),
          background: "#f7f7f7",
          borderBottom: "1px solid #dcdcdc",
        }}
      >
        {columns.map((col, idx) => (
          <div
            key={idx}
            style={{
              padding: "10px 12px",
              fontWeight: 700,
              fontSize: "14px",
              borderRight: idx < columns.length - 1 ? "1px solid #e5e5e5" : "none",
            }}
          >
            {col.header}
          </div>
        ))}
      </div>

      {/* ROWS */}
      {data.map((row, rowIndex) => (
        <div
          key={rowIndex}
          style={{
            display: "grid",
            gridTemplateColumns: columns.map(() => "1fr").join(" "),
            borderBottom: rowIndex < data.length - 1 ? "1px solid #eee" : "none",
            background: rowIndex % 2 === 0 ? "#fff" : "#fafafa",
            transition: "background 0.15s ease",
          }}
        >
          {columns.map((col, colIndex) => (
            <div
              key={colIndex}
              style={{
                padding: "10px 12px",
                fontSize: "14px",
                borderRight: colIndex < columns.length - 1 ? "1px solid #f0f0f0" : "none",
              }}
            >
              {row[col.accessor]}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Table;
