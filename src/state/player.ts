// src/state/player.ts

import { ContractState } from "./contract.js";
import { PlayerStats } from "./stats.js";
import { InjuryEvent } from "./injury.js";
import { DevelopmentEvent } from "./development.js";

/*
We import the generator’s authoritative types so the
state model matches the generator exactly.
*/

import { Position } from "../generator/config/positions.js";
import { PlayerTier } from "../generator/config/tiers.js";

// -----------------------------
// Ratings
// -----------------------------
export interface Ratings {
  [key: string]: number;
}

export type Archetype = string;

// -----------------------------
// PlayerState
// -----------------------------
export interface PlayerState {

  // Identity
  id: string;
  name: string;
  firstName: string;
  lastName: string;

  position: Position;

  // Physicals & background
  age: number;
  height: number;
  weight: number;

  college: string;

  experience: number;
  accruedSeasons: number;

  vitals: {
    handedness: "Left" | "Right";
  };

  // Ratings & profile
  ratings: Ratings;
  tier: PlayerTier;
  archetype: Archetype;

  potential: {
    grade: "A" | "B" | "C" | "D" | "F";
    ceilingBoost: number;
    volatility: number;
  };

  schemeFits: Record<string, { score: number; label: string }>;

  developmentHistory: DevelopmentEvent[];

  // Traits
  traits: {
    devTrait: string;
    personality: string;
    lockerRoom: string;
    tags: string[];
    intangibles: string[];
  };

  // Injuries
  injuryProneness: number;

  injuryHistory: InjuryEvent[];

  currentInjury: {
    type: string;
    bodyPart: string;
    severity: number;
    weeksRemaining: number;
  } | null;

  injuryStatus: "Healthy" | "Questionable" | "Out" | "IR";

  // Roster meta
  rosterStatus:
    | "Active"
    | "PracticeSquad"
    | "IR"
    | "Suspended"
    | "UFA"
    | "RFA"
    | "ERFA";

  // Stats
  stats: {
    career: PlayerStats;
    lastSeason: PlayerStats;
    seasonToDate: PlayerStats;
  };

  // Contract
  contract: ContractState;

  // Media / UI
  photo: string;
}
export { PlayerTier, Position };

