// src/state/standings.ts

export interface LeagueStandings {
  [teamId: string]: {
    wins: number;
    losses: number;
    ties: number;
    pointsFor: number;
    pointsAgainst: number;
  };
}