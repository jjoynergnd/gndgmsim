import type { Position } from "./positions.js";

export type Archetype =
  | "field_general"
  | "scrambler"
  | "power_back"
  | "elusive_back"
  | "deep_threat"
  | "possession"
  | "blocking_te"
  | "receiving_te"
  | "pass_protector"
  | "power_rusher"
  | "run_stopper"
  | "coverage"
  | "ball_hawk";

// Map archetypes to every position in your expanded model
export const POSITION_ARCHETYPES: Record<Position, Archetype[]> = {
  // Offense
  QB: ["field_general", "scrambler"],
  HB: ["power_back", "elusive_back"],
  FB: ["power_back", "elusive_back"],
  WR_X: ["deep_threat", "possession"],
  WR_Z: ["deep_threat", "possession"],
  WR_SLOT: ["deep_threat", "possession"],
  TE: ["blocking_te", "receiving_te"],
  LT: ["pass_protector"],
  LG: ["power_rusher"],
  C: ["pass_protector"],
  RG: ["power_rusher"],
  RT: ["pass_protector"],

  // Defense – front
  EDGE: ["power_rusher"],
  DE: ["power_rusher"],
  DT_NT: ["run_stopper"],
  DT_3T: ["run_stopper"],

  // Linebackers
  MLB: ["coverage", "run_stopper"],
  OLB: ["coverage", "run_stopper"],

  // Secondary
  CB: ["coverage", "ball_hawk"],
  NCB: ["coverage", "ball_hawk"],
  FS: ["coverage", "ball_hawk"],
  SS: ["coverage", "ball_hawk"],

  // Special teams (optional archetypes for ST)
  K: [],
  P: [],
  LS: [],
  KR: ["deep_threat", "elusive_back"],
  PR: ["deep_threat", "elusive_back"]
};
