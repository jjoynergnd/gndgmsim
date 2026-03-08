// src/generator/freeAgents/generateOffseasonFreeAgents.ts

import type { PlayerState } from "../../state/player.js";
import type { Position } from "../config/positions.js";

import { generateFreeAgent } from "./freeAgentGenerator.js";
import { ROSTER_DISTRIBUTION } from "../config/rosterDistribution.js";

/**
 * Count how many free agents exist per position.
 */
function countFreeAgentsByPosition(freeAgents: PlayerState[]): Record<Position, number> {
  const counts = {} as Record<Position, number>;

  for (const pos of Object.keys(ROSTER_DISTRIBUTION) as Position[]) {
    counts[pos] = 0;
  }

  for (const fa of freeAgents) {
    counts[fa.position] = (counts[fa.position] ?? 0) + 1;
  }

  return counts;
}

/**
 * Determine how many new free agents are needed per position.
 */
function computeNeededCounts(
  currentCounts: Record<Position, number>
): Record<Position, number> {
  const needed = {} as Record<Position, number>;

  for (const pos of Object.keys(ROSTER_DISTRIBUTION) as Position[]) {
    const target = ROSTER_DISTRIBUTION[pos];
    const current = currentCounts[pos] ?? 0;

    needed[pos] = Math.max(0, target - current);
  }

  return needed;
}

/**
 * Generate new free agents to top up the pool.
 */
export function generateOffseasonFreeAgents(
  existingFreeAgents: PlayerState[],
  year: number
): PlayerState[] {
  const currentCounts = countFreeAgentsByPosition(existingFreeAgents);
  const neededCounts = computeNeededCounts(currentCounts);

  const newAgents: PlayerState[] = [];

  for (const pos of Object.keys(neededCounts) as Position[]) {
    const count = neededCounts[pos];

    for (let i = 0; i < count; i++) {
      newAgents.push(generateFreeAgent(pos, year));
    }
  }

  return newAgents;
}