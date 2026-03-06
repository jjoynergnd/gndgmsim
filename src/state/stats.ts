// src/state/stats.ts

export interface PlayerStats {
  gamesPlayed: number;
  gamesStarted: number;

  passYards?: number;
  passTD?: number;
  passINT?: number;
  completions?: number;
  attempts?: number;

  rushYards?: number;
  rushTD?: number;
  carries?: number;

  receptions?: number;
  recYards?: number;
  recTD?: number;

  tackles?: number;
  sacks?: number;
  interceptions?: number;

  forcedFumbles?: number;

  returnYards?: number;
  returnTD?: number;
}

export interface TeamStats {
  pointsFor?: number;
  pointsAgainst?: number;
  yardsFor?: number;
  yardsAgainst?: number;
  turnovers?: number;
  takeaways?: number;
}