// src/generator/engines/seasonProgression.ts

import type { Player } from "./playerGenerator.js";
import { progressPlayer, type ProgressionContext } from "./progressionEngine.js";
import type { SeasonPhase } from "./developmentCurves.js";
import { maybeApplyInjury } from "./injuryEngine.js";

export interface TeamContext {
  coachingQuality: number; // 0.5–1.5
}

export interface PlayerUsage {
  playerId: string;
  snapsShare: number; // 0–1
}

// Existing phase-based progression (no weekly detail, no injuries)
export function runPhaseProgression(
  players: Player[],
  phase: SeasonPhase,
  teamContext: TeamContext,
  usage: PlayerUsage[],
  season: number
): Player[] {
  const usageMap = new Map<string, number>();
  for (const u of usage) {
    usageMap.set(u.playerId, Math.max(0, Math.min(1, u.snapsShare)));
  }

  return players.map((p) => {
    const snapsShare = usageMap.get(p.id) ?? defaultSnapsForPhase(phase, p.tier);

    const ctx: ProgressionContext = {
      phase,
      snapsShare,
      coachingQuality: teamContext.coachingQuality,
      season
    };
    return progressPlayer(p, ctx);
  });
}

// NEW: weekly progression with injuries
export function runWeeklyProgression(
  players: Player[],
  teamContext: TeamContext,
  usage: PlayerUsage[],
  season: number,
  week: number
): Player[] {
  const usageMap = new Map<string, number>();
  for (const u of usage) {
    usageMap.set(u.playerId, Math.max(0, Math.min(1, u.snapsShare)));
  }

  return players.map((p) => {
    const rawSnapsShare = usageMap.get(p.id) ?? defaultWeeklySnapsForTier(p.tier);

    // Apply injuries first (may zero out snaps)
    const injuryResult = maybeApplyInjury(p, rawSnapsShare, season, week);
    const injuredPlayer = injuryResult.player;
    const snapsShareForProgression = injuryResult.snapsShareForProgression;

    const ctx: ProgressionContext = {
      phase: "REGULAR",
      snapsShare: snapsShareForProgression,
      coachingQuality: teamContext.coachingQuality,
      season
    };

    return progressPlayer(injuredPlayer, ctx);
  });
}

function defaultSnapsForPhase(phase: SeasonPhase, tier: Player["tier"]): number {
  if (phase === "PRESEASON") {
    if (tier === "superstar" || tier === "star") return 0.3;
    if (tier === "solid") return 0.5;
    return 0.7;
  }
  if (phase === "REGULAR") {
    if (tier === "superstar" || tier === "star") return 0.9;
    if (tier === "solid") return 0.75;
    if (tier === "depth") return 0.4;
    return 0.2;
  }
  if (phase === "POSTSEASON") {
    if (tier === "superstar" || tier === "star") return 0.95;
    if (tier === "solid") return 0.8;
    return 0.2;
  }
  return 0.0;
}

function defaultWeeklySnapsForTier(tier: Player["tier"]): number {
  if (tier === "superstar" || tier === "star") return 0.9;
  if (tier === "solid") return 0.75;
  if (tier === "developmental") return 0.4;
  if (tier === "depth") return 0.25;
  return 0.15;
}

export function advanceOffseasonAges(players: Player[]): Player[] {
  return players.map((p) => ({
    ...p,
    age: p.age + 1,
    accruedSeasons: (p.accruedSeasons ?? 0) + 1
  }));
}
