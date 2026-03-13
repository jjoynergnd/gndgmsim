// src/franchise/createFranchise.ts

import { FranchiseState, FranchiseMeta, LeagueState } from "../state/franchise.js";
import owners from "../data/owners/index.js";
import { generateStaffPool } from "../generator/staff/generateStaffPool.js";
import { getReputationTier } from "../utils/reputation.js";

export function createFranchise(options: {
  franchiseId: string;
  saveName: string;
  gmName: string;
  userTeamId: string;
  difficulty?: "casual" | "sim" | "hardcore";
}): FranchiseState {
  const now = Date.now();

  // -----------------------------------------
  // 1. Load owner profile for the user team
  // -----------------------------------------
  const ownerProfile = owners[options.userTeamId];
  if (!ownerProfile) {
    throw new Error(`Owner profile not found for team: ${options.userTeamId}`);
  }

  // -----------------------------------------
  // 2. Build FranchiseMeta
  // -----------------------------------------
  const meta: FranchiseMeta = {
    franchiseId: options.franchiseId,
    saveName: options.saveName,
    gmName: options.gmName,
    userTeamId: options.userTeamId,

    currentSeason: 1,
    currentPhase: "OFFSEASON_STAFF", // Phase 1 of roadmap

    createdAt: now,
    lastSavedAt: now,

    difficulty: options.difficulty ?? "sim",
    userSettings: {},

    schemaVersion: 1,
  };

  // -----------------------------------------
  // 3. Initialize GM reputation
  // -----------------------------------------
  const startingReputationScore = 400; // "Emerging GM"
  const startingReputationTier = getReputationTier(startingReputationScore);

  // -----------------------------------------
  // 4. Generate staff free agent pool
  // -----------------------------------------
  const staffFreeAgents = generateStaffPool();

  // -----------------------------------------
  // 5. Build LeagueState
  // -----------------------------------------
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

    // USER / GM INFO
    user: {
      gmName: options.gmName,
      teamId: options.userTeamId,
      seasonNumber: 1,
      jobSecurity: 75,
      reputation: {
        score: startingReputationScore,
        tier: startingReputationTier,
      },
      gmType: undefined,
    },

    // OFFSEASON PHASE (numeric engine)
    offseason: {
      phase: 1, // Staff Updates
    },

    // OWNER PROFILE
    ownerProfile: {
      name: ownerProfile.name,
      type: ownerProfile.type,
      patience: ownerProfile.patience,
      spendingAggression: ownerProfile.spendingAggression,
      involvementLevel: ownerProfile.involvementLevel,
      priorities: ownerProfile.priorities,
    },

    // STAFF BUDGET (Phase 1)
    staffBudget: {
      total: ownerProfile.staffBudget.total,
      used: 0,
    },

    // STAFF FREE AGENT POOL
    staffFreeAgents,
  };

  // -----------------------------------------
  // 6. Return the full franchise state
  // -----------------------------------------
  return {
    meta,
    league,
  };
}