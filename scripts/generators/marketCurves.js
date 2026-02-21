// scripts/generators/marketCurves.js

// Base APY ranges (in millions) by position tier
const POSITION_APY_CURVES = {
  QB:   { elite: [45, 55], good: [30, 40], avg: [15, 25], low: [3, 8] },
  WR:   { elite: [25, 32], good: [18, 24], avg: [10, 16], low: [2, 6] },
  LT:   { elite: [24, 30], good: [18, 24], avg: [10, 15], low: [3, 7] },
  EDGE: { elite: [24, 30], good: [18, 24], avg: [10, 15], low: [3, 7] },
  CB:   { elite: [20, 25], good: [14, 19], avg: [8, 13],  low: [2, 6] },
  DT:   { elite: [18, 23], good: [12, 17], avg: [7, 11],  low: [2, 5] },
  S:    { elite: [14, 18], good: [9, 13],  avg: [5, 8],   low: [1.5, 4] },
  LB:   { elite: [15, 20], good: [10, 14], avg: [6, 9],   low: [2, 5] },
  RB:   { elite: [10, 14], good: [6, 9],   avg: [3, 5],   low: [1, 3] },
  TE:   { elite: [13, 17], good: [8, 12],  avg: [4, 7],   low: [1.5, 4] },
  OL:   { elite: [18, 23], good: [12, 17], avg: [7, 11],  low: [2, 5] },
  K:    { elite: [4, 6],   good: [3, 4],   avg: [2, 3],   low: [1, 2] },
  P:    { elite: [3, 4],   good: [2.5, 3], avg: [1.5, 2], low: [1, 1.5] },
};

function getBucketFromOvr(ovr) {
  if (ovr >= 88) return "elite";
  if (ovr >= 80) return "good";
  if (ovr >= 72) return "avg";
  return "low";
}

function getCurveForPosition(position) {
  if (POSITION_APY_CURVES[position]) return POSITION_APY_CURVES[position];

  // Map line positions to OL curve
  if (["LG", "RG", "C", "RT"].includes(position)) return POSITION_APY_CURVES.OL;

  // Fallback: average-ish curve
  return { elite: [15, 20], good: [10, 14], avg: [6, 9], low: [2, 5] };
}

export function getMarketApy(position, ovr, age, devTrait) {
  const bucket = getBucketFromOvr(ovr);
  const curve = getCurveForPosition(position);
  const [min, max] = curve[bucket];

  // Age modifier: older vets get slight discount, primes get bump
  let ageFactor = 1;
  if (age <= 25) ageFactor = 0.9;
  else if (age >= 30 && age <= 32) ageFactor = 1.05;
  else if (age > 32) ageFactor = 0.85;

  // Dev trait modifier
  let devFactor = 1;
  if (devTrait === "Superstar") devFactor = 1.15;
  else if (devTrait === "Star") devFactor = 1.05;
  else if (devTrait === "Normal") devFactor = 1.0;
  else if (devTrait === "Slow") devFactor = 0.9;

  const base = (min + max) / 2;
  return base * ageFactor * devFactor; // in millions
}
