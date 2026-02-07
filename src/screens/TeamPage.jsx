import React, { useState } from "react";
import { useSelector } from "react-redux";
import teams from "../data/teams.json";

import TeamHeader from "../components/team/TeamHeader";
import TeamSeasonRoadmap from "../components/season/TeamSeasonRoadmap";
import TeamTabs from "../components/team/TeamTabs";

import RosterTable from "../components/team/RosterTable";
import DepthChart from "../components/team/depthchart/DepthChart.jsx";
import StaffTable from "../components/team/StaffTable";
import FinancesPanel from "../components/team/FinancesPanel";
import ScheduleTable from "../components/team/ScheduleTable";
import StatsPanel from "../components/team/StatsPanel";
import PlayerModal from "../components/player/PlayerModal";

// Vite-friendly dynamic imports
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

  // TEMP season context — read-only for now
  const [seasonContext] = useState({
    year: 2026,
    phase: "REGULAR_SEASON", // PRESEASON | REGULAR_SEASON | PLAYOFFS | OFFSEASON
    week: 4,
  });

  const handlePlayerClick = (player) => setSelectedPlayer(player);

  return (
    <div style={{ paddingBottom: "40px" }}>
      <TeamHeader team={team} />

      {/* Tier 2 — Team Season Context */}
      <TeamSeasonRoadmap season={seasonContext} />

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
