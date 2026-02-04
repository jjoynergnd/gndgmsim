import React from "react";
import Table from "../Table";

const ScheduleTable = ({ schedule }) => {
  if (!schedule || schedule.length === 0) {
    return <div style={{ opacity: 0.7 }}>No schedule available.</div>;
  }

  const data = schedule.map((g) => ({
    week: g.week,
    opponent: g.opponent,
    homeAway: g.home ? "Home" : "Away",
  }));

  const columns = [
    { header: "Week", accessor: "week" },
    { header: "Opponent", accessor: "opponent" },
    { header: "Home/Away", accessor: "homeAway" },
  ];

  return (
    <div style={{ marginTop: "10px" }}>
      <Table columns={columns} data={data} />
    </div>
  );
};

export default ScheduleTable;
