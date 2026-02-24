// src/generator/contract/contractBase.ts

import { POSITION_BASE_SALARY } from "./positionBaseSalaries.js";
import { POSITIONS } from "../config/positions.js";
import type { Position } from "../config/positions.js";

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
  yearBreakdown: ContractYearBreakdown[];
}

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
  if (age >= 25 && age <= 28) return 3.0; // prime
  if (age >= 22 && age <= 24) return 1.0; // pre-prime
  if (age >= 29 && age <= 31) return 1.2; // post-prime
  return 0.8; // 32+
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

// For now: still 1-year deals, but using the multi-year shape.
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

  const rawSalary = Math.round(base * ovrFactor * ageFactor * posFactor);

  const years = 1;
  const totalValue = rawSalary;
  const apy = totalValue / years;

  const yearBreakdown: ContractYearBreakdown[] = [ 
    { 
      year: player.year,
      salary: rawSalary, 
      bonusProrated: 0, 
      capHit: rawSalary 
    } 
  ];

  return {
    years,
    totalValue,
    apy,
    yearBreakdown
  };
}
