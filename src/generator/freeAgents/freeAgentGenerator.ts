// src/generator/freeAgents/freeAgentGenerator.ts

import { faker } from "@faker-js/faker";

import { generatePlayerName } from "../helpers/playerName.js";
import { generatePlayerVitals } from "../helpers/playerVitals.js";
import { generatePlayerTraits } from "../helpers/playerTraits.js";
import { generatePlayerStats } from "../helpers/playerStats.js";
import { generatePlayerInjuryBlock } from "../helpers/playerInjury.js";
import { pickPlayerPhoto } from "../helpers/playerPhoto.js";

import { generateRatings } from "../engines/ratingGenerator.js";
import { computeAllSchemeFits } from "../engines/schemeFitCalculator.js";
import { assignPotential } from "../engines/playerPotential.js";

import { generateBaseContract } from "../contract/contractBase.js";

import type { PlayerState, Position } from "../../state/player.js";

// Weighted distribution of positions for free agents
const POSITION_WEIGHTS: Record<Position, number> = {
  QB: 3,
  HB: 8,
  FB: 1,
  WR_X: 4,
  WR_Z: 4,
  WR_SLOT: 4,
  TE: 6,
  LT: 4,
  LG: 4,
  C: 3,
  RG: 4,
  RT: 4,
  EDGE: 10,
  DE: 6,
  DT_NT: 4,
  DT_3T: 4,
  MLB: 6,
  OLB: 6,
  CB: 10,
  NCB: 2,
  FS: 4,
  SS: 4,
  K: 2,
  P: 2,
  LS: 1,
  KR: 1,
  PR: 1
};

function weightedAge(): number {
  const roll = Math.random();
  if (roll < 0.55) return faker.number.int({ min: 25, max: 29 });
  if (roll < 0.80) return faker.number.int({ min: 30, max: 33 });
  if (roll < 0.95) return faker.number.int({ min: 34, max: 37 });
  return faker.number.int({ min: 38, max: 40 });
}

// Simple height/weight ranges by position family
function generateHeightWeight(position: Position): { height: number; weight: number } {
  switch (position) {
    case "QB":
      return { height: faker.number.int({ min: 72, max: 78 }), weight: faker.number.int({ min: 205, max: 240 }) };
    case "HB":
    case "WR_X":
    case "WR_Z":
    case "WR_SLOT":
      return { height: faker.number.int({ min: 69, max: 75 }), weight: faker.number.int({ min: 190, max: 220 }) };
    case "TE":
      return { height: faker.number.int({ min: 75, max: 79 }), weight: faker.number.int({ min: 240, max: 265 }) };
    case "LT":
    case "LG":
    case "C":
    case "RG":
    case "RT":
      return { height: faker.number.int({ min: 75, max: 80 }), weight: faker.number.int({ min: 295, max: 335 }) };
    case "EDGE":
    case "DE":
    case "DT_NT":
    case "DT_3T":
      return { height: faker.number.int({ min: 74, max: 79 }), weight: faker.number.int({ min: 270, max: 320 }) };
    case "MLB":
    case "OLB":
      return { height: faker.number.int({ min: 72, max: 76 }), weight: faker.number.int({ min: 230, max: 255 }) };
    case "CB":
    case "NCB":
    case "FS":
    case "SS":
      return { height: faker.number.int({ min: 70, max: 74 }), weight: faker.number.int({ min: 190, max: 210 }) };
    case "K":
    case "P":
    case "LS":
      return { height: faker.number.int({ min: 70, max: 75 }), weight: faker.number.int({ min: 185, max: 215 }) };
    case "FB":
      return { height: faker.number.int({ min: 71, max: 75 }), weight: faker.number.int({ min: 235, max: 255 }) };
    default:
      return { height: 72, weight: 210 };
  }
}

export function generateFreeAgent(position: Position, year: number): PlayerState {
  const { firstName, lastName, name } = generatePlayerName();

  const age = weightedAge();

  const vitalsRaw = generatePlayerVitals();
  const vitals = {
    handedness: vitalsRaw.handedness as "Left" | "Right"
  };

  const traits = generatePlayerTraits();
  const stats = generatePlayerStats();
  const injuryBlock = generatePlayerInjuryBlock(position);

  const { height, weight } = generateHeightWeight(position);

  const ratingBlock = generateRatings(position, age);
  const { tier, archetype, ratings } = ratingBlock;

  const schemeFits = computeAllSchemeFits(position, ratings);

  const potential = assignPotential({
    age,
    ratings,
    tier
  } as any);

  const rawContract = generateBaseContract({
    position,
    ovr: ratings.overall ?? 70,
    age,
    year,
    tier
  });

  const contract = {
  ...rawContract,
  structureType: rawContract.structureType as "balanced" | "frontloaded" | "backloaded",
  cuttableYear: rawContract.cuttableYear ?? 0
};

  return {
    id: faker.string.uuid(),
    name,
    firstName,
    lastName,
    position,

    age,
    height,
    weight,
    college: faker.company.name(),
    experience: faker.number.int({ min: 1, max: 12 }),
    accruedSeasons: faker.number.int({ min: 1, max: 12 }),

    vitals,
    traits,
    ratings,
    tier,
    archetype,
    potential,
    schemeFits,

    developmentHistory: [],

    injuryProneness: injuryBlock.injuryProneness,
    injuryHistory: injuryBlock.injuryHistory,
    currentInjury: injuryBlock.currentInjury,
    injuryStatus: injuryBlock.injuryStatus,

    rosterStatus: "UFA",

    stats,
    contract,

    photo: pickPlayerPhoto(position)
  };
}

export function generateFreeAgentPool(count: number, year: number): PlayerState[] {
  const pool: PlayerState[] = [];

  const entries = Object.entries(POSITION_WEIGHTS) as [Position, number][];
  const totalWeight = entries.reduce((sum, [, w]) => sum + w, 0);

  for (let i = 0; i < count; i++) {
    const roll = Math.random() * totalWeight;
    let cumulative = 0;
    let chosenPos: Position = "WR_X";

    for (const [pos, weight] of entries) {
      cumulative += weight;
      if (roll <= cumulative) {
        chosenPos = pos;
        break;
      }
    }

    pool.push(generateFreeAgent(chosenPos, year));
  }

  return pool;
}