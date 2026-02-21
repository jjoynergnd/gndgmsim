import { gaussian } from "../utils/gaussian.js";
import { randInt } from "../utils/random.js";
import { PHYSICAL_PROFILES } from "../config/physicalProfiles.js";
import type { Position } from "../config/positions.js";
import { generateRatings } from "./ratingGenerator.js";

export interface Player {
  id: string;
  position: Position;
  age: number;
  height: number;
  weight: number;

  tier: string;
  archetype: string;

  // Updated to support full Madden-style attribute sets
  ratings: Record<string, number>;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export function generatePlayer(position: Position): Player {
  const profile = PHYSICAL_PROFILES[position];

  const height = Math.round(
    clamp(gaussian(profile.heightMean, profile.heightStd), 65, 85)
  );

  const weight = Math.round(
    clamp(gaussian(profile.weightMean, profile.weightStd), 160, 380)
  );

  const footballProfile = generateRatings(position);

  return {
    id: crypto.randomUUID(),
    position,
    age: randInt(21, 34),
    height,
    weight,

    tier: footballProfile.tier,
    archetype: footballProfile.archetype,
    ratings: footballProfile.ratings
  };
}
