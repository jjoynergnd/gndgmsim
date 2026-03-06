// src/generator/config/rosterDistribution.ts

import type { Position } from "./positions.js";

/**
 * Defines how many players to generate per position.
 * This is intentionally separate from POSITION_GROUPS so
 * roster generation is fully modular and future‑proof.
 */
export const ROSTER_DISTRIBUTION: Record<Position, number> = {
  // Offense
  QB: 3,
  HB: 4,
  FB: 1,

  WR_X: 2,
  WR_Z: 2,
  WR_SLOT: 2,

  TE: 3,

  LT: 2,
  LG: 2,
  C: 2,
  RG: 2,
  RT: 2,

  // Defense – front
  EDGE: 3,
  DE: 3,
  DT_NT: 2,
  DT_3T: 2,

  // Linebackers
  MLB: 2,
  OLB: 3,

  // Secondary
  CB: 4,
  NCB: 2,
  FS: 2,
  SS: 2,

  // Special teams
  K: 1,
  P: 1,
  LS: 1,
  KR: 1,
  PR: 1
} as const;