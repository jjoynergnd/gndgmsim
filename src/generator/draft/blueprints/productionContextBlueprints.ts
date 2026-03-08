// src/generator/draft/blueprints/productionContextBlueprints.ts

import { randInt } from "../../utils/random.js";
import { randomConference } from "../utils/conferences.js";

export function generateProductionContext() {
  return {
    conference: randomConference(),
    teamStrength: randInt(40, 95),
    strengthOfSchedule: randInt(40, 95),
    supportingCast: randInt(40, 95),
  };
}