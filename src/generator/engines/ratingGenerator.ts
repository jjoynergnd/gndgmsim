// src/generator/engines/ratingGenerator.ts

import { pickOne } from "../utils/random.js";
import { roll, clamp } from "./ratingMath.js";
import { RATING_BLUEPRINTS } from "../config/ratingBlueprints.js";
import { POSITION_ARCHETYPES } from "../config/archetypes.js";
import { OVERALL_FORMULAS } from "../config/overallFormulas.js";
import {
  PlayerTier,
  TIER_OVR_MODIFIERS
} from "../config/tiers.js";
import { ATHLETIC_CAPS } from "../config/athleticCaps.js";
import type { Position } from "../config/positions.js";

// ------------------------------------------------------
// Compute raw OVR (before tier modifier)
// ------------------------------------------------------
function computeRawOVR(position: Position, ratings: Record<string, number>): number {
  const weights = OVERALL_FORMULAS[position];
  let total = 0;
  let weightSum = 0;

  for (const [attr, weight] of Object.entries(weights)) {
    const w = weight as number;
    const value = ratings[attr] ?? 60;
    total += value * w;
    weightSum += w;
  }

  return total / weightSum;
}

// ------------------------------------------------------
// Tier assignment based on raw OVR + developmental logic
// ------------------------------------------------------
function assignTierFromOVR(
  rawOVR: number,
  ratings: Record<string, number>,
  age: number
): PlayerTier {

  // --- Developmental logic ---
  const athleticAvg =
    ((ratings.speed ?? 60) +
      (ratings.acceleration ?? 60) +
      (ratings.agility ?? 60)) / 3;

  const technicalAvg =
    ((ratings.awareness ?? 60) +
      (ratings.blockShed ?? 60) +
      (ratings.powerMoves ?? 60) +
      (ratings.finesseMoves ?? 60) +
      (ratings.throwAccuracyShort ?? 60)) / 5;

  const isDevelopmental =
    age <= 25 &&          // NEW: age cap
    rawOVR < 75 &&        // NEW: OVR ceiling
    athleticAvg >= 80 &&
    technicalAvg <= 65;

  if (isDevelopmental) return "developmental";

  // --- OVR-driven tiers ---
  if (rawOVR >= 90) return "superstar";
  if (rawOVR >= 80) return "star";
  if (rawOVR >= 70) return "solid";
  if (rawOVR >= 60) return "depth";
  return "fringe";
}

// ------------------------------------------------------
// Main rating generator
// ------------------------------------------------------
export function generateRatings(position: Position, age: number) {
  const archetype = pickOne(POSITION_ARCHETYPES[position]);
  const blueprint = RATING_BLUEPRINTS[position];
  const athletic = ATHLETIC_CAPS[position];

  const ratings: Record<string, number> = {};

  // ------------------------------------------------------
  // 1. Generate base ratings (with athletic caps)
  // ------------------------------------------------------
  for (const attr of blueprint.attributes) {
    // Athletic attributes override blueprint defaults
    if (athletic[attr as keyof typeof athletic]) {
      const cap = athletic[attr as keyof typeof athletic];
      ratings[attr] = roll(cap.mean, cap.std);
      continue;
    }

    // Non-athletic attributes use blueprint or fallback
    const base = blueprint.base[attr] ?? { mean: 65, std: 8 };
    ratings[attr] = roll(base.mean, base.std);
  }

  // ------------------------------------------------------
  // 2. Apply archetype modifiers
  // ------------------------------------------------------
  const mods = blueprint.archetypeMods[archetype] ?? {};
  for (const [attr, mod] of Object.entries(mods)) {
    ratings[attr] = clamp((ratings[attr] ?? 60) + mod);
  }

  // ------------------------------------------------------
  // 3. Compute raw OVR (before tier)
  // ------------------------------------------------------
  const rawOVR = computeRawOVR(position, ratings);

  // ------------------------------------------------------
  // 4. Assign tier based on raw OVR + age
  // ------------------------------------------------------
  const tier = assignTierFromOVR(rawOVR, ratings, age);

  // ------------------------------------------------------
  // 5. Apply tier modifier → final OVR
  // ------------------------------------------------------
  const finalOVR = clamp(
    Math.round(rawOVR + TIER_OVR_MODIFIERS[tier]),
    40,
    99
  );

  ratings.overall = finalOVR;

  return {
    tier,
    archetype,
    ratings
  };
}
