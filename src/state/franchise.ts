// src/state/franchise.ts

// -----------------------------
//  FranchiseMeta
// -----------------------------
export interface FranchiseMeta {
  // Identity
  franchiseId: string;
  saveName: string;
  gmName: string;
  userTeamId: string;

  // Timeline
  currentSeason: number;
  currentPhase: SeasonPhase;

  // Timestamps
  createdAt: number;
  lastSavedAt: number;

  // Settings
  difficulty: "casual" | "sim" | "hardcore";
  userSettings: Record<string, any>;

  // Versioning
  schemaVersion: number;
}

// -----------------------------
//  Season phases (FULL ROADMAP)
// -----------------------------
export type SeasonPhase =
  | "PRESEASON"
  | "REGULAR_SEASON"
  | "POSTSEASON"
  | "OFFSEASON_RE_SIGN"
  | "OFFSEASON_FREE_AGENCY"
  | "OFFSEASON_DRAFT"
  | "OFFSEASON_POST_DRAFT"
  | "OFFSEASON_PRESEASON_SETUP"
  // NEW granular offseason phases for roadmap
  | "OFFSEASON_STAFF"
  | "OFFSEASON_CONTRACTS"
  | "OFFSEASON_FREE_AGENCY_PHASE_1"
  | "OFFSEASON_FREE_AGENCY_PHASE_2"
  | "OFFSEASON_RESET"; // NEW for Option 3

// -----------------------------
//  FranchiseState
// -----------------------------
export interface FranchiseState {
  meta: FranchiseMeta;
  league: LeagueState;
}

// -----------------------------
//  LeagueState
// -----------------------------
export interface LeagueState {
  teams: Record<string, TeamState>;
  freeAgents: PlayerState[];
  draftClasses: Record<number, ProspectState[]>;
  transactions: TransactionLogEntry[];
  schedule: SeasonSchedule;
  standings: LeagueStandings;
  newsFeed: NewsItem[];
  retiredPlayers: PlayerState[];
  history: LeagueHistoryEntry[];
  awards: LeagueAwards;
  settings: LeagueSettings;

  // -----------------------------
  //  USER / GM INFO
  // -----------------------------
  user: {
    gmName: string;
    teamId: string;
    seasonNumber: number;
    jobSecurity: number;

    // UPDATED: reputation is now an object
    reputation: {
      score: number; // 0–1000 scale
      tier: string;  // "Emerging GM", "Respected Executive", etc.
    };

    gmType?: string; // GM archetype id
  };

  // -----------------------------
  //  OFFSEASON PHASE (numeric engine)
  // -----------------------------
  offseason: {
    phase: number; // 1 = staff, 2 = contracts, 3 = FA, 4 = draft, 5 = season prep
  };

  // -----------------------------
  //  GM PROFILE
  // -----------------------------
  gmProfile?: {
    name: string;
    type: string; // archetype id
  };

  // -----------------------------
  //  OWNER PROFILE
  // -----------------------------
  ownerProfile?: {
    name: string;
    type: string;
    patience: number;
    spendingAggression: number;
    involvementLevel: number;
    priorities: {
      wins: number;
      playoffs: number;
      finances: number;
      playerDevelopment: number;
      morale: number;
    };
  };

  // -----------------------------
  //  STAFF + BUDGET (UPDATED)
  // -----------------------------
  staff?: StaffRoles;

  staffBudget: {
    total: number; // from owner JSON
    used: number;  // updated as GM hires staff
  };

  // NEW: Global staff free agent pool
  staffFreeAgents: StaffMember[];
}

// -----------------------------
//  Staff types
// -----------------------------
export interface StaffMember {
  id: string;

  role: string;      // e.g., "HC"
  roleCode: string;  // same as role
  roleName: string;  // "Head Coach"

  firstName: string;
  lastName: string;

  age: number;
  yearsExperience: number;

  // Flexible attribute bag (matches your schema)
  attributes: Record<string, number | string>;

  contract: {
    years: number;
    salary: number; // in dollars
  };
}

// Matches your real roles (Phase 1)
export interface StaffRoles {
  headCoach: StaffMember;
  offensiveCoordinator: StaffMember;
  defensiveCoordinator: StaffMember;
  strengthCoach: StaffMember;
  medicalDirector: StaffMember;
  scoutingDirector: StaffMember;
}

// -----------------------------
//  Placeholder imports
// -----------------------------
export interface TeamState {}
export interface PlayerState {}
export interface ProspectState {}
export interface TransactionLogEntry {}
export interface SeasonSchedule {}
export interface LeagueStandings {}
export interface NewsItem {}
export interface LeagueHistoryEntry {}
export interface LeagueAwards {}
export interface LeagueSettings {}