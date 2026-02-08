import React, { useState } from "react";
import { useSelector } from "react-redux";
import teams from "../data/teams.json";

import seasonState from "../data/season/seasonState.json";
import { advanceSeason } from "../utils/seasonEngine";

import TeamHeader from "../components/team/TeamHeader";
import TeamSeasonRoadmap from "../components/season/TeamSeasonRoadmap";
import NextActionCard from "../components/season/NextActionCard";
import TeamTabs from "../components/team/TeamTabs";

import RosterTable from "../components/team/RosterTable";
import DepthChart from "../components/team/depthchart/DepthChart.jsx";
import StaffTable from "../components/team/StaffTable";
import FinancesPanel from "../components/team/FinancesPanel";
import ScheduleTable from "../components/team/ScheduleTable";
import StatsPanel from "../components/team/StatsPanel";
import PlayerModal from "../components/player/PlayerModal";

// dynamic imports
const rosterMap = import.meta.glob("../data/rosters/*.json", { eager: true });
const staffMap = import.meta.glob("../data/staff/*.json", { eager: true });
const scheduleMap = import.meta.glob("../data/schedules/*.json", { eager: true });
const metaMap = import.meta.glob("../data/meta/*.json", { eager: true });

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
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [season, setSeason] = useState(seasonState);

  const handlePlayerClick = (player) => setSelectedPlayer(player);

  const canAdvance = true;

  const warnings = [];
  if (season.warnings?.injuries > 0)
    warnings.push(`${season.warnings.injuries} injured starters`);
  if (season.warnings?.depthChartIssues > 0)
    warnings.push("Depth chart incomplete");
  if (season.warnings?.capOver)
    warnings.push("Over the salary cap");

  const handleAdvance = () => {
    const teamContext = {
      teamId: selectedTeam,
      roster: rosters[selectedTeam],
      schedule: schedules[selectedTeam],
      meta: meta[selectedTeam],
      staff: staff[selectedTeam]
    };

    setSeason((prev) => advanceSeason(prev, teamContext));
  };

  const handleSelectPhase = (phaseKey) => {
    console.log("Clicked roadmap phase:", phaseKey);
  };

  return (
    <div style={{ paddingBottom: "40px" }}>
      <TeamHeader team={team} />

      <TeamSeasonRoadmap
        season={season}
        onSelectPhase={handleSelectPhase}
      />

      <NextActionCard
        season={season}
        onAdvance={handleAdvance}
        canAdvance={canAdvance}
        warnings={warnings}
      />

      <div style={{ height: "12px" }} />

      <TeamTabs tab={tab} setTab={setTab} />

      <div style={{ marginTop: "20px" }}>
        {tab === "roster" && (
          <RosterTable
            roster={rosters[selectedTeam]}
            onPlayerClick={handlePlayerClick}
          />
        )}

        {tab === "depthChart" && (
          <DepthChart
            roster={rosters[selectedTeam]}
            onPlayerClick={handlePlayerClick}
          />
        )}

        {tab === "staff" && (
          <StaffTable
            staff={staff[selectedTeam]}
            onPlayerClick={handlePlayerClick}
          />
        )}

        {tab === "finances" && (
          <FinancesPanel meta={meta[selectedTeam]} />
        )}

        {tab === "schedule" && (
          <ScheduleTable schedule={schedules[selectedTeam]} />
        )}

        {tab === "stats" && <StatsPanel />}
      </div>

      <PlayerModal
        player={selectedPlayer}
        onClose={() => setSelectedPlayer(null)}
      />
    </div>
  );
};

export default TeamPage;
