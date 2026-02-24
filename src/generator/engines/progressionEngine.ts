// src/generator/engines/progressionEngine.ts

import { gaussian } from "../utils/gaussian.js";
import type { Player } from "./playerGenerator.js";
import type { PotentialProfile } from "./playerPotential.js";
import {
  getAgeCurve,
  getPhaseMultiplier,
  getTierGrowthMultiplier,
  getPotentialMultiplier,
  getSchemeFitMultiplier,
  type SeasonPhase
} from "./developmentCurves.js";

export interface ProgressionContext {
  phase: SeasonPhase;
  snapsShare: number;      // 0–1
  coachingQuality: number; // 0.5–1.5
  season: number;
}

const NON_DEVELOPING_ATTRS = new Set(["overall"]);

function averageSchemeScore(player: Player): number {
  const fits = Object.values(player.schemeFits ?? {});
  if (!fits.length) return 60;
  const sum = fits.reduce((acc: number, f: any) => acc + f.score, 0);
  return sum / fits.length;
}

export function progressPlayer(
  player: Player,
  context: ProgressionContext
): Player {
  const potential: PotentialProfile = player.potential;
  const ageCurve = getAgeCurve(player.age);
  const phaseMult = getPhaseMultiplier(context.phase);
  const tierMult = getTierGrowthMultiplier(player.tier);
  const potMult = getPotentialMultiplier(potential);
  const schemeMult = getSchemeFitMultiplier(averageSchemeScore(player));

  const snaps = Math.max(0, Math.min(1, context.snapsShare));
  const coach = Math.max(0.5, Math.min(1.5, context.coachingQuality));

  const growthFactor =
    phaseMult *
    tierMult *
    potMult *
    schemeMult *
    snaps *
    coach *
    ageCurve.growthMultiplier;

  const regressionFactor =
    phaseMult *
    (2 - snaps) *
    ageCurve.regressionMultiplier *
    (player.age >= 29 ? 1.0 : 0.4);

  const newRatings: Record<string, number> = { ...player.ratings };

  let totalDelta = 0;
  let count = 0;

  for (const [attr, value] of Object.entries(player.ratings)) {
    if (NON_DEVELOPING_ATTRS.has(attr)) continue;

    const base = value ?? 60;
    let meanDelta = 0;
    let stdDelta = 0.5 + potential.volatility;

    if (growthFactor > regressionFactor) {
      meanDelta = (growthFactor - regressionFactor) * 0.6;
    } else {
      meanDelta = -(regressionFactor - growthFactor) * 0.6;
    }

    const delta = gaussian(meanDelta, stdDelta);
    const updated = Math.max(40, Math.min(99, Math.round(base + delta)));

    newRatings[attr] = updated;

    totalDelta += updated - base;
    count++;
  }

  const avgDelta = count > 0 ? totalDelta / count : 0;

  const newOverall = Math.max(
    40,
    Math.min(99, Math.round(player.ratings.overall + avgDelta))
  );

  newRatings.overall = newOverall;

  const updatedPlayer: Player = {
    ...player,
    ratings: newRatings,
    developmentHistory: [
      ...player.developmentHistory,
      {
        season: context.season,
        ovrChange: newOverall - player.ratings.overall
      }
    ]
  };

  return updatedPlayer;
}
