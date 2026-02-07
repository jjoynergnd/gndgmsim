/* eslint-env node */
import fs from "fs";
import path from "path";
import { faker } from "@faker-js/faker";

import { POSITION_GROUPS } from "./generators/positions.js";
import { generateVitals } from "./generators/vitals.js";
import { generateRatings } from "./generators/ratings.js";
import { generateTraits } from "./generators/traits.js";
import { generateMaleName } from "./generators/name.js";

const TOTAL_PROSPECTS = 250;

const COLLEGES = [
  "Alabama", "Georgia", "Ohio State", "Michigan", "Texas",
  "Oregon", "LSU", "Clemson", "Florida State", "USC",
  "Penn State", "Notre Dame", "Washington", "Tennessee",
  "Iowa", "TCU", "Oklahoma", "Miami", "Utah", "Wisconsin"
];

function projectedRound() {
  const roll = Math.random();
  if (roll < 0.10) return 1;
  if (roll < 0.25) return 2;
  if (roll < 0.45) return 3;
  if (roll < 0.65) return 4;
  if (roll < 0.80) return 5;
  if (roll < 0.92) return 6;
  if (roll < 0.98) return 7;
  return "UDFA";
}

function generateProspect(position, index) {
  return {
    id: `DRAFT-${position}-${index}`,
    team: "DRAFT",
    teamName: "Draft Class",
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
      age: faker.number.int({ min: 20, max: 23 }),
      college: faker.helpers.arrayElement(COLLEGES),
      experience: 0,
    },

    contract: {
      years: 0,
      totalValue: 0,
      capHit: 0,
      deadCap: 0,
      signingBonus: 0,
      expiresYear: null,
      contractType: "Rookie",
    },

    ratings: generateRatings(position),
    traits: generateTraits(),
    stats: { season: {}, career: {} },

    projectedRound: projectedRound(),

    photo: `/player_faces/${faker.number.int({ min: 1, max: 50 })}.png`,
  };
}

function generateDraftClass() {
  const positions = Object.keys(POSITION_GROUPS);
  const prospects = [];

  for (let i = 0; i < TOTAL_PROSPECTS; i++) {
    const pos = faker.helpers.arrayElement(positions);
    prospects.push(generateProspect(pos, i + 1));
  }

  return prospects;
}

const outPath = path.join("src/data", "draftClass.json");
fs.writeFileSync(outPath, JSON.stringify(generateDraftClass(), null, 2));

console.log(`Generated ${TOTAL_PROSPECTS} draft prospects → ${outPath}`);
