// src/generator/contract/contractBase.ts

import { POSITION_BASE_SALARY } from "./positionBaseSalaries.js";
import { POSITIONS } from "../config/positions.js";
import { SALARY_CURVES, scaleCurve } from "../config/contractCurves.js";
import type { Position } from "../config/positions.js";

// ------------------------------------------------------------
// Core Contract Types
// ------------------------------------------------------------
export interface ContractYearBreakdown {
  year: number;
  salary: number;
  bonusProrated: number;
  capHit: number;

  capSavings: number;
  capSavingsPostJune1: number;
}

export interface DeadMoneyYear {
  year: number;
  bonus: number;
  salary: number;
  total: number;
}

export interface PostJune1DeadMoney {
  currentYear: number;
  nextYear: number;
}

export interface Contract {
  years: number;
  totalValue: number;
  apy: number;
  signingBonus: number;
  totalGuarantees: number;
  structureType: string;
  yearBreakdown: ContractYearBreakdown[];

  contractStyle: "balanced" | "team_friendly" | "player_friendly";
  voidYears: number;
  optionYears: number;
  guaranteedSalary: number;
  riskLevel: "low" | "medium" | "high";
  notes: string;

  isTeamFriendly: boolean;
  isPlayerFriendly: boolean;
  isBalanced: boolean;

  deadMoney: DeadMoneyYear[];
  postJune1: PostJune1DeadMoney;

  capSavingsByYear: number[];
  capSavingsPostJune1ByYear: number[];
  cuttableYear: number | null;
}

// ------------------------------------------------------------
// Shared Types for Ops Modules
// ------------------------------------------------------------
export interface ExtensionPlan {
  addedYears: number;
  newAPY: number;
  structureType: "frontloaded" | "balanced" | "backloaded";
  startYear: number;
}

export interface RestructurePlan {
  effectiveYear: number;
  convertAmount: number;
  useVoidYear: boolean;
}

export interface RestructureMetadata {
  effectiveYear: number;
  convertedAmount: number;
  useVoidYear: boolean;
  newBonusProrationYears: number;
}

export interface OptionCPlan {
  extension?: ExtensionPlan | null;
  restructure?: RestructurePlan | null;
}

export interface OptionCMetadata {
  didExtend: boolean;
  didRestructure: boolean;
  extensionMetadata?: any;
  restructureMetadata?: any;
}

// ------------------------------------------------------------
// Utility: Weighted Random Pick
// ------------------------------------------------------------
function weightedPick<T extends { weight: number }>(items: T[]): T {
  const total = items.reduce((s, i) => s + i.weight, 0);
  let r = Math.random() * total;

  for (const item of items) {
    if (r < item.weight) return item;
    r -= item.weight;
  }
  return items[items.length - 1];
}

// ------------------------------------------------------------
// Tier-Driven Deal Type Logic
// ------------------------------------------------------------
const TIER_WEIGHTS: Record<
  string,
  { type: "team_friendly" | "balanced" | "player_friendly"; weight: number }[]
> = {
  superstar: [
    { type: "team_friendly", weight: 1 },
    { type: "balanced", weight: 3 },
    { type: "player_friendly", weight: 6 },
  ],
  star: [
    { type: "team_friendly", weight: 2 },
    { type: "balanced", weight: 4 },
    { type: "player_friendly", weight: 4 },
  ],
  solid: [
    { type: "team_friendly", weight: 2.5 },
    { type: "balanced", weight: 5 },
    { type: "player_friendly", weight: 2.5 },
  ],
  developmental: [
    { type: "team_friendly", weight: 4 },
    { type: "balanced", weight: 5 },
    { type: "player_friendly", weight: 1 },
  ],
  depth: [
    { type: "team_friendly", weight: 5 },
    { type: "balanced", weight: 4.5 },
    { type: "player_friendly", weight: 0.5 },
  ],
  fringe: [
    { type: "team_friendly", weight: 6 },
    { type: "balanced", weight: 4 },
    { type: "player_friendly", weight: 0 },
  ],
};

