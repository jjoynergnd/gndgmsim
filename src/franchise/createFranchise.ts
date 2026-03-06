// src/franchise/createFranchise.ts

import { FranchiseState } from "../state/franchise.js";
import { FranchiseMeta } from "../state/franchise.js";
import { LeagueState } from "../state/franchise.js";

export function createFranchise(options: {
  franchiseId: string;
  saveName: string;
  gmName: string;
  userTeamId: string;
  difficulty?: "casual" | "sim" | "hardcore";
}): FranchiseState {
  const now = Date.now();

  const meta: FranchiseMeta = {
    franchiseId: options.franchiseId,
    saveName: options.saveName,
    gmName: options.gmName,
    userTeamId: options.userTeamId,

    currentSeason: 1,
    currentPhase: "OFFSEASON_RE_SIGN",

    createdAt: now,
    lastSavedAt: now,

    difficulty: options.difficulty ?? "sim",
    userSettings: {},

    schemaVersion: 1,
  };

  const league: LeagueState = {
    teams: {},               // populated later by team generator
    freeAgents: [],          // populated later by player generator
    draftClasses: {},        // populated later by draft generator
    transactions: [],
    schedule: { weeks: [] }, // populated later by schedule generator
    standings: {},           // populated later by standings initializer
    newsFeed: [],
    retiredPlayers: [],
    history: [],
    awards: {},
    settings: {
      difficulty: meta.difficulty,
      sliders: {},
    },
  };

  return {
    meta,
    league,
  };
}