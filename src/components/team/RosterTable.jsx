import React from "react";
import Table from "../Table";

const RosterTable = ({ roster, onPlayerClick }) => {
  if (!roster) return null;

  const columns = [
    { header: "Name", accessor: "name" },
    { header: "Pos", accessor: "position" },
    { header: "OVR", accessor: "overall" }
  ];

  return (
    <div style={{ marginTop: "10px" }}>
      <Table
        columns={columns}
        data={roster}
        onRowClick={(player) => onPlayerClick(player)}
      />
    </div>
  );
};

export default RosterTable;
