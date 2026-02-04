import React from "react";
import Table from "../Table";

const StaffTable = ({ staff, onPlayerClick }) => {
  if (!staff) {
    return <div style={{ opacity: 0.7 }}>No staff data available.</div>;
  }

  const rows = [
    { role: "Head Coach", ...staff.HC },
    { role: "Offensive Coordinator", ...staff.OC },
    { role: "Defensive Coordinator", ...staff.DC }
  ];

  const columns = [
    { header: "Role", accessor: "role" },
    { header: "Name", accessor: "name" },
    { header: "Rating", accessor: "rating" }
  ];

  return (
    <div style={{ marginTop: "10px" }}>
      <Table
        columns={columns}
        data={rows}
        onRowClick={(coach) => onPlayerClick(coach)}
      />
    </div>
  );
};

export default StaffTable;
