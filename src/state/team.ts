// src/state/team.ts

import { PlayerState } from "./player.js";
import { StaffState } from "./staff.js";
import { DraftPick } from "./draft.js";
import { TransactionLogEntry } from "./transactions.js";
import { TeamStats } from "./stats.js";
import { OwnerProfile } from "./owner.js";

// -----------------------------
// TeamState
// -----------------------------
export interface TeamState {
  // Identity
  teamId: string;
  teamName: string;
  city: string;
  conference: "AFC" | "NFC";
  division: string;

  // Roster & staff
  players: PlayerState[];
  staff: StaffState[];

  // Cap
  cap: CapTable;

  // Scheme
  scheme: {
    offense: string;
    defense: string;
    style?: string;
  };

  // Depth chart
  depthChart: Record<string, string[]>; // position → playerIds

  // Performance
  record: {
    wins: number;
    losses: number;
    ties: number;
  };

  stats: {
    seasonToDate: TeamStats;
    lastSeason: TeamStats;
  };

  // Draft capital
  draftPicks: DraftPick[];

  // Transactions
  transactions: TransactionLogEntry[];

  // Team needs
  teamNeeds: string[];

  // Salary summary
  salarySummary: {
    totalCapHit: number;
    totalDeadMoney: number;
    capSpace: number;
  };

  // Injury summary
  injuryReport: {
    out: string[];
    questionable: string[];
    ir: string[];
  };

  // Coaching modifiers (future)
  coachingModifiers: {
    offense: number;
    defense: number;
    development: number;
  };

  // Owner profile (future)
  owner: OwnerProfile;

  // Media / sentiment
  media: {
    sentimentScore: number;
  };
}

// -----------------------------
// Supporting Types
// -----------------------------
export interface CapTable {
  year: number;
  capLimit: number;
  totalCapHit: number;
  totalDeadMoney: number;
  capSpace: number;

  // Optional: per-player cap entries
  entries: CapEntry[];
}

export interface CapEntry {
  playerId: string;
  capHit: number;
  deadMoney: number;
  savings: number;
}