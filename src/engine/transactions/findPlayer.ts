// src/engine/transactions/findPlayer.ts

export function findPlayer(roster: any[], playerId: string) {
  const index = roster.findIndex(p => p.id === playerId);

  if (index === -1) {
    return { index: -1, player: null };
  }

  return {
    index,
    player: roster[index]
  };
}
