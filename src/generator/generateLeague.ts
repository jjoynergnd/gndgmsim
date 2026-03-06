// src/generator/generateLeague.ts
// @ts-nocheck

import fs from "fs";
import path from "path";

import { generateTeamRoster } from "./rosterGenerator.js";
import { generateTeamState } from "./teamStateGenerator.js";
import { generateLeague } from "./leagueGenerator.js";

const ARG = process.argv[2] ?? "TEST";
const YEAR = 2026;

const OUTPUT_DIR = path.join(process.cwd(), "src/data/league");
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

function writeJSON(filePath: string, data: any) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
}

function generateSingleTeam(teamId: string) {
  const roster = generateTeamRoster(teamId, YEAR);
  const teamState = generateTeamState(teamId, roster.players, YEAR);

  const filePath = path.join(OUTPUT_DIR, `${teamId}.json`);
  writeJSON(filePath, teamState);

  console.log(`✔️ TeamState written → ${filePath}`);
}

function generateFullLeague() {
  const league = generateLeague(YEAR);

  const filePath = path.join(OUTPUT_DIR, `league.json`);
  writeJSON(filePath, league);

  console.log(`✔️ LeagueState written → ${filePath}`);
}

if (ARG.toUpperCase() === "ALL") {
  generateFullLeague();
} else {
  generateSingleTeam(ARG);
}