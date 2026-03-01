// src/generator/contract/ops/extendContract.ts

import type {
  Contract,
  ContractYearBreakdown,
  ExtensionPlan
} from "../contractBase.js";

import { computeDeadMoney } from "../contractBase.js";
import { SALARY_CURVES, scaleCurve } from "../../config/contractCurves.js";

/**
 * Extension-only contract modification.
 * Adds new years, recalculates totals, dead money, cap savings, and cuttable year.
 */
export function extendContract(
  base: Contract,
  plan: ExtensionPlan
): Contract & {
  isExtended: boolean;
  extensionMetadata: any;
} {
  const { addedYears, newAPY, structureType, startYear } = plan;

  // 0. Guard: no years to add
  if (addedYears <= 0) {
    return {
      ...base,
      isExtended: false,
      extensionMetadata: null,
    };
  }

  // -----------------------------
  // 1. Generate new years
  // -----------------------------
  const newTotalValue = newAPY * addedYears;
  const bonusProrated = 0; // extension-only step: no new signing bonus

  const curve = scaleCurve(SALARY_CURVES[structureType], addedYears);
  const salaryPool = newTotalValue;

  const newYears: ContractYearBreakdown[] = [];

  for (let i = 0; i < addedYears; i++) {
    const y = startYear + i;
    const salary = Math.round(salaryPool * curve[i]);
    const capHit = salary + bonusProrated;

    newYears.push({
      year: y,
      salary,
      bonusProrated,
      capHit,
      capSavings: 0,
      capSavingsPostJune1: 0,
    });
  }

  // -----------------------------
  // 2. Merge with existing years
  // -----------------------------
  const mergedBreakdown = [...base.yearBreakdown, ...newYears];

  // -----------------------------
  // 3. Recompute totals
  // -----------------------------
  const totalValue = base.totalValue + newTotalValue;
  const years = base.years + addedYears;
  const apy = totalValue / years;

  const signingBonus = base.signingBonus;
  const guaranteedSalary = base.guaranteedSalary;

  // -----------------------------
  // 4. Recompute dead money + postJune1
  // -----------------------------
  const { deadMoney, postJune1 } = computeDeadMoney(
    mergedBreakdown,
    guaranteedSalary,
    signingBonus
  );

  // -----------------------------
  // 5. Recompute cap savings
  // -----------------------------
  const capSavingsByYear: number[] = [];
  const capSavingsPostJune1ByYear: number[] = [];

  for (let i = 0; i < mergedBreakdown.length; i++) {
    const capHit = mergedBreakdown[i].capHit;
    const dead = deadMoney[i].total;

    const savings = capHit - dead;
    const savingsPostJune1 = capHit - postJune1.currentYear;

    mergedBreakdown[i].capSavings = savings;
    mergedBreakdown[i].capSavingsPostJune1 = savingsPostJune1;

    capSavingsByYear.push(savings);
    capSavingsPostJune1ByYear.push(savingsPostJune1);
  }

  // -----------------------------
  // 6. Recompute cuttableYear
  // -----------------------------
  let cuttableYear: number | null = null;
  for (let i = 0; i < mergedBreakdown.length; i++) {
    if (capSavingsByYear[i] > 0) {
      cuttableYear = mergedBreakdown[i].year;
      break;
    }
  }

  return {
    ...base,
    years,
    totalValue,
    apy,
    yearBreakdown: mergedBreakdown,
    deadMoney,
    postJune1,
    capSavingsByYear,
    capSavingsPostJune1ByYear,
    cuttableYear,

    isExtended: true,
    extensionMetadata: {
      addedYears,
      newMoney: newTotalValue,
      newAPY,
      structureType,
    },
  };
}
