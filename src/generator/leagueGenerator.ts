// src/generator/leagueGenerator.ts

import { teams } from "../data/teams.js";

import { generateTeamRoster } from "./rosterGenerator.js";
import { generateTeamState } from "./teamStateGenerator.js";
import { getLeagueCap } from "./cap/leagueCap.js";

import { generateInitialFreeAgents } from "./freeAgents/generateInitialFreeAgents.js";

import type { TeamState } from "../state/team.js";
import type { PlayerState } from "../state/player.js";

export interface LeagueState {
  teams: Record<string, TeamState>;
  freeAgents: PlayerState[];
  draftClasses: Record<number, any[]>;      // to be replaced with ProspectState[]
  transactions: any[];                      // to be replaced with TransactionLogEntry[]
  schedule: any;                            // to be replaced with SeasonSchedule
  standings: any;                           // to be replaced with LeagueStandings
  newsFeed: any[];                          // to be replaced with NewsItem[]
  retiredPlayers: PlayerState[];
  history: any[];                           // to be replaced with LeagueHistoryEntry[]
  awards: any;                              // to be replaced with LeagueAwards
  settings: {
    currentYear: number;
    salaryCap: number;
  };
}

/**
 * Generate full LeagueState for a given year.
 */
export function generateLeague(year: number): LeagueState {
  const leagueTeams: Record<string, TeamState> = {};

  for (const t of teams) {
    const roster = generateTeamRoster(t.id, year);
    const teamState = generateTeamState(t.id, roster.players, year);
    leagueTeams[t.id] = teamState;
  }

  const salaryCap = getLeagueCap(year);

  const leagueState: LeagueState = {
    teams: leagueTeams,

    freeAgents: generateInitialFreeAgents(year),

    draftClasses: {},
    transactions: [],

    schedule: {
      year,
      weeks: []
    },

    standings: {
      year,
      conferences: {
        AFC: [],
        NFC: []
      }
    },

    newsFeed: [],
    retiredPlayers: [],
    history: [],

    awards: {
      year,
      leagueAwards: [],
      teamAwards: {}
    },

    settings: {
      currentYear: year,
      salaryCap
    }
  };

  return leagueState;
}