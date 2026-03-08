// src/engine/offseason/offseasonEngine.ts

import type { LeagueState } from "../../generator/leagueGenerator.js";
import { generateOffseasonFreeAgents } from "../../generator/freeAgents/generateOffseasonFreeAgents.js";

/**
 * Runs the offseason top-up logic and returns the updated league state.
 */
export function runOffseason(leagueState: LeagueState): LeagueState {
  const year = leagueState.settings.currentYear;

  // Generate missing free agents
  const newFAs = generateOffseasonFreeAgents(leagueState.freeAgents, year);

  // Add them to the pool
  leagueState.freeAgents.push(...newFAs);

  return leagueState;
}