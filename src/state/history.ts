// src/state/history.ts

import { LeagueAwards } from "./awards.js";
import { LeagueStandings } from "./standings.js";

export interface LeagueHistoryEntry {
  season: number;
  champion: string;
  awards: LeagueAwards;
  standings: LeagueStandings;
}