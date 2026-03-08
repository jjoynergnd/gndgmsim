// src/franchise/createFranchise.ts

import { FranchiseState, FranchiseMeta, LeagueState } from "../state/franchise.js";

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
    currentPhase: "OFFSEASON_STAFF", // Phase 1 of your offseason flow

    createdAt: now,
    lastSavedAt: now,

    difficulty: options.difficulty ?? "sim",
    userSettings: {},

    schemaVersion: 1,
  };

  const league: LeagueState = {
    teams: {},               
    freeAgents: [],          
    draftClasses: {},        
    transactions: [],
    schedule: { weeks: [] },
    standings: {},
    newsFeed: [],
    retiredPlayers: [],
    history: [],
    awards: {},
    settings: {
      difficulty: meta.difficulty,
      sliders: {},
    },

    // NEW: store the user’s team and GM info
    user: {
      gmName: options.gmName,
      teamId: options.userTeamId,
      seasonNumber: 1,
      jobSecurity: 75,
      reputation: 50,
    },

    offseason: {
      phase: 1, // Staff Updates
    },
  };

  return {
    meta,
    league,
  };
}