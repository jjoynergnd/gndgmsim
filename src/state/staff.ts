// src/state/staff.ts

import { StaffContractState } from "./staffContract.js";
import { StaffCareerEvent } from "./staffHistory.js";

// -----------------------------
// Staff Roles
// -----------------------------
export type StaffRole =
  | "HEAD_COACH"
  | "OFFENSIVE_COORDINATOR"
  | "DEFENSIVE_COORDINATOR"
  | "STRENGTH_COACH"
  | "ATHLETIC_TRAINER"
  | "DIRECTOR_PLAYER_PERSONNEL"
  | "HEAD_SCOUT"
  | "REGIONAL_SCOUT"
  | "DIRECTOR_ANALYTICS"
  | "QUARTERBACK_COACH";

// -----------------------------
// Rating Interfaces (placeholders)
// These will be defined in their own files.
// -----------------------------
export interface HeadCoachRatings { [key: string]: number; }
export interface OffensiveCoordinatorRatings { [key: string]: number; }
export interface DefensiveCoordinatorRatings { [key: string]: number; }
export interface StrengthCoachRatings { [key: string]: number; }
export interface AthleticTrainerRatings { [key: string]: number; }
export interface DirectorPlayerPersonnelRatings { [key: string]: number; }
export interface HeadScoutRatings { [key: string]: number; }
export interface RegionalScoutRatings { [key: string]: number; }
export interface DirectorAnalyticsRatings { [key: string]: number; }
export interface QuarterbackCoachRatings { [key: string]: number; }

// -----------------------------
// StaffState
// -----------------------------
export interface StaffState {
  // Identity
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  yearsExperience: number;

  // Role
  role: StaffRole;
  roleCode: string;
  roleName: string;

  // Ratings (role-specific)
  ratings:
    | HeadCoachRatings
    | OffensiveCoordinatorRatings
    | DefensiveCoordinatorRatings
    | StrengthCoachRatings
    | AthleticTrainerRatings
    | DirectorPlayerPersonnelRatings
    | HeadScoutRatings
    | RegionalScoutRatings
    | DirectorAnalyticsRatings
    | QuarterbackCoachRatings;

  // Scheme profile (optional)
  scheme?: {
    offense?: string;
    defense?: string;
    preference?: string;
  };

  // Traits
  traits: {
    personality: string;
    leadershipStyle: string;
    riskTolerance: string;
  };

  // Contract
  contract: StaffContractState;

  // Career history
  history: StaffCareerEvent[];

  // Media / UI
  photo: string;
}