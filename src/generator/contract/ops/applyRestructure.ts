// src/generator/contract/ops/applyRestructure.ts

import type {
  Contract,
  ContractYearBreakdown,
  RestructurePlan,
  RestructureMetadata
} from "../contractBase.js";

import { computeDeadMoney } from "../contractBase.js";

/**
 * Standard restructure operation:
 * - Converts salary → bonus in a given year
 * - Optionally adds a void year
 * - Recalculates proration, cap hits, dead money, cap savings, cuttable year
 */
export function applyRestructure(
  base: Contract,
  plan: RestructurePlan
): Contract & {
  isRestructured: boolean;
  restructureMetadata: RestructureMetadata;
} {
  const { effectiveYear, convertAmount, useVoidYear } = plan;

  // 0. Guard: no conversion requested
  if (convertAmount <= 0) {
    return {
      ...base,
      isRestructured: false,
      restructureMetadata: {
        effectiveYear,
        convertedAmount: 0,
        useVoidYear,
        newBonusProrationYears: 0,
      },
    };
  }

  // 1. Find the index of the effective year
  const idx = base.yearBreakdown.findIndex((y) => y.year === effectiveYear);
  if (idx === -1) {
    return {
      ...base,
      isRestructured: false,
      restructureMetadata: {
        effectiveYear,
        convertedAmount: 0,
        useVoidYear,
        newBonusProrationYears: 0,
      },
    };
  }

  // 2. Determine proration window
  const remainingRealYears = base.yearBreakdown.length - idx;
  const prorationWindow = remainingRealYears + (useVoidYear ? 1 : 0);
  if (prorationWindow <= 0) {
    return {
      ...base,
      isRestructured: false,
      restructureMetadata: {
        effectiveYear,
        convertedAmount: 0,
        useVoidYear,
        newBonusProrationYears: 0,
      },
    };
  }

  // 3. Determine actual convertible salary
  const year = base.yearBreakdown[idx];
  const actualConvert = Math.min(convertAmount, year.salary);
  if (actualConvert <= 0) {
    return {
      ...base,
      isRestructured: false,
      restructureMetadata: {
        effectiveYear,
        convertedAmount: 0,
        useVoidYear,
        newBonusProrationYears: prorationWindow,
      },
    };
  }

  // 4. Reduce salary in the effective year
  const updatedBreakdown: ContractYearBreakdown[] = base.yearBreakdown.map((y, i) => {
    if (i !== idx) return { ...y };
    return {
      ...y,
      salary: y.salary - actualConvert,
    };
  });

  // 5. Compute new bonus proration
  const newBonus = actualConvert;
  const newBonusPerYear = Math.round(newBonus / prorationWindow);

  // 6. Apply prorated bonus to remaining real years
  for (let i = idx; i < updatedBreakdown.length; i++) {
    const y = updatedBreakdown[i];
    const bonusProrated = y.bonusProrated + newBonusPerYear;
    const capHit = y.salary + bonusProrated;

    updatedBreakdown[i] = {
      ...y,
      bonusProrated,
      capHit,
      capSavings: 0,
      capSavingsPostJune1: 0,
    };
  }

  // 7. Optional void year
  let voidYears = base.voidYears;
  if (useVoidYear) {
    const lastRealYear = updatedBreakdown[updatedBreakdown.length - 1].year;
    const voidYear = lastRealYear + 1;

    updatedBreakdown.push({
      year: voidYear,
      salary: 0,
      bonusProrated: newBonusPerYear,
      capHit: newBonusPerYear,
      capSavings: 0,
      capSavingsPostJune1: 0,
    });

    voidYears = base.voidYears + 1;
  }

  // Totals remain the same except guarantees + signing bonus increase
  const years = updatedBreakdown.length;
  const totalValue = base.totalValue;
  const apy = totalValue / years;

  const signingBonus = base.signingBonus + newBonus;
  const guaranteedSalary = base.guaranteedSalary + newBonus;

  // 9. Recompute dead money + postJune1
  const { deadMoney, postJune1 } = computeDeadMoney(
    updatedBreakdown,
    guaranteedSalary,
    signingBonus
  );

  // 10. Recompute cap savings
  const capSavingsByYear: number[] = [];
  const capSavingsPostJune1ByYear: number[] = [];

  for (let i = 0; i < updatedBreakdown.length; i++) {
    const capHit = updatedBreakdown[i].capHit;
    const dead = deadMoney[i].total;

    const savings = capHit - dead;
    const savingsPostJune1 = capHit - postJune1.currentYear;

    updatedBreakdown[i].capSavings = savings;
    updatedBreakdown[i].capSavingsPostJune1 = savingsPostJune1;

    capSavingsByYear.push(savings);
    capSavingsPostJune1ByYear.push(savingsPostJune1);
  }

  // 11. Recompute cuttableYear
  let cuttableYear: number | null = null;
  for (let i = 0; i < updatedBreakdown.length; i++) {
    if (capSavingsByYear[i] > 0) {
      cuttableYear = updatedBreakdown[i].year;
      break;
    }
  }

  const restructureMetadata: RestructureMetadata = {
    effectiveYear,
    convertedAmount: actualConvert,
    useVoidYear,
    newBonusProrationYears: prorationWindow,
  };

  return {
    ...base,
    years,
    totalValue,
    apy,
    signingBonus,
    guaranteedSalary,
    yearBreakdown: updatedBreakdown,
    deadMoney,
    postJune1,
    capSavingsByYear,
    capSavingsPostJune1ByYear,
    cuttableYear,
    voidYears,

    isRestructured: true,
    restructureMetadata,
  };
}
