// src/generator/contract/contractBase.ts

import { POSITION_BASE_SALARY } from "./positionBaseSalaries.js";
import { POSITIONS } from "../config/positions.js";
import { SALARY_CURVES, scaleCurve } from "../config/contractCurves.js";
import type { Position } from "../config/positions.js";

// -----------------------------
// Contract Types
// -----------------------------
export interface ContractYearBreakdown {
  year: number;
  salary: number;
  bonusProrated: number;
  capHit: number;
}

export interface Contract {
  years: number;
  totalValue: number;
  apy: number;
  signingBonus: number;
  totalGuarantees: number;
  structureType: string;
  yearBreakdown: ContractYearBreakdown[];
}

// -----------------------------
// Utility: Weighted Random Pick
// -----------------------------
function weightedPick<T extends { weight: number }>(items: T[]): T {
  const total = items.reduce((s, i) => s + i.weight, 0);
  let r = Math.random() * total;

  for (const item of items) {
    if (r < item.weight) return item;
    r -= item.weight;
  }
  return items[items.length - 1];
}

// -----------------------------
// Salary Factor Helpers
// -----------------------------
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

// -----------------------------
// Contract Length Logic
// -----------------------------
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

// -----------------------------
// Signing Bonus Logic
// -----------------------------
const DEFAULT_BONUS_PCT = 0.20;

// -----------------------------
// Main Contract Generator
// -----------------------------
export function generateBaseContract(player: {
  position: Position;
  ovr: number;
  age: number;
  year: number;
}): Contract {
  console.log("DEBUG CONTRACT INPUT:", player);

  const family = POSITIONS[player.position].family;
  const base = POSITION_BASE_SALARY[family] ?? 600_000;

  const ovrFactor = getOVRFactor(player.ovr);
  const ageFactor = getAgeFactor(player.age);
  const posFactor = getPositionFactor(player.position);

  const baseCapHit = Math.round(base * ovrFactor * ageFactor * posFactor);

  // Determine contract length
  const expected = getExpectedLength(player.age, player.ovr);
  const varied = applyWeightedVariation(expected);
  const years = applyHardConstraints(player.age, player.ovr, varied);

  // Signing bonus + proration
  const totalValue = baseCapHit * years;
  const signingBonus = Math.round(totalValue * DEFAULT_BONUS_PCT);
  const bonusProrated = Math.round(signingBonus / years);

  // Salary curve selection
  const structureType = "balanced";
  const curve = scaleCurve(SALARY_CURVES[structureType], years);

  // Build year breakdown
  const yearBreakdown: ContractYearBreakdown[] = [];

  const salaryPool = totalValue - signingBonus;

  for (let i = 0; i < years; i++) {
    const y = player.year + i;

    // 🔍 DEBUG: 1-year contract salary investigation
    if (years === 1) {
      console.log("🔍 1-YEAR DEBUG", {
        playerId: player.position,
        baseCapHit,
        totalValue,
        signingBonus,
        salaryPool,
        curve,
        curve_i: curve[i],
        computedSalary: salaryPool * curve[i]
      });
    }

    const salary = Math.round(salaryPool * curve[i]);

    // ❌ DEBUG: catch NaN salary immediately
    if (Number.isNaN(salary)) {
      console.log("❌ SALARY NAN DETECTED", {
        playerId: player.position,
        baseCapHit,
        totalValue,
        signingBonus,
        salaryPool,
        curve,
        curve_i: curve[i],
        computedSalary: salaryPool * curve[i]
      });
    }

    const capHit = salary + bonusProrated;

    yearBreakdown.push({
      year: y,
      salary,
      bonusProrated,
      capHit,
    });
  }

  const apy = totalValue / years;

  return {
    years,
    totalValue,
    apy,
    signingBonus,
    totalGuarantees: signingBonus,
    structureType,
    yearBreakdown,
  };
}
