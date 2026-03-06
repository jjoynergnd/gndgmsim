// src/state/contract.ts

export interface ContractState {
  years: number;
  totalValue: number;
  apy: number;
  signingBonus: number;
  totalGuarantees: number;

  structureType: "balanced" | "frontloaded" | "backloaded";
  contractStyle: "team_friendly" | "player_friendly" | "balanced";

  voidYears: number;
  optionYears: number;
  guaranteedSalary: number;

  riskLevel: "low" | "medium" | "high";
  notes: string;

  isTeamFriendly: boolean;
  isPlayerFriendly: boolean;
  isBalanced: boolean;

  yearBreakdown: {
    year: number;
    salary: number;
    bonusProrated: number;
    capHit: number;
    capSavings: number;
    capSavingsPostJune1: number;
  }[];

  deadMoney: {
    year: number;
    bonus: number;
    salary: number;
    total: number;
  }[];

  postJune1: {
    currentYear: number;
    nextYear: number;
  };

  capSavingsByYear: number[];
  capSavingsPostJune1ByYear: number[];

  cuttableYear: number;
}