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

// Season phases
export type SeasonPhase =
  | "PRESEASON"
  | "REGULAR_SEASON"
  | "POSTSEASON"
  | "OFFSEASON_RE_SIGN"
  | "OFFSEASON_FREE_AGENCY"
  | "OFFSEASON_DRAFT"
  | "OFFSEASON_POST_DRAFT"
  | "OFFSEASON_PRESEASON_SETUP";

// -----------------------------
//  FranchiseState
// -----------------------------
export interface FranchiseState {
  meta: FranchiseMeta;
  league: LeagueState;
}

// -----------------------------
//  LeagueState (imported later)
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
}

// -----------------------------
//  Placeholder imports
//  (These will be defined in their own files)
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