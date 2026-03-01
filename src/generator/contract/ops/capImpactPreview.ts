// src/generator/contract/ops/capImpactPreview.ts

import type { Contract } from "../contractBase.js";

/**
 * Team-level cap impact preview for a single modified contract.
 * Used by UI/offseason flows to show before/after cap space.
 */
export interface CapImpactPreview {
  team: string;
  year: number;
  beforeCapSpace: number;
  afterCapSpace: number;
  delta: number; // afterCapSpace - beforeCapSpace
}

/**
 * Computes the cap impact of replacing one player's contract
 * with a modified version for a specific league year.
 */
export function previewCapImpact(
  teamCap: number,
  teamContracts: Contract[],
  modifiedContract: Contract,
  playerId: string,
  year: number
): CapImpactPreview {
  // -----------------------------
  // 1. Compute BEFORE cap hit
  // -----------------------------
  let beforeCapHit = 0;

  for (const c of teamContracts) {
    const y = c.yearBreakdown.find(b => b.year === year);
    if (y) beforeCapHit += y.capHit;
  }

  // -----------------------------
  // 2. Compute AFTER cap hit
  // -----------------------------
  let afterCapHit = 0;

  for (const c of teamContracts) {
    if ((c as any).playerId === playerId) {
      // Replace with modified contract
      const y = modifiedContract.yearBreakdown.find(b => b.year === year);
      if (y) afterCapHit += y.capHit;
    } else {
      const y = c.yearBreakdown.find(b => b.year === year);
      if (y) afterCapHit += y.capHit;
    }
  }

  // -----------------------------
  // 3. Compute cap space
  // -----------------------------
  const beforeCapSpace = teamCap - beforeCapHit;
  const afterCapSpace = teamCap - afterCapHit;

  return {
    team: (modifiedContract as any).team ?? "Unknown",
    year,
    beforeCapSpace,
    afterCapSpace,
    delta: afterCapSpace - beforeCapSpace,
  };
}
