// src/generator/leagueGenerator.ts

import { generateTeamRoster } from "./rosterGenerator.js";
import { generateTeamState } from "./teamStateGenerator.js";
import { teams } from "../data/teams.js";

import type { TeamState } from "../state/team.js";

export interface LeagueState {
  teams: Record<string, TeamState>;
}

/**
 * Generates full TeamState objects for all 32 teams.
 */
export function generateLeague(year: number): LeagueState {
  const league: Record<string, TeamState> = {};

  for (const t of teams) {
    const roster = generateTeamRoster(t.id, year);
    const teamState = generateTeamState(t.id, roster.players, year);
    league[t.id] = teamState;
  }

  return { teams: league };
}