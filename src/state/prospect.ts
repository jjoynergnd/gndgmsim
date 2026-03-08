// src/state/prospect.ts

import { Ratings, PlayerTier, Archetype } from "./player.js";
import { ProspectStats } from "./prospectStats.js";
import type { Position } from "../generator/config/positions.js";

// ---------------------------------------------------------
// ProspectState — Full Draft Prospect Schema (Option A)
// ---------------------------------------------------------

export interface ProspectState {
  // Identity
  id: string;
  name: string;
  position: Position; // FULL PlayerState positions

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

  // ---------------------------------------------------------
  // ⭐ NEW: Personality sliders
  // ---------------------------------------------------------
  personalityProfile: {
    workEthic: number;        // 0–100
    leadership: number;       // 0–100
    discipline: number;       // 0–100
    competitiveness: number;  // 0–100
    ego: number;              // 0–100
  };

  // ---------------------------------------------------------
  // ⭐ NEW: Development curve
  // ---------------------------------------------------------
  development: {
    curve: "fast" | "normal" | "slow";
    peakAge: number;
    regressionAge: number;
    boomBustFactor: number; // 0–1
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

  // ---------------------------------------------------------
  // ⭐ NEW: Production context
  // ---------------------------------------------------------
  collegeContext: {
    conference: string;
    teamStrength: number;        // 0–100
    strengthOfSchedule: number;  // 0–100
    supportingCast: number;      // 0–100
  };

  // Medical flags
  medical: {
    durabilityGrade: "A" | "B" | "C" | "D" | "F";
    redFlags: string[];
  };

  // ---------------------------------------------------------
  // ⭐ NEW: Injury risk profile
  // ---------------------------------------------------------
  injuryRisk: {
    durability: number;     // 0–100
    recovery: number;       // 0–100
    longTermRisk: number;   // 0–1
  };

  // ---------------------------------------------------------
  // ⭐ NEW: Boom/bust probabilities
  // ---------------------------------------------------------
  risk: {
    bustProbability: number; // 0–1
    boomProbability: number; // 0–1
  };

  // ---------------------------------------------------------
  // ⭐ NEW: Background / story hooks
  // ---------------------------------------------------------
  background: {
    hometown: string;
    recruitingStars: number;     // 1–5
    formerPosition: string | null;
    walkOn: boolean;
  };

  // ---------------------------------------------------------
  // ⭐ NEW: Draft story tags
  // ---------------------------------------------------------
  storyTags: string[];

  // College stats
  collegeStats: ProspectStats;

  // Media / UI
  photo: string;
}