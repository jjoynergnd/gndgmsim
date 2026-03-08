// src/generator/draft/blueprints/ratingBlueprints.ts

import type { Ratings } from "../../../state/player.js";
import type { Position } from "../../config/positions.js";
import { randInt } from "../../utils/random.js";

export function generateRatingsForPosition(
  position: Position,
  archetype: string
): Ratings {
  // Base template — you will refine this over time
  const base: Ratings = {
    ovr: 0,
    speed: randInt(60, 95),
    accel: randInt(60, 95),
    agility: randInt(55, 95),
    strength: randInt(50, 90),
    awareness: randInt(40, 80),
    stamina: randInt(60, 95),
    injury: randInt(60, 95),
    toughness: randInt(60, 95),

    // Position-specific placeholders
    passBlock: randInt(40, 85),
    runBlock: randInt(40, 85),
    catch: randInt(40, 90),
    carry: randInt(40, 90),
    throwPower: randInt(60, 95),
    throwAccuracy: randInt(55, 95),
    tackle: randInt(40, 90),
    blockShed: randInt(40, 90),
    pursuit: randInt(40, 90),
    coverage: randInt(40, 90),
  };

  // Position-specific adjustments
  switch (position) {
    case "QB":
      base.throwPower = randInt(70, 99);
      base.throwAccuracy = randInt(65, 95);
      base.awareness = randInt(50, 85);
      break;

    case "HB":
      base.speed = randInt(80, 97);
      base.accel = randInt(82, 97);
      base.carry = randInt(60, 95);
      base.agility = randInt(75, 97);
      break;

    case "WR_X":
    case "WR_Z":
    case "WR_SLOT":
      base.speed = randInt(82, 98);
      base.accel = randInt(82, 98);
      base.catch = randInt(60, 95);
      base.agility = randInt(75, 98);
      break;

    case "LT":
    case "LG":
    case "C":
    case "RG":
    case "RT":
      base.strength = randInt(75, 95);
      base.passBlock = randInt(60, 95);
      base.runBlock = randInt(60, 95);
      base.speed = randInt(50, 75);
      break;

    case "EDGE":
    case "DE":
      base.blockShed = randInt(60, 95);
      base.tackle = randInt(60, 95);
      base.pursuit = randInt(60, 95);
      break;

    case "DT_NT":
    case "DT_3T":
      base.strength = randInt(80, 99);
      base.blockShed = randInt(65, 95);
      break;

    case "MLB":
    case "OLB":
      base.tackle = randInt(65, 95);
      base.pursuit = randInt(65, 95);
      base.coverage = randInt(50, 85);
      break;

    case "CB":
    case "NCB":
      base.speed = randInt(85, 99);
      base.coverage = randInt(60, 95);
      base.agility = randInt(80, 99);
      break;

    case "FS":
    case "SS":
      base.speed = randInt(82, 97);
      base.coverage = randInt(60, 90);
      base.tackle = randInt(55, 90);
      break;

    case "K":
    case "P":
      base.awareness = randInt(50, 85);
      break;
  }

  // Compute OVR (simple version — you can refine later)
  base.ovr = Math.floor(
    (base.speed +
      base.accel +
      base.awareness +
      base.strength +
      base.agility) /
      5
  );

  return base;
}