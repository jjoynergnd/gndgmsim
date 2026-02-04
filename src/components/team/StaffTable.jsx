import React from "react";
import Table from "../Table";

const StaffTable = ({ staff }) => {
  if (!staff) {
    return <div style={{ opacity: 0.7 }}>No staff data available.</div>;
  }

  const rows = [
    { role: "Head Coach", name: staff.HC?.name, rating: staff.HC?.rating },
    { role: "Offensive Coordinator", name: staff.OC?.name, rating: staff.OC?.rating },
    { role: "Defensive Coordinator", name: staff.DC?.name, rating: staff.DC?.rating },
  ];

  const columns = [
    { header: "Role", accessor: "role" },
    { header: "Name", accessor: "name" },
    { header: "Rating", accessor: "rating" },
  ];

  return (
    <div style={{ marginTop: "10px" }}>
      <Table columns={columns} data={rows} />
    </div>
  );
};

export default StaffTable;
