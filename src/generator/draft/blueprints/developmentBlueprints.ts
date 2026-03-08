// src/generator/draft/blueprints/developmentBlueprints.ts

import { randInt, randFloat, weightedPick } from "../../utils/random.js";

export function generateDevelopmentCurve() {
  const curve = weightedPick([
    { value: "fast", weight: 20 },
    { value: "normal", weight: 60 },
    { value: "slow", weight: 20 },
  ]) as "fast" | "normal" | "slow";

  return {
    curve,
    peakAge: randInt(25, 28),
    regressionAge: randInt(29, 32),
    boomBustFactor: randFloat(0.1, 0.4),
  };
}