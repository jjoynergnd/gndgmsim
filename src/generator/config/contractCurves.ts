// src/generator/config/contractCurves.ts

export type SalaryCurveKey = "balanced" | "frontloaded" | "backloaded" | "flat";
export type SalaryCurve = number[];

// Baseline shapes are defined for up to 5 years and then rescaled
// to whatever length we actually need.
export const SALARY_CURVES: Record<SalaryCurveKey, SalaryCurve> = {
  balanced:    [0.20, 0.20, 0.20, 0.20, 0.20], // flat cap hits
  frontloaded: [0.30, 0.25, 0.20, 0.15, 0.10], // heavier early
  backloaded:  [0.10, 0.15, 0.20, 0.25, 0.30], // heavier late
  flat:        [0.20, 0.20, 0.20, 0.20, 0.20], // alias of balanced for now
};

export function scaleCurve(curve: SalaryCurve, years: number): SalaryCurve {
  // 1-year deals: all salary in that single year
  if (years <= 1) {
    return [1];
  }

  const base: SalaryCurve = curve.length > 0 ? curve : [1];

  // Exact length match → just normalize
  if (years === base.length) {
    const sum = base.reduce((acc: number, v: number) => acc + v, 0);
    if (sum === 0) {
      return Array.from({ length: years }, () => 1 / years);
    }
    return base.map((v: number) => v / sum);
  }

  // Resample the base curve to the requested length using simple linear interpolation
  const scaled: number[] = [];
  for (let i = 0; i < years; i++) {
    const t = i / (years - 1); // 0 → 1 across contract
    const idx = t * (base.length - 1);
    const lo = Math.floor(idx);
    const hi = Math.min(base.length - 1, lo + 1);
    const frac = idx - lo;

    const vLo = base[lo];
    const vHi = base[hi];
    const v = vLo + (vHi - vLo) * frac;

    scaled.push(v);
  }

  // Normalize to sum to 1.0
  const total = scaled.reduce((acc: number, v: number) => acc + v, 0);
  if (total === 0) {
    return Array.from({ length: years }, () => 1 / years);
  }

  return scaled.map((v: number) => v / total);
}
