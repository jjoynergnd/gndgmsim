// src/generator/helpers/playerStats.ts

export function generatePlayerStats() {
  const empty = {
    gamesPlayed: 0,
    gamesStarted: 0
  };

  return {
    career: { ...empty },
    lastSeason: { ...empty },
    seasonToDate: { ...empty }
  };
}