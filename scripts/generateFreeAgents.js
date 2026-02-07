/* eslint-env node */
import fs from "fs";
import path from "path";
import { faker } from "@faker-js/faker";

import { POSITION_GROUPS } from "./generators/positions.js";
import { generateVitals } from "./generators/vitals.js";
import { generateContract } from "./generators/contract.js";
import { generateRatings } from "./generators/ratings.js";
import { generateTraits } from "./generators/traits.js";
import { generateStats } from "./generators/stats.js";
import { generateMaleName } from "./generators/name.js";

const TOTAL_FREE_AGENTS = 150;

function weightedAge() {
  const roll = Math.random();
  if (roll < 0.55) return faker.number.int({ min: 25, max: 29 });
  if (roll < 0.80) return faker.number.int({ min: 30, max: 33 });
  if (roll < 0.95) return faker.number.int({ min: 34, max: 37 });
  return faker.number.int({ min: 38, max: 40 });
}

function generateFreeAgent(position, index) {
  return {
    id: `FA-${position}-${index}`,
    team: "FA",
    teamName: "Free Agent",
    name: generateMaleName(),
    jerseyNumber: faker.number.int({ min: 1, max: 99 }),
    position,
    side: ["K", "P"].includes(position)
      ? "ST"
      : ["EDGE", "DT", "MLB", "OLB", "CB", "S"].includes(position)
      ? "DEF"
      : "OFF",
    depth: 0,

    vitals: {
      ...generateVitals(),
      age: weightedAge(),
    },

    contract: generateContract(true), // allow premium FA deals
    ratings: generateRatings(position),
    traits: generateTraits(),
    stats: generateStats(),

    photo: `/player_faces/${faker.number.int({ min: 1, max: 50 })}.png`,
  };
}

function generateFreeAgents() {
  const positions = Object.keys(POSITION_GROUPS);
  const agents = [];

  for (let i = 0; i < TOTAL_FREE_AGENTS; i++) {
    const pos = faker.helpers.arrayElement(positions);
    agents.push(generateFreeAgent(pos, i + 1));
  }

  return agents;
}

const outPath = path.join("src/data", "freeAgents.json");
fs.writeFileSync(outPath, JSON.stringify(generateFreeAgents(), null, 2));

console.log(`Generated ${TOTAL_FREE_AGENTS} free agents → ${outPath}`);
