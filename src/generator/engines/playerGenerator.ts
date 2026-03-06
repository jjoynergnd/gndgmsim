// src/generator/engines/playerGenerator.ts

import { PlayerState, Position } from "../../state/player.js";

import { gaussian } from "../utils/gaussian.js";
import { randInt, pickOne } from "../utils/random.js";

import { PHYSICAL_PROFILES } from "../config/physicalProfiles.js";
import { COLLEGES } from "../config/colleges.js";

import { generateRatings } from "./ratingGenerator.js";
import { computeAllSchemeFits } from "./schemeFitCalculator.js";
import { assignPotential } from "./playerPotential.js";

import { generateBaseContract } from "../contract/contractBase.js";

import { generatePlayerTraits } from "../helpers/playerTraits.js";
import { generatePlayerVitals } from "../helpers/playerVitals.js";
import { generatePlayerStats } from "../helpers/playerStats.js";
import { generatePlayerInjuryBlock } from "../helpers/playerInjury.js";
import { pickPlayerPhoto } from "../helpers/playerPhoto.js";
import { generatePlayerName } from "../helpers/playerName.js";

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

function deriveExperience(age: number): number {
  if (age <= 23) return 0;
  if (age <= 25) return randInt(1, 2);
  if (age <= 28) return randInt(3, 5);
  if (age <= 32) return randInt(6, 9);
  return randInt(10, 12);
}

export function generatePlayer(position: Position, year: number): PlayerState {
  const profile = PHYSICAL_PROFILES[position];

  const height = Math.round(
    clamp(gaussian(profile.heightMean, profile.heightStd), 65, 85)
  );

  const weight = Math.round(
    clamp(gaussian(profile.weightMean, profile.weightStd), 160, 380)
  );

  const age = randInt(21, 34);

  const college = pickOne(COLLEGES) as string;

  const { firstName, lastName, name } = generatePlayerName();

  const ratingProfile = generateRatings(position, age);
  const schemeFits = computeAllSchemeFits(position, ratingProfile.ratings);

  const potential = assignPotential({
    id: "",
    position,
    age,
    height,
    weight,
    college,
    tier: ratingProfile.tier,
    archetype: ratingProfile.archetype,
    ratings: ratingProfile.ratings,
    schemeFits,
    potential: { grade: "C", ceilingBoost: 0, volatility: 0.2 },
    injuryProneness: 0,
    injuryHistory: [],
    currentInjury: null,
    injuryStatus: "Healthy",
    rosterStatus: "Active",
    accruedSeasons: 0,
    workEthic: 0,
    coachability: 0,
    competitiveness: 0,
    developmentHistory: [],
    contract: { years: 1, totalValue: 0, apy: 0, yearBreakdown: [] } as any
  });

  const traits = generatePlayerTraits();

  const vitals = generatePlayerVitals() as {
    handedness: "Left" | "Right";
  };

  const experience = deriveExperience(age);
  const accruedSeasons = experience;

  const injuryBlock = generatePlayerInjuryBlock(position);

  const stats = generatePlayerStats();

  const contract = generateBaseContract({
    position,
    ovr: ratingProfile.ratings.overall,
    age,
    year,
    tier: ratingProfile.tier
  });

  const photo = pickPlayerPhoto(position);

  return {
    id: crypto.randomUUID(),

    name,
    firstName,
    lastName,

    position,
    age,
    height,
    weight,
    college,

    experience,
    accruedSeasons,

    vitals,
    traits,

    ratings: ratingProfile.ratings,
    tier: ratingProfile.tier,
    archetype: ratingProfile.archetype,
    schemeFits,
    potential,

    injuryProneness: injuryBlock.injuryProneness,
    injuryHistory: injuryBlock.injuryHistory,
    currentInjury: injuryBlock.currentInjury,
    injuryStatus: injuryBlock.injuryStatus,

    rosterStatus: "Active",

    stats,
    developmentHistory: [],

    contract: contract as any,
    photo
  };
}
