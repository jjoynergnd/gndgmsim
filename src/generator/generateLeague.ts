// src/generator/generateLeague.ts
// @ts-nocheck

import fs from "fs";
import path from "path";

import { generatePlayer } from "./engines/playerGenerator.js";
import { POSITION_GROUPS } from "./config/positions.js";
import type { Position } from "./config/positions.js";

import { teams } from "../data/teams.js";

// NEW — league cap module
import { getLeagueCap } from "./contract/salaryCap.js";

const ARG = process.argv[2] ?? "TEST";
const CURRENT_YEAR = 2026;

const ROSTER_DIR = path.join(process.cwd(), "src/data/rosters");
const META_DIR = path.join(process.cwd(), "src/data/meta");

function writeJSON(filePath: string, data: any) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
}

function generateTeamRoster(team: string) {
  const players: any[] = [];

  for (const [position, count] of Object.entries(POSITION_GROUPS)) {
    for (let i = 0; i < count; i++) {
      const player = generatePlayer(position as Position);
      players.push(player);
    }
  }

  return players;
}

function computeTeamTotalSalary(roster: any[]): number {
  return roster.reduce((sum, p) => sum + (p.contract?.salary ?? 0), 0);
}

function generateSingleTeam(teamId: string) {
  console.log(`\n=== Generating roster for ${teamId} ===\n`);

  const roster = generateTeamRoster(teamId);

  const rosterPath = path.join(ROSTER_DIR, `${teamId}.json`);
  writeJSON(rosterPath, roster);
  console.log(`✔️ Roster written → ${rosterPath}`);

  const totalSalary = computeTeamTotalSalary(roster);
  const leagueCap = getLeagueCap(CURRENT_YEAR);
  const capSpace = leagueCap - totalSalary;

  console.log(`💰 Total Team Salary (${teamId}): $${totalSalary.toLocaleString()}`);
  console.log(`🧢 League Cap (${CURRENT_YEAR}): $${leagueCap.toLocaleString()}`);
  console.log(`📉 Cap Space (${teamId}): $${capSpace.toLocaleString()}`);

  const metaPath = path.join(META_DIR, `${teamId}.json`);
  writeJSON(metaPath, {
    teamId,
    year: CURRENT_YEAR,
    totalSalary,
    leagueCap,
    capSpace
  });

  console.log(`✔️ Meta written → ${metaPath}`);
}

if (ARG.toUpperCase() === "ALL") {
  console.log(`\n=== Generating ALL teams ===\n`);

  const allTeamIds = teams.map(t => t.id);

  for (const teamId of allTeamIds) {
    generateSingleTeam(teamId);
  }

  console.log(`\n🎉 Finished generating ALL teams.\n`);
} else {
  const TEAM = ARG;
  generateSingleTeam(TEAM);
  console.log(`\n🎉 Finished generating ${TEAM}.\n`);
}
