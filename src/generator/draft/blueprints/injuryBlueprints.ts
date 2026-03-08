// src/generator/draft/blueprints/injuryBlueprints.ts

import { randInt, randFloat, chance } from "../../utils/random.js";

export function generateInjuryRisk() {
  return {
    durability: randInt(40, 95),
    recovery: randInt(40, 95),
    longTermRisk: randFloat(0.05, 0.35),
  };
}