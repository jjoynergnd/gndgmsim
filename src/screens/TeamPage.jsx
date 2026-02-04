import React, { useState } from "react";
import { useSelector } from "react-redux";
import teams from "../data/teams.json";

import TeamHeader from "../components/team/TeamHeader";
import TeamTabs from "../components/team/TeamTabs";
import RosterTable from "../components/team/RosterTable";

import balRoster from "../data/rosters/BAL.json";
import bufRoster from "../data/rosters/BUF.json";

const rosterMap = {
  BAL: balRoster,
  BUF: bufRoster,
};

const TeamPage = () => {
  const selectedTeam = useSelector((state) => state.team.selectedTeam);
  const team = teams.find((t) => t.id === selectedTeam);

  const [tab, setTab] = useState("roster");

  const roster = rosterMap[selectedTeam] || [];

  return (
    <div style={{ padding: "20px" }}>
      <TeamHeader team={team} />

      <TeamTabs tab={tab} setTab={setTab} />

      {/* TAB CONTENT */}
      {tab === "roster" && <RosterTable roster={roster} />}

      {tab !== "roster" && (
        <div style={{ opacity: 0.6, marginTop: "20px" }}>
          This section will be implemented soon.
        </div>
      )}
    </div>
  );
};

export default TeamPage;
