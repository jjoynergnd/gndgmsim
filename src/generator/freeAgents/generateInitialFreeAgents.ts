// src/generator/freeAgents/generateInitialFreeAgents.ts

import { generateFreeAgentPool } from "./freeAgentGenerator.js";
import type { PlayerState } from "../../state/player.js";

const INITIAL_FA_COUNT = 150;

export function generateInitialFreeAgents(year: number): PlayerState[] {
  return generateFreeAgentPool(INITIAL_FA_COUNT, year);
}