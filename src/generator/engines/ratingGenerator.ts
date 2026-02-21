// src/generator/engines/ratingGenerator.ts

import { pickOne } from "../utils/random.js";
import { roll, clamp } from "./ratingMath.js";
import { RATING_BLUEPRINTS } from "../config/ratingBlueprints.js";
import { POSITION_ARCHETYPES } from "../config/archetypes.js";
import { OVERALL_FORMULAS } from "../config/overallFormulas.js";
import {
  PlayerTier,
  TIER_WEIGHTS,
  TIER_OVR_MODIFIERS
} from "../config/tiers.js";
import type { Position } from "../config/positions.js";

// ------------------------------------------------------
// Weighted tier selection (new scouting-based tiers)
// ------------------------------------------------------
function weightedTier(): PlayerTier {
  const entries = Object.entries(TIER_WEIGHTS);
  const total = entries.reduce((sum, [, w]) => sum + w, 0);

  let r = Math.random() * total;
  for (const [tier, weight] of entries) {
    r -= weight;
    if (r <= 0) return tier as PlayerTier;
  }
  return "solid"; // fallback
}

// ------------------------------------------------------
// Compute attribute-based OVR using position weights
// ------------------------------------------------------
function computeOVR(position: Position, ratings: Record<string, number>, tier: PlayerTier): number {
  const weights = OVERALL_FORMULAS[position];
  let total = 0;
  let weightSum = 0;

  for (const [attr, weight] of Object.entries(weights)) {
    const value = ratings[attr] ?? 60;
    total += value * weight;
    weightSum += weight;
  }

  // Normalize to 0–100 scale
  const rawOVR = total / weightSum;

  // Apply tier modifier (soft influence)
  const modified = rawOVR + TIER_OVR_MODIFIERS[tier];

  // Clamp + round (Option A)
  return clamp(Math.round(modified), 40, 99);
}

// ------------------------------------------------------
// Main rating generator
// ------------------------------------------------------
export function generateRatings(position: Position) {
  const tier = weightedTier();
  const archetype = pickOne(POSITION_ARCHETYPES[position]);
  const blueprint = RATING_BLUEPRINTS[position];

  const ratings: Record<string, number> = {};

  // ------------------------------------------------------
  // 1. Generate base ratings
  // ------------------------------------------------------
  for (const attr of blueprint.attributes) {
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
  // 3. Compute attribute-based OVR (new system)
  // ------------------------------------------------------
  ratings.overall = computeOVR(position, ratings, tier);

  return {
    tier,
    archetype,
    ratings
  };
}