const DEAL_TYPE_CONFIG = {
  team_friendly: {
    bonusPct: 0.10,
    curve: "backloaded" as const,
  },
  balanced: {
    bonusPct: 0.20,
    curve: "balanced" as const,
  },
  player_friendly: {
    bonusPct: 0.35,
    curve: "frontloaded" as const,
  },
};

function pickDealTypeByTier(tier: string): "team_friendly" | "balanced" | "player_friendly" {
  const weights = TIER_WEIGHTS[tier] ?? TIER_WEIGHTS["solid"];
  return weightedPick(weights).type;
}

// ------------------------------------------------------------
// Salary Factor Helpers
// ------------------------------------------------------------
function getOVRFactor(ovr: number): number {
  if (ovr >= 90) return 15.0;
  if (ovr >= 85) return 10.0;
  if (ovr >= 80) return 8.0;
  if (ovr >= 75) return 6.0;
  if (ovr >= 70) return 3.0;
  if (ovr >= 65) return 1.5;
  return 0.8;
}

function getAgeFactor(age: number): number {
  if (age >= 25 && age <= 28) return 3.0;
  if (age >= 22 && age <= 24) return 1.0;
  if (age >= 29 && age <= 31) return 1.2;
  return 0.8;
}

function getPositionFactor(position: Position): number {
  const family = POSITIONS[position].family;

  switch (family) {
    case "QB": return 1.0;
    case "WR": return 1.0;
    case "RB": return 0.4;
    case "TE": return 0.8;
    case "OL": return 0.9;
    case "DL": return 1.0;
    case "LB": return 0.8;
    case "DB": return 0.9;
    case "ST": return 0.3;
    default: return 1.0;
  }
}

// ------------------------------------------------------------
// Contract Length Logic
// ------------------------------------------------------------
function getExpectedLength(age: number, ovr: number): number {
  let expected = 1;

  if (age >= 21 && age <= 24) expected = 5;
  else if (age >= 25 && age <= 27) expected = 4;
  else if (age >= 28 && age <= 30) expected = 3;
  else if (age >= 31 && age <= 33) expected = 2;
  else expected = 1;

  if (ovr >= 90) expected += 1;
  if (ovr < 75) expected -= 1;

  return Math.max(1, expected);
}

function applyWeightedVariation(expected: number): number {
  const options = [
    { years: expected - 1, weight: 2 },
    { years: expected,     weight: 4 },
    { years: expected + 1, weight: 2 },
  ];

  const picked = weightedPick(options).years;
  return Math.max(1, picked);
}

function applyHardConstraints(age: number, ovr: number, years: number): number {
  let minYears = 1;
  let maxYears = Math.max(1, 36 - age);

  if (ovr >= 90 && age <= 27) minYears = 4;
  if (age >= 32) maxYears = Math.min(maxYears, 2);

  return Math.min(maxYears, Math.max(minYears, years));
}

// ------------------------------------------------------------
// Dead Money Computation (Shared Utility)
// ------------------------------------------------------------
export function computeDeadMoney(
  yearBreakdown: ContractYearBreakdown[],
  guaranteedSalary: number,
  signingBonus: number
): { deadMoney: DeadMoneyYear[]; postJune1: PostJune1DeadMoney } {
  const years = yearBreakdown.length;
  const bonusProrated = Math.round(signingBonus / years);

  const deadMoney: DeadMoneyYear[] = [];

  for (let i = 0; i < years; i++) {
    const remainingBonus = bonusProrated * (years - i);
    const guaranteedForYear = i === 0 ? guaranteedSalary - signingBonus : 0;

    deadMoney.push({
      year: yearBreakdown[i].year,
      bonus: remainingBonus,
      salary: guaranteedForYear,
      total: remainingBonus + guaranteedForYear,
    });
  }

  const postJune1 = {
    currentYear: bonusProrated + (guaranteedSalary - signingBonus),
    nextYear: signingBonus - bonusProrated,
  };

  return { deadMoney, postJune1 };
}

