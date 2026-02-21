import type { Position } from "./positions.js";

export type Archetype =
  | "field_general"
  | "scrambler"
  | "power_back"
  | "elusive_back"
  | "lead_blocker"
  | "deep_threat"
  | "possession"
  | "route_runner"
  | "slot_receiver"
  | "blocking_te"
  | "receiving_te"
  | "pass_protector"
  | "mauler"
  | "power_rusher"
  | "speed_rusher"
  | "run_stopper"
  | "penetrator"
  | "anchor"
  | "coverage"
  | "tackler"
  | "ball_hawk"
  | "enforcer"
  | "hybrid_safety"
  | "power_kicker"
  | "accurate_kicker"
  | "power_punter"
  | "placement_punter"
  | "sure_snapper"
  | "return_specialist";

export const POSITION_ARCHETYPES: Record<Position, Archetype[]> = {
  // Offense
  QB: ["field_general", "scrambler"],
  HB: ["power_back", "elusive_back"],
  FB: ["lead_blocker", "power_back"],
  WR_X: ["possession", "deep_threat"],
  WR_Z: ["deep_threat", "route_runner"],
  WR_SLOT: ["slot_receiver", "route_runner"],
  TE: ["blocking_te", "receiving_te"],
  LT: ["pass_protector", "mauler"],
  LG: ["mauler", "pass_protector"],
  C: ["mauler", "pass_protector"],
  RG: ["mauler", "pass_protector"],
  RT: ["pass_protector", "mauler"],

  // Defense – front
  EDGE: ["speed_rusher", "power_rusher"],
  DE: ["power_rusher", "run_stopper"],
  DT_NT: ["anchor", "run_stopper"],
  DT_3T: ["penetrator", "power_rusher"],

  // Linebackers
  MLB: ["field_general", "tackler", "run_stopper"],
  OLB: ["coverage", "run_stopper", "speed_rusher"],

  // Secondary
  CB: ["coverage", "ball_hawk"],
  NCB: ["coverage", "ball_hawk"],
  FS: ["ball_hawk", "coverage"],
  SS: ["enforcer", "hybrid_safety"],

  // Special teams
  K: ["power_kicker", "accurate_kicker"],
  P: ["power_punter", "placement_punter"],
  LS: ["sure_snapper"],
  KR: ["return_specialist"],
  PR: ["return_specialist"]
};
