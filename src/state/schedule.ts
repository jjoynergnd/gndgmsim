// src/state/schedule.ts

export interface Game {
  home: string;
  away: string;
  homeScore?: number;
  awayScore?: number;
  played: boolean;
}

export interface WeekSchedule {
  week: number;
  games: Game[];
}

export interface SeasonSchedule {
  weeks: WeekSchedule[];
}