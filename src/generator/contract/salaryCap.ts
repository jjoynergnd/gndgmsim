export function getLeagueCap(year: number): number {
  const baseYear = 2026;
  const baseCap = 305_000_000; // 305M in 2026
  const annualIncrease = 15_000_000; // +15M per year

  const yearsPassed = year - baseYear;
  return baseCap + (yearsPassed * annualIncrease);
}
