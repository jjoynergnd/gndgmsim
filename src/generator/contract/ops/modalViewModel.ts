// src/generator/contract/ops/modalViewModel.ts

import type { PlayerModalContractMetadata } from "./modalMetadata.js";

/**
 * UI-friendly formatted view model for the Player Contract Modal.
 * This is what the React component should consume directly.
 */

export interface PlayerContractModalViewModel {
  summary: {
    yearsAdded: number;
    voidYearsAdded: number;

    totalCashFlowChange: string;
    totalGuaranteesChange: string;
    signingBonusChange: string;

    capHitThisYearDelta: string;
    capHitNextYearDelta: string;

    isCapHitPositive: boolean;
  };

  rows: Array<{
    label: string;
    before: string;
    after: string;
    delta: string;
    positive: boolean;
  }>;

  raw: PlayerModalContractMetadata;
}

// -----------------------------
// Helpers
// -----------------------------
function fmtMoney(n: number): string {
  const abs = Math.abs(n);
  const sign = n >= 0 ? "+" : "-";
  return `${sign}$${(abs / 1_000_000).toFixed(1)}M`;
}

function fmtMoneyAbs(n: number): string {
  return `$${(n / 1_000_000).toFixed(1)}M`;
}

function fmtNumber(n: number): string {
  const sign = n >= 0 ? "+" : "-";
  return `${sign}${Math.abs(n)}`;
}

// -----------------------------
// Main Builder
// -----------------------------
export function buildPlayerContractModalViewModel(
  meta: PlayerModalContractMetadata
): PlayerContractModalViewModel {
  const { before, after, deltas } = meta;

  const summary = {
    yearsAdded: deltas.yearsAdded,
    voidYearsAdded: deltas.voidYearsAdded,

    totalCashFlowChange: fmtMoney(deltas.totalCashFlowChange),
    totalGuaranteesChange: fmtMoney(deltas.totalGuaranteesChange),
    signingBonusChange: fmtMoney(deltas.signingBonusChange),

    capHitThisYearDelta: fmtMoney(deltas.capHitThisYear),
    capHitNextYearDelta: fmtMoney(deltas.capHitNextYear),

    isCapHitPositive: deltas.capHitThisYear > 0
  };

  const rows = [
    {
      label: "Cap Hit (This Year)",
      before: fmtMoneyAbs(before.yearBreakdown[0]?.capHit ?? 0),
      after: fmtMoneyAbs(after.yearBreakdown[0]?.capHit ?? 0),
      delta: fmtMoney(deltas.capHitThisYear),
      positive: deltas.capHitThisYear >= 0
    },
    {
      label: "Cap Hit (Next Year)",
      before: fmtMoneyAbs(before.yearBreakdown[1]?.capHit ?? 0),
      after: fmtMoneyAbs(after.yearBreakdown[1]?.capHit ?? 0),
      delta: fmtMoney(deltas.capHitNextYear),
      positive: deltas.capHitNextYear >= 0
    },
    {
      label: "Total Cash Flow",
      before: fmtMoneyAbs(before.totalValue),
      after: fmtMoneyAbs(after.totalValue),
      delta: fmtMoney(deltas.totalCashFlowChange),
      positive: deltas.totalCashFlowChange >= 0
    },
    {
      label: "Total Guarantees",
      before: fmtMoneyAbs(before.totalGuarantees),
      after: fmtMoneyAbs(after.totalGuarantees),
      delta: fmtMoney(deltas.totalGuaranteesChange),
      positive: deltas.totalGuaranteesChange >= 0
    },
    {
      label: "Signing Bonus",
      before: fmtMoneyAbs(before.signingBonus),
      after: fmtMoneyAbs(after.signingBonus),
      delta: fmtMoney(deltas.signingBonusChange),
      positive: deltas.signingBonusChange >= 0
    },
    {
      label: "Void Years",
      before: `${before.voidYears}`,
      after: `${after.voidYears}`,
      delta: fmtNumber(deltas.voidYearsAdded),
      positive: deltas.voidYearsAdded >= 0
    },
    {
      label: "Contract Length",
      before: `${before.years}`,
      after: `${after.years}`,
      delta: fmtNumber(deltas.yearsAdded),
      positive: deltas.yearsAdded >= 0
    }
  ];

  return {
    summary,
    rows,
    raw: meta
  };
}
