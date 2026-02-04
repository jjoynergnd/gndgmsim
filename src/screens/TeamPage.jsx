import React, { useState } from "react";
import { useSelector } from "react-redux";
import teams from "../data/teams.json";

import TeamHeader from "../components/team/TeamHeader";
import TeamTabs from "../components/team/TeamTabs";

import RosterTable from "../components/team/RosterTable";
import DepthChart from "../components/team/DepthChart";
import StaffTable from "../components/team/StaffTable";
import FinancesPanel from "../components/team/FinancesPanel";
import ScheduleTable from "../components/team/ScheduleTable";
import StatsPanel from "../components/team/StatsPanel";

// Vite-friendly dynamic imports
const rosterMap = import.meta.glob("../data/rosters/*.json", { eager: true });
const staffMap = import.meta.glob("../data/staff/*.json", { eager: true });
const scheduleMap = import.meta.glob("../data/schedules/*.json", { eager: true });
const metaMap = import.meta.glob("../data/meta/*.json", { eager: true });

// Convert file paths to team IDs
const normalize = (obj) => {
  const out = {};
  for (const path in obj) {
    const key = path.split("/").pop().replace(".json", "");
    out[key] = obj[path].default;
  }
  return out;
};

const rosters = normalize(rosterMap);
const staff = normalize(staffMap);
const schedules = normalize(scheduleMap);
const meta = normalize(metaMap);

const TeamPage = () => {
  const selectedTeam = useSelector((state) => state.team.selectedTeam);
  const team = teams.find((t) => t.id === selectedTeam);

  const [tab, setTab] = useState("roster");

  return (
    <div style={{ padding: "20px", paddingTop: "10px" }}>
      <TeamHeader team={team} />

      <div style={{ height: "10px" }} />

      <TeamTabs tab={tab} setTab={setTab} />

      {tab === "roster" && <RosterTable roster={rosters[selectedTeam]} />}
      {tab === "depthChart" && <DepthChart roster={rosters[selectedTeam]} />}
      {tab === "staff" && <StaffTable staff={staff[selectedTeam]} />}
      {tab === "finances" && <FinancesPanel meta={meta[selectedTeam]} />}
      {tab === "schedule" && <ScheduleTable schedule={schedules[selectedTeam]} />}
      {tab === "stats" && <StatsPanel />}
    </div>
  );
};

export default TeamPage;
