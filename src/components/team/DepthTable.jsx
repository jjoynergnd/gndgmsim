import React from "react";
import Table from "../Table";

const DepthTable = ({ roster }) => {
  if (!roster || roster.length === 0) {
    return <div style={{ opacity: 0.7 }}>No depth chart available.</div>;
  }

  const columns = [
    { header: "Pos", accessor: "position" },
    { header: "Name", accessor: "name" },
    { header: "OVR", accessor: "overall" },
  ];

  return (
    <div style={{ marginTop: "10px" }}>
      <Table columns={columns} data={roster} />
    </div>
  );
};

export default DepthTable;
