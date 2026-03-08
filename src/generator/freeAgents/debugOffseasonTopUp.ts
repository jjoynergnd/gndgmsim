// src/generator/freeAgents/debugOffseasonTopUp.ts

import fs from "fs";
import type { LeagueState } from "../../generator/leagueGenerator.js";
import leagueJson from "../../data/league/league.json" with { type: "json" };

import { generateOffseasonFreeAgents } from "./generateOffseasonFreeAgents.js";
import { ROSTER_DISTRIBUTION } from "../config/rosterDistribution.js";
import type { Position } from "../config/positions.js";

// Tell TypeScript what the JSON actually is
const league = leagueJson as LeagueState;

// Count free agents by position
const counts: Record<Position, number> = {} as any;

for (const pos of Object.keys(ROSTER_DISTRIBUTION) as Position[]) {
  counts[pos] = 0;
}

for (const fa of league.freeAgents) {
  counts[fa.position] = (counts[fa.position] ?? 0) + 1;
}

// Print counts to terminal
console.log("=== Free Agent Position Counts ===");
for (const pos of Object.keys(counts) as Position[]) {
  const current = counts[pos];
  const target = ROSTER_DISTRIBUTION[pos];
  const need = Math.max(0, target - current);

  console.log(
    `${pos.padEnd(7)}  Current: ${current
      .toString()
      .padStart(3)}  Target: ${target
      .toString()
      .padStart(3)}  Need: ${need}`
  );
}

console.log("\n=== Generating Missing Free Agents ===");

const year = league.settings.currentYear;
const newFAs = generateOffseasonFreeAgents(league.freeAgents, year);

fs.writeFileSync("offseasonTopUpTest.json", JSON.stringify(newFAs, null, 2));

console.log(`Generated ${newFAs.length} new free agents → offseasonTopUpTest.json`);