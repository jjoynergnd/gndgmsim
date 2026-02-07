import React from "react";
import styles from "./TableStyles.module.css";

const Table = ({ columns, data, onRowClick }) => {
  const getValue = (row, accessor) => {
    if (typeof accessor === "function") return accessor(row);
    return row[accessor];
  };

  const gridTemplate = columns.map((col) => col.width || "1fr").join(" ");

  return (
    <div className={styles.tableContainer}>
      {/* HEADER */}
      <div
        className={styles.headerRow}
        style={{ gridTemplateColumns: gridTemplate }}
      >
        {columns.map((col, idx) => (
          <div
            key={idx}
            className={styles.headerCell}
            style={{ textAlign: col.headerStyle?.textAlign || "left" }}
          >
            {col.header}
          </div>
        ))}
      </div>

      {/* ROWS */}
      {data.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className={styles.dataRow}
          style={{
            gridTemplateColumns: gridTemplate,
            cursor: onRowClick ? "pointer" : "default",
          }}
          onClick={() => onRowClick && onRowClick(row)}
        >
          {columns.map((col, colIndex) => (
            <div
              key={colIndex}
              className={styles.dataCell}
              style={{ textAlign: col.cellStyle?.textAlign || "left" }}
            >
              {getValue(row, col.accessor)}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Table;