// ------------------------------------------------------------
// Base Contract Generator
// ------------------------------------------------------------
export function generateBaseContract(player: {
  position: Position;
  ovr: number;
  age: number;
  year: number;
  tier: string;
}): Contract {
  const family = POSITIONS[player.position].family;
  const base = POSITION_BASE_SALARY[family] ?? 600_000;

  const ovrFactor = getOVRFactor(player.ovr);
  const ageFactor = getAgeFactor(player.age);
  const posFactor = getPositionFactor(player.position);

  const baseCapHit = Math.round(base * ovrFactor * ageFactor * posFactor);

  const expected = getExpectedLength(player.age, player.ovr);
  const varied = applyWeightedVariation(expected);
  const years = applyHardConstraints(player.age, player.ovr, varied);

  let dealType: "team_friendly" | "balanced" | "player_friendly";

  if (years === 1) {
    dealType = "balanced";
  } else {
    dealType = pickDealTypeByTier(player.tier);
  }

  const { bonusPct, curve: structureType } = DEAL_TYPE_CONFIG[dealType];

  const totalValue = baseCapHit * years;
  const signingBonus = Math.round(totalValue * bonusPct);
  const bonusProrated = Math.round(signingBonus / years);

  const curve = scaleCurve(SALARY_CURVES[structureType], years);

  const yearBreakdown: ContractYearBreakdown[] = [];
  const salaryPool = totalValue - signingBonus;

  for (let i = 0; i < years; i++) {
    const y = player.year + i;

    const salary = Math.round(salaryPool * curve[i]);
    const capHit = salary + bonusProrated;

    yearBreakdown.push({
      year: y,
      salary,
      bonusProrated,
      capHit,
      capSavings: 0,
      capSavingsPostJune1: 0,
    });
  }

  const apy = totalValue / years;

  const year1Salary = yearBreakdown[0]?.salary ?? 0;
  const year2Salary = yearBreakdown[1]?.salary ?? 0;

  let guaranteedSalaryBase = 0;

  switch (player.tier) {
    case "superstar":
      guaranteedSalaryBase = year1Salary + year2Salary * 0.5;
      break;
    case "star":
      guaranteedSalaryBase = year1Salary + year2Salary * 0.25;
      break;
    case "solid":
      guaranteedSalaryBase = year1Salary * 0.5;
      break;
    case "developmental":
      guaranteedSalaryBase = year1Salary * 0.25;
      break;
    default:
      guaranteedSalaryBase = 0;
      break;
  }

  const guaranteedSalary = Math.round(guaranteedSalaryBase + signingBonus);

  const { deadMoney, postJune1 } = computeDeadMoney(
    yearBreakdown,
    guaranteedSalary,
    signingBonus
  );

  const capSavingsByYear: number[] = [];
  const capSavingsPostJune1ByYear: number[] = [];

  for (let i = 0; i < years; i++) {
    const capHit = yearBreakdown[i].capHit;
    const dead = deadMoney[i].total;

    const savings = capHit - dead;
    const savingsPostJune1 = capHit - postJune1.currentYear;

    yearBreakdown[i].capSavings = savings;
    yearBreakdown[i].capSavingsPostJune1 = savingsPostJune1;

    capSavingsByYear.push(savings);
    capSavingsPostJune1ByYear.push(savingsPostJune1);
  }

  let cuttableYear: number | null = null;
  for (let i = 0; i < years; i++) {
    if (capSavingsByYear[i] > 0) {
      cuttableYear = yearBreakdown[i].year;
      break;
    }
  }

  const voidYears = 0;
  const optionYears = 0;
  const riskLevel: "low" | "medium" | "high" = "medium";
  const notes = "";

  return {
    years,
    totalValue,
    apy,
    signingBonus,
    totalGuarantees: guaranteedSalary,
    structureType,
    yearBreakdown,

    contractStyle: dealType,
    voidYears,
    optionYears,
    guaranteedSalary,
    riskLevel,
    notes,

    isTeamFriendly: dealType === "team_friendly",
    isPlayerFriendly: dealType === "player_friendly",
    isBalanced: dealType === "balanced",

    deadMoney,
    postJune1,

    capSavingsByYear,
    capSavingsPostJune1ByYear,
    cuttableYear,
  };
}
