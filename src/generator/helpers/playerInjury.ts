// src/generator/helpers/playerInjury.ts

import { randInt } from "../utils/random.js";
import { Position } from "../config/positions.js";

export function generatePlayerInjuryBlock(position: Position) {
  const base = randInt(40, 90);
  const riskAdj: Partial<Record<Position, number>> = {
    QB: -10, HB: +10, WR_X: +5, WR_Z: +5, WR_SLOT: +7,
    TE: +6, EDGE: +8, DE: +6, DT_NT: +8, DT_3T: +8,
    MLB: +8, OLB: +6, CB: +4, NCB: +6, FS: +3, SS: +4,
    K: -15, P: -15, LS: -10
  };

  const injuryProneness = Math.max(20, Math.min(99, base + (riskAdj[position] ?? 0)));

  return {
    injuryProneness,
    injuryHistory: [],
    currentInjury: null,
    injuryStatus: "Healthy" as const
  };
}