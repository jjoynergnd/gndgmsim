// src/generator/cap/leagueCap.ts
// Centralized league‑wide cap configuration + helpers

export const BASE_CAP_2026 = 305_000_000;
export const CAP_INCREMENT_PER_YEAR = 15_000_000;

export function getLeagueCap(year: number): number {
  const baseYear = 2026;
  const diff = year - baseYear;
  return BASE_CAP_2026 + Math.max(0, diff) * CAP_INCREMENT_PER_YEAR;
}

export function getCapConfig() {
  return {
    baseYear: 2026,
    baseCap: BASE_CAP_2026,
    annualIncrease: CAP_INCREMENT_PER_YEAR
  };
}
