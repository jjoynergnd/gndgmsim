// src/generator/draft/blueprints/combineBlueprints.ts

import type { Position } from "../../config/positions.js";
import { randFloat, randInt } from "../../utils/random.js";

export function generateCombine(position: Position) {
  switch (position) {
    case "QB":
      return {
        fortyTime: randFloat(4.6, 5.1),
        shuttle: randFloat(4.1, 4.5),
        threeCone: randFloat(6.9, 7.4),
      };

    case "HB":
      return {
        fortyTime: randFloat(4.35, 4.6),
        benchReps: randInt(10, 25),
        verticalJump: randInt(30, 40),
      };

    case "WR_X":
    case "WR_Z":
    case "WR_SLOT":
      return {
        fortyTime: randFloat(4.35, 4.55),
        verticalJump: randInt(32, 40),
        shuttle: randFloat(4.0, 4.3),
      };

    case "LT":
    case "LG":
    case "C":
    case "RG":
    case "RT":
      return {
        fortyTime: randFloat(4.9, 5.4),
        benchReps: randInt(18, 35),
      };

    case "EDGE":
    case "DE":
      return {
        fortyTime: randFloat(4.55, 4.8),
        benchReps: randInt(18, 30),
        threeCone: randFloat(6.8, 7.3),
      };

    case "DT_NT":
    case "DT_3T":
      return {
        fortyTime: randFloat(4.9, 5.3),
        benchReps: randInt(20, 40),
      };

    case "MLB":
    case "OLB":
      return {
        fortyTime: randFloat(4.55, 4.75),
        shuttle: randFloat(4.0, 4.3),
      };

    case "CB":
    case "NCB":
      return {
        fortyTime: randFloat(4.35, 4.55),
        shuttle: randFloat(3.9, 4.2),
        verticalJump: randInt(32, 40),
      };

    case "FS":
    case "SS":
      return {
        fortyTime: randFloat(4.45, 4.65),
        verticalJump: randInt(30, 38),
      };

    default:
      return {};
  }
}