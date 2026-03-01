// src/generator/contract/ops/modalMetadata.ts

import type { Contract } from "../contractBase.js";

/**
 * UI-facing metadata for the Player Contract Modal.
 * Shows before/after contract state and computed deltas.
 */
export interface PlayerModalContractMetadata {
  before: Contract;
  after: Contract;
  deltas: {
    capHitThisYear: number;
    capHitNextYear: number;
    totalCashFlowChange: number;
    totalGuaranteesChange: number;
    signingBonusChange: number;
    voidYearsAdded: number;
    yearsAdded: number;
  };
}

/**
 * Builds UI-ready metadata for the player modal after Option C.
 */
export function buildPlayerModalContractMetadata(
  before: Contract,
  after: Contract
): PlayerModalContractMetadata {
  const beforeY0 = before.yearBreakdown[0];
  const afterY0 = after.yearBreakdown[0];

  const beforeY1 = before.yearBreakdown[1];
  const afterY1 = after.yearBreakdown[1];

  return {
    before,
    after,
    deltas: {
      capHitThisYear: (afterY0?.capHit ?? 0) - (beforeY0?.capHit ?? 0),
      capHitNextYear: (afterY1?.capHit ?? 0) - (beforeY1?.capHit ?? 0),

      totalCashFlowChange: after.totalValue - before.totalValue,
      totalGuaranteesChange: after.totalGuarantees - before.totalGuarantees,
      signingBonusChange: after.signingBonus - before.signingBonus,

      voidYearsAdded: after.voidYears - before.voidYears,
      yearsAdded: after.years - before.years,
    },
  };
}
