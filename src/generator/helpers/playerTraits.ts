// src/generator/helpers/playerTraits.ts

import { pickOne } from "../utils/random.js";

export function generatePlayerTraits() {
  return {
    devTrait: pickOne(["Normal", "Star", "Superstar", "X-Factor"]),
    personality: pickOne(["Calm", "Fiery", "Reserved", "Vocal"]),
    lockerRoom: pickOne(["Leader", "Neutral", "Disruptive"]),
    tags: [],
    intangibles: []
  };
}