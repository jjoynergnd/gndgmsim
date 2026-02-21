/* eslint-env node */
import fs from "fs";
import path from "path";
import { faker } from "@faker-js/faker";

import { POSITION_GROUPS } from "./generators/positions.js";
import { generateVitals } from "./generators/vitals.js";
import { generateArchetype } from "./generators/archetype.js";
import { generateContract } from "./generators/contract.js";
import { generateRatings } from "./generators/ratings.js";
import { generateTraits } from "./generators/traits.js";
import { generateStats } from "./generators/stats.js";
import { generateMaleName } from "./generators/name.js";

const TEAM = process.argv[2];
const CURRENT_YEAR = 2026;

if (!TEAM) {
  console.error("Usage: node scripts/generateRoster.js <TEAM>");
  process.exit(1);
}

const OFFENSE = ["QB", "RB", "WR", "TE", "LT", "LG", "C", "RG", "RT"];
const DEFENSE = ["LDE", "RDE", "DT", "LOLB", "MLB", "ROLB", "CB", "FS", "SS"];
const SPECIAL = ["K", "P"];

function getSide(position) {
  if (SPECIAL.includes(position)) return "ST";
  if (DEFENSE.includes(position)) return "DEF";
  return "OFF";
}

function generatePlayer(team, position, index) {
  const name = generateMaleName();

  // 1) Position-aware vitals
  const vitals = generateVitals(position);

  // 2) Archetype assigned BEFORE ratings
  const archetype = generateArchetype(position);
  vitals.archetype = archetype;

  // 3) Madden-style ratings based on position + archetype
  const ratings = generateRatings(position, archetype);

  // 4) Traits (unchanged for now)
  const traits = generateTraits();

  // 5) NFL-style contract based on ratings + vitals
  const contract = generateContract(position, ratings, vitals, CURRENT_YEAR);

  return {
    id: `${team}-${position}-${index}`,
    team,
    teamName: team,
    name,
    jerseyNumber: faker.number.int({ min: 1, max: 99 }),
    position,
    side: getSide(position),
    depth: index,

    vitals,
    contract,
    ratings,
    traits,
    stats: generateStats(),

    photo: `/player_faces/${faker.number.int({ min: 1, max: 50 })}.png`,
  };
}

function generateRoster(team) {
  const players = [];

  for (const [position, count] of Object.entries(POSITION_GROUPS)) {
    for (let i = 1; i <= count; i++) {
      players.push(generatePlayer(team, position, i));
    }
  }

  return players;
}

const roster = generateRoster(TEAM);

const outPath = path.join("src/data/rosters", `${TEAM}.json`);
fs.writeFileSync(outPath, JSON.stringify(roster, null, 2));

console.log(`Generated roster for ${TEAM} → ${outPath}`);
