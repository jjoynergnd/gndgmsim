// src/generator/engines/playerGenerator.ts

import { gaussian } from "../utils/gaussian.js";
import { randInt, pickOne } from "../utils/random.js";
import { PHYSICAL_PROFILES } from "../config/physicalProfiles.js";
import type { Position } from "../config/positions.js";
import { generateRatings } from "./ratingGenerator.js";
import { computeAllSchemeFits } from "./schemeFitCalculator.js";
import { assignPotential } from "./playerPotential.js";
import type { PotentialProfile } from "./playerPotential.js";
import { COLLEGES } from "../config/colleges.js";

import { generateBaseContract } from "../contract/contractBase.js";
import type { Contract } from "../contract/contractBase.js";

export interface Player {
  id: string;
  position: Position;
  age: number;
  height: number;
  weight: number;
  college: string;

  injuryProneness: number;
  injuryHistory: Array<{
    season: number;
    week: number;
    type: string;
    severity: number;
    weeksOut: number;
  }>;
  currentInjury?: {
    type: string;
    severity: number;
    weeksRemaining: number;
  };
  injuryStatus: "Healthy" | "Out" | "IR";

  rosterStatus: "Active" | "PracticeSquad" | "InjuredReserve" | "Suspended" | "FreeAgent";

  accruedSeasons: number;

  workEthic: number;
  coachability: number;
  competitiveness: number;

  tier: string;
  archetype: string;

  ratings: Record<string, number>;
  schemeFits: Record<string, any>;

  potential: PotentialProfile;

  developmentHistory: Array<{
    season: number;
    ovrChange: number;
    notes?: string;
  }>;

  contract: Contract;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function deriveAccruedSeasons(age: number): number {
  if (age <= 23) return 0;
  if (age <= 25) return randInt(1, 2);
  if (age <= 28) return randInt(3, 5);
  if (age <= 32) return randInt(6, 9);
  return randInt(10, 12);
}

export function generatePlayer(position: Position, year: number): Player {
  const profile = PHYSICAL_PROFILES[position];

  const height = Math.round(clamp(gaussian(profile.heightMean, profile.heightStd), 65, 85));
  const weight = Math.round(clamp(gaussian(profile.weightMean, profile.weightStd), 160, 380));
  const age = randInt(21, 34);
  const college = pickOne(COLLEGES);

  const baseInjury = randInt(40, 90);
  const positionRiskAdjustments: Partial<Record<Position, number>> = {
    QB: -10, HB: +10, FB: +8,
    WR_X: +5, WR_Z: +5, WR_SLOT: +7,
    TE: +6,
    LT: -4, LG: -4, C: -4, RG: -4, RT: -4,
    EDGE: +8, DE: +6, DT_NT: +8, DT_3T: +8,
    MLB: +8, OLB: +6,
    CB: +4, NCB: +6, FS: +3, SS: +4,
    K: -15, P: -15, LS: -10,
    KR: +8, PR: +8
  };

  const injuryProneness = clamp(
    baseInjury + (positionRiskAdjustments[position] ?? 0),
    20,
    99
  );

  const workEthic = randInt(40, 95);
  const coachability = randInt(40, 95);
  const competitiveness = randInt(40, 95);

  const footballProfile = generateRatings(position, age);
  const schemeFits = computeAllSchemeFits(position, footballProfile.ratings);

  const placeholderPotential: PotentialProfile = {
    grade: "C",
    ceilingBoost: 0,
    volatility: 0.2
  };

  const accruedSeasons = deriveAccruedSeasons(age);

  const potential = assignPotential({
    id: "",
    position,
    age,
    height,
    weight,
    college,
    tier: footballProfile.tier,
    archetype: footballProfile.archetype,
    ratings: footballProfile.ratings,
    schemeFits,
    potential: placeholderPotential,
    injuryProneness,
    injuryHistory: [],
    currentInjury: undefined,
    injuryStatus: "Healthy",
    rosterStatus: "Active",
    accruedSeasons,
    workEthic,
    coachability,
    competitiveness,
    developmentHistory: [],
    contract: {
      years: 1,
      totalValue: 0,
      apy: 0,
      yearBreakdown: []
    }
  });

  const contractInput = {
    position,
    ovr: footballProfile.ratings.overall,
    age,
    year
  };

  console.log("DEBUG FROM PLAYER GENERATOR:", contractInput);

  const contract = generateBaseContract(contractInput);


  return {
    id: crypto.randomUUID(),
    position,
    age,
    height,
    weight,
    college,
    injuryProneness,
    injuryHistory: [],
    currentInjury: undefined,
    injuryStatus: "Healthy",
    rosterStatus: "Active",
    accruedSeasons,
    workEthic,
    coachability,
    competitiveness,
    tier: footballProfile.tier,
    archetype: footballProfile.archetype,
    ratings: footballProfile.ratings,
    schemeFits,
    potential,
    developmentHistory: [],
    contract
  };
}
