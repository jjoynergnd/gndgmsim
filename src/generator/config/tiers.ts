// src/generator/config/tiers.ts

export type PlayerTier =
  | "superstar"
  | "star"
  | "solid"
  | "developmental"
  | "depth"
  | "fringe";

export const TIER_WEIGHTS: Record<PlayerTier, number> = {
  superstar: 2,
  star: 10,
  solid: 40,
  developmental: 20,
  depth: 20,
  fringe: 8
};

export const TIER_OVR_MODIFIERS: Record<PlayerTier, number> = {
  superstar: +6,
  star: +3,
  solid: 0,
  developmental: +1,
  depth: -2,
  fringe: -4
};
