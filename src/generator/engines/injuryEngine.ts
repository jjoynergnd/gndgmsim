// src/generator/engines/injuryEngine.ts

import type { Player } from "./playerGenerator.js";
import type { Position } from "../config/positions.js";

export interface Injury {
  type: string;
  severity: number; // 1–5
  weeksRemaining: number;
}

interface InjuryTemplate {
  type: string;
  minWeeks: number;
  maxWeeks: number;
  baseSeverity: number;
}

const INJURY_TEMPLATES: InjuryTemplate[] = [
  { type: "Hamstring Strain", minWeeks: 1, maxWeeks: 2, baseSeverity: 1 },
  { type: "Ankle Sprain", minWeeks: 1, maxWeeks: 3, baseSeverity: 2 },
  { type: "Shoulder Sprain", minWeeks: 1, maxWeeks: 3, baseSeverity: 2 },
  { type: "Concussion", minWeeks: 1, maxWeeks: 2, baseSeverity: 2 },
  { type: "MCL Sprain", minWeeks: 3, maxWeeks: 6, baseSeverity: 3 },
  { type: "High Ankle Sprain", minWeeks: 3, maxWeeks: 6, baseSeverity: 3 },
  { type: "ACL Tear", minWeeks: 20, maxWeeks: 30, baseSeverity: 5 },
  { type: "Achilles Tear", minWeeks: 25, maxWeeks: 35, baseSeverity: 5 }
];

// Position risk multipliers (relative to base rate)
const POSITION_RISK: Partial<Record<Position, number>> = {
  QB: 0.7,
  HB: 1.3,
  FB: 1.2,
  WR_X: 1.1,
  WR_Z: 1.1,
  WR_SLOT: 1.2,
  TE: 1.2,
  LT: 0.9,
  LG: 0.9,
  C: 0.9,
  RG: 0.9,
  RT: 0.9,
  EDGE: 1.3,
  DE: 1.2,
  DT_NT: 1.3,
  DT_3T: 1.3,
  MLB: 1.3,
  OLB: 1.2,
  CB: 1.1,
  NCB: 1.2,
  FS: 1.0,
  SS: 1.1,
  K: 0.5,
  P: 0.5,
  LS: 0.6,
  KR: 1.3,
  PR: 1.3
};

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickOne<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateInjury(): Injury {
  const template = pickOne(INJURY_TEMPLATES);
  const weeks = randomInt(template.minWeeks, template.maxWeeks);
  return {
    type: template.type,
    severity: template.baseSeverity,
    weeksRemaining: weeks
  };
}

export interface InjuryResult {
  player: Player;
  snapsShareForProgression: number;
}

export function maybeApplyInjury(
  player: Player,
  snapsShare: number,
  season: number,
  week: number
): InjuryResult {
  // If already injured, tick down weeksRemaining and keep them out
  if (player.currentInjury) {
    const updated: Player = { ...player };
    const current = { ...player.currentInjury };
    current.weeksRemaining -= 1;

    if (current.weeksRemaining <= 0) {
      updated.currentInjury = undefined;
      updated.injuryStatus = "Healthy";
    } else {
      updated.currentInjury = current;
      updated.injuryStatus = "Out";
    }

    return {
      player: updated,
      snapsShareForProgression: 0
    };
  }

  // Healthy: compute chance of new injury
  const baseRate = 0.03; // ~3% per game baseline
  const pronenessFactor = player.injuryProneness / 60; // ~0.7–1.5
  const ageFactor = player.age >= 29 ? 1.3 : 1.0;
  const snapFactor = Math.max(0, Math.min(1, snapsShare));
  const positionFactor = POSITION_RISK[player.position] ?? 1.0;

  const injuryChance =
    baseRate * pronenessFactor * ageFactor * snapFactor * positionFactor;

  if (Math.random() < injuryChance) {
    const injury = generateInjury();
    const status: Player["injuryStatus"] =
      injury.weeksRemaining >= 8 ? "IR" : "Out";

    const updated: Player = {
      ...player,
      currentInjury: injury,
      injuryStatus: status,
      injuryHistory: [
        ...player.injuryHistory,
        {
          season,
          week,
          type: injury.type,
          severity: injury.severity,
          weeksOut: injury.weeksRemaining
        }
      ]
    };

    return {
      player: updated,
      snapsShareForProgression: 0
    };
  }

  // No injury this week
  return {
    player,
    snapsShareForProgression: snapFactor
  };
}
