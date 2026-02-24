// src/generator/engines/developmentCurves.ts

import type { Player } from "./playerGenerator.js";
import type { PotentialProfile } from "./playerPotential.js";

export type SeasonPhase = "PRESEASON" | "REGULAR" | "POSTSEASON" | "OFFSEASON";

export interface AgeCurve {
  growthMultiplier: number;
  regressionMultiplier: number;
}

export function getAgeCurve(age: number): AgeCurve {
  if (age <= 22) {
    return { growthMultiplier: 1.3, regressionMultiplier: 0.2 };
  }
  if (age <= 25) {
    return { growthMultiplier: 1.1, regressionMultiplier: 0.3 };
  }
  if (age <= 28) {
    return { growthMultiplier: 0.7, regressionMultiplier: 0.5 };
  }
  if (age <= 31) {
    return { growthMultiplier: 0.4, regressionMultiplier: 0.8 };
  }
  return { growthMultiplier: 0.2, regressionMultiplier: 1.2 };
}

export function getPhaseMultiplier(phase: SeasonPhase): number {
  switch (phase) {
    case "PRESEASON":
      return 0.4;
    case "REGULAR":
      return 1.0;
    case "POSTSEASON":
      return 0.6;
    case "OFFSEASON":
      return 0.8;
    default:
      return 1.0;
  }
}

export function getTierGrowthMultiplier(tier: Player["tier"]): number {
  switch (tier) {
    case "superstar":
      return 0.6;
    case "star":
      return 0.8;
    case "solid":
      return 1.0;
    case "developmental":
      return 1.3;
    case "depth":
      return 0.9;
    case "fringe":
      return 0.8;
    default:
      return 1.0;
  }
}

export function getPotentialMultiplier(potential: PotentialProfile): number {
  switch (potential.grade) {
    case "A":
      return 1.3;
    case "B":
      return 1.15;
    case "C":
      return 1.0;
    case "D":
      return 0.8;
    case "F":
      return 0.6;
    default:
      return 1.0;
  }
}

export function getSchemeFitMultiplier(avgSchemeScore: number): number {
  if (avgSchemeScore >= 85) return 1.2;
  if (avgSchemeScore >= 70) return 1.05;
  if (avgSchemeScore >= 55) return 1.0;
  if (avgSchemeScore >= 40) return 0.9;
  return 0.75;
}
