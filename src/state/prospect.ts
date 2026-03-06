// src/state/prospect.ts

import { Ratings } from "./player.js";
import { PlayerTier, Archetype } from "./player.js";
import { ProspectStats } from "./prospectStats.js";

// -----------------------------
// ProspectState
// -----------------------------
export interface ProspectState {
  // Identity
  id: string;
  name: string;
  position: Position;

  // Physicals
  age: number;
  height: number;
  weight: number;
  college: string;

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

  traits: {
    devTrait: string;
    personality: string;
    lockerRoom: string;
    tags: string[];
    intangibles: string[];
  };

  // Combine
  combine?: {
    fortyTime?: number;
    benchReps?: number;
    verticalJump?: number;
    broadJump?: number;
    shuttle?: number;
    threeCone?: number;
  };

  // Draft metadata
  draft: {
    projectedRound: number;
    projectedPick: number;
    bigBoardRank: number;
    positionalRank: number;
    strengths: string[];
    weaknesses: string[];
    scoutingReport: string;
  };

  // Medical flags
  medical: {
    durabilityGrade: "A" | "B" | "C" | "D" | "F";
    redFlags: string[];
  };

  // College stats
  collegeStats: ProspectStats;

  // Media / UI
  photo: string;
}

// -----------------------------
// Position (shared with PlayerState)
// -----------------------------
export type Position =
  | "QB" | "RB" | "WR" | "TE" | "OL"
  | "DL" | "EDGE" | "LB" | "CB" | "S"
  | "K" | "P" | "LS";