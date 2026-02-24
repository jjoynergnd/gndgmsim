// src/generator/engines/schemeFitCalculator.ts

import type { Position } from "../config/positions.js";
import {
  OFFENSIVE_SCHEME_PROFILES,
  DEFENSIVE_SCHEME_PROFILES,
  OffensiveScheme,
  DefensiveScheme,
  Scheme
} from "../config/SchemeProfiles.js";

/*
  Scheme Fit Calculation
  ----------------------
  - Computes numeric scheme fit (0–100)
  - Converts numeric score into a UI label
  - Supports both offensive and defensive schemes
  - Uses scheme-specific attribute weights per position
*/

export interface SchemeFitResult {
  score: number;   // 0–100
  label: string;   // "Perfect Fit", "Strong Fit", etc.
}

// ------------------------------------------------------------
// Label thresholds (Option B)
// ------------------------------------------------------------
export function schemeFitLabel(score: number): string {
  if (score >= 90) return "Perfect Fit";
  if (score >= 75) return "Strong Fit";
  if (score >= 60) return "Adequate Fit";
  if (score >= 40) return "Poor Fit";
  return "Mismatch";
}

// ------------------------------------------------------------
// Compute numeric scheme fit for a single scheme
// ------------------------------------------------------------
export function computeSchemeFit(
  scheme: Scheme,
  position: Position,
  ratings: Record<string, number>
): SchemeFitResult {
  // Determine if scheme is offense or defense
  const profile =
    (OFFENSIVE_SCHEME_PROFILES as any)[scheme] ??
    (DEFENSIVE_SCHEME_PROFILES as any)[scheme];

  if (!profile) {
    return { score: 50, label: "Adequate Fit" }; // fallback
  }

  const weights = profile[position];

  // If scheme doesn't define weights for this position, neutral fit
  if (!weights) {
    return { score: 50, label: "Adequate Fit" };
  }

  let total = 0;
  let weightSum = 0;

  for (const [attr, weight] of Object.entries(weights)) {
    const w = weight as number;         // <-- FIX
    const value = ratings[attr] ?? 60;

    total += value * w;                 // <-- FIX
    weightSum += w;                     // <-- FIX
  }

  // Normalize to 0–100
  const raw = weightSum > 0 ? total / weightSum : 50;

  // Clamp
  const score = Math.max(0, Math.min(100, Math.round(raw)));

  return {
    score,
    label: schemeFitLabel(score)
  };
}

// ------------------------------------------------------------
// Compute scheme fits for ALL schemes at once
// ------------------------------------------------------------
export function computeAllSchemeFits(
  position: Position,
  ratings: Record<string, number>
): Record<Scheme, SchemeFitResult> {
  const results: Record<string, SchemeFitResult> = {};

  const allSchemes: Scheme[] = [
    // Offense
    "west_coast",
    "vertical",
    "spread",
    "power_run",
    "zone_run",
    "rpo",
    "play_action",

    // Defense
    "four_three_over",
    "four_three_under",
    "three_four_base",
    "three_four_hybrid",
    "nickel_heavy",
    "man_match",
    "zone_match",
    "blitz_heavy"
  ];

  for (const scheme of allSchemes) {
    results[scheme] = computeSchemeFit(scheme, position, ratings);
  }

  return results as Record<Scheme, SchemeFitResult>;
}
