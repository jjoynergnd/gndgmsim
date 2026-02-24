// src/generator/generateLeague.ts
// @ts-nocheck

import fs from "fs";
import path from "path";

import { generatePlayer } from "./engines/playerGenerator.js";
import { POSITION_GROUPS } from "./config/positions.js";
import type { Position } from "./config/positions.js";
import { teams } from "../data/teams.js";

import { getLeagueCap } from "./cap/leagueCap.js";
import { getTeamTotalSalary, getTeamCapSpace } from "./cap/teamCapCalculator.js";

const ARG = process.argv[2] ?? "TEST";

const ROSTER_DIR = path.join(process.cwd(), "src/data/rosters");
const META_DIR = path.join(process.cwd(), "src/data/meta");

function writeJSON(filePath: string, data: any) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
}

function generateTeamRoster(team: string, year: number) {
  const players: any[] = [];

  for (const [position, count] of Object.entries(POSITION_GROUPS)) {
    for (let i = 0; i < count; i++) {
      const player = generatePlayer(position as Position, year);
      players.push(player);
    }
  }

  return players;
}

function generateSingleTeam(teamId: string, year = 2026) {
  console.log(`\n=== Generating roster for ${teamId} (${year}) ===\n`);

  const roster = generateTeamRoster(teamId, year);
  console.log("DEBUG roster length:", roster.length);

  console.log("DEBUG FIRST CONTRACT:", roster[0]?.contract);

  const rosterPath = path.join(ROSTER_DIR, `${teamId}.json`);
  writeJSON(rosterPath, roster);
  

  const totalSalary = getTeamTotalSalary(roster, year);
  const leagueCap = getLeagueCap(year);
  const capSpace = getTeamCapSpace(totalSalary, leagueCap);

  console.log(`💰 Total Team Salary (${teamId}): $${totalSalary.toLocaleString()}`);
  console.log(`🧢 League Cap (${year}): $${leagueCap.toLocaleString()}`);
  console.log(`📉 Cap Space (${teamId}): $${capSpace.toLocaleString()}`);

  const metaPath = path.join(META_DIR, `${teamId}.json`);
  writeJSON(metaPath, { teamId, year, totalSalary, leagueCap, capSpace });

  console.log(`✔️ Meta written → ${metaPath}`);
}

function generateLeagueSummary(year: number) {
  const allTeamIds = teams.map(t => t.id);

  const teamSummaries = allTeamIds.map(teamId => {
    const metaPath = path.join(META_DIR, `${teamId}.json`);
    const data = JSON.parse(fs.readFileSync(metaPath, "utf8"));
    return {
      teamId: data.teamId,
      totalSalary: data.totalSalary,
      capSpace: data.capSpace
    };
  });

  const leagueCap = getLeagueCap(year);

  const averageTeamSpend =
    Math.round(teamSummaries.reduce((s, t) => s + t.totalSalary, 0) / teamSummaries.length);

  const averageCapSpace =
    Math.round(teamSummaries.reduce((s, t) => s + t.capSpace, 0) / teamSummaries.length);

  const maxCapSpaceTeam = teamSummaries.reduce((a, b) =>
    a.capSpace > b.capSpace ? a : b
  );

  const minCapSpaceTeam = teamSummaries.reduce((a, b) =>
    a.capSpace < b.capSpace ? a : b
  );

  const leagueMeta = {
    year,
    leagueCap,
    averageTeamSpend,
    averageCapSpace,
    teams: teamSummaries,
    maxCapSpaceTeam,
    minCapSpaceTeam
  };

  const leaguePath = path.join(META_DIR, "LeagueCap.json");
  writeJSON(leaguePath, leagueMeta);

  console.log(`\n=== League Cap Summary (${year}) ===`);
  console.log(`League Cap: $${leagueCap.toLocaleString()}`);
  console.log(`Avg Spend: $${averageTeamSpend.toLocaleString()}`);
  console.log(`Most Cap Space: ${maxCapSpaceTeam.teamId} ($${maxCapSpaceTeam.capSpace.toLocaleString()})`);
  console.log(`Least Cap Space: ${minCapSpaceTeam.teamId} ($${minCapSpaceTeam.capSpace.toLocaleString()})`);
  console.log(`✔️ LeagueCap.json written → ${leaguePath}\n`);
}

if (ARG.toUpperCase() === "ALL") {
  console.log(`\n=== Generating ALL teams ===\n`);

  const year = 2026;
  const allTeamIds = teams.map(t => t.id);

  for (const teamId of allTeamIds) {
    generateSingleTeam(teamId, year);
  }

  generateLeagueSummary(year);

  console.log(`\n🎉 Finished generating ALL teams.\n`);
} else {
  const TEAM = ARG;
  const year = 2026;
  generateSingleTeam(TEAM, year);
  console.log(`\n🎉 Finished generating ${TEAM}.\n`);
}
