import React from "react";
import Table from "../Table";

const ScheduleTable = ({ schedule, season }) => {
  if (!schedule || schedule.length === 0) {
    return <div style={{ opacity: 0.7 }}>No schedule available.</div>;
  }

  const currentWeek = season?.phase === "REGULAR_SEASON" ? season.week : null;

  const data = schedule.map((g) => {
    const played =
      currentWeek !== null && g.week < currentWeek;

    return {
      week: g.week,
      opponent: g.opponent,
      homeAway: g.home ? "Home" : "Away",
      status: played ? "Final" : "Upcoming",
      _rowStyle: played ? { opacity: 0.6 } : {}
    };
  });

  const columns = [
    { header: "Week", accessor: "week" },
    { header: "Opponent", accessor: "opponent" },
    { header: "Home/Away", accessor: "homeAway" },
    { header: "Status", accessor: "status" }
  ];

  return (
    <div style={{ marginTop: "10px" }}>
      <Table columns={columns} data={data} />
    </div>
  );
};

export default ScheduleTable;
