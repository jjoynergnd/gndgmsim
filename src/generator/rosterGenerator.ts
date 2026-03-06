// src/generator/rosterGenerator.ts

import { generatePlayer } from "./engines/playerGenerator.js";
import type { Position } from "./config/positions.js";
import { ROSTER_DISTRIBUTION } from "./config/rosterDistribution.js";

import type { PlayerState } from "../state/player.js";

export interface TeamRoster {
  teamId: string;
  players: PlayerState[];
}

/**
 * Generates a full roster for a single team.
 */
export function generateTeamRoster(teamId: string, year: number): TeamRoster {
  const players: PlayerState[] = [];

  for (const [position, count] of Object.entries(ROSTER_DISTRIBUTION)) {
    const pos = position as Position;

    for (let i = 0; i < count; i++) {
      const player = generatePlayer(pos, year);
      players.push(player);
    }
  }

  return {
    teamId,
    players
  };
}