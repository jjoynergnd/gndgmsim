// src/generator/helpers/playerVitals.ts

import { pickOne } from "../utils/random.js";

export function generatePlayerVitals() {
  return {
    handedness: pickOne(["Left", "Right"])
  };
}