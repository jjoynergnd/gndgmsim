// src/engine/transactions/cutPlayer.ts

import { findPlayer } from "./findPlayer.js";

export function cutPlayer(roster: any[], playerId: string) {
  const { index, player } = findPlayer(roster, playerId);

  if (index === -1) {
    return {
      updatedRoster: roster,
      removedPlayer: null,
      error: `Player with id ${playerId} not found`
    };
  }

  const updatedRoster = [
    ...roster.slice(0, index),
    ...roster.slice(index + 1)
  ];

  return {
    updatedRoster,
    removedPlayer: player,
    error: null
  };
}

