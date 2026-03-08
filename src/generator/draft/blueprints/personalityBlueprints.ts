// src/generator/draft/blueprints/personalityBlueprints.ts

import { randInt } from "../../utils/random.js";

export function generatePersonalityProfile() {
  return {
    workEthic: randInt(40, 99),
    leadership: randInt(30, 95),
    discipline: randInt(40, 95),
    competitiveness: randInt(50, 99),
    ego: randInt(10, 90),
  };
}