// src/generator/cap/teamCapCalculator.ts

import type { Contract } from "../contract/contractBase.js";

/**
 * Computes total team salary for a given league year.
 * Fully compatible with the new multi-year Contract shape.
 */
export function getTeamTotalSalary(
  roster: Array<{ id: string; position: string; contract?: Contract }>,
  year: number
): number {
  return roster.reduce((sum, p) => {
    const contract = p.contract;
    if (!contract) return sum;

    // New multi-year shape
    if (contract.yearBreakdown && Array.isArray(contract.yearBreakdown)) {
      const entry = contract.yearBreakdown.find((y) => y.year === year);

      if (entry) {
        const value = entry.capHit ?? entry.salary ?? 0;

        // Debug guard for NaN
        if (Number.isNaN(value)) {
          console.log("❌ NaN DETECTED:", {
            playerId: p.id,
            position: p.position,
            year,
            entry,
            contract,
          });
        }

        return sum + value;
      }

      return sum;
    }

    // Backwards compatibility: old single-year { salary } shape
    if (typeof (contract as any).salary === "number") {
      return sum + (contract as any).salary;
    }

    return sum;
  }, 0);
}

export function getTeamCapSpace(totalSalary: number, leagueCap: number): number {
  return leagueCap - totalSalary;
}
