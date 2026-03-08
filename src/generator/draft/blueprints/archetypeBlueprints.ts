// src/generator/draft/blueprints/archetypeBlueprints.ts

import type { DraftPosition } from "../types.js";
import { pickOne } from "../../utils/random.js";

const ARCHETYPES: Record<DraftPosition, string[]> = {
  QB: ["Field General", "Strong Arm", "Scrambler"],
  HB: ["Power", "Elusive", "Receiving"],
  FB: ["Blocking", "Utility"],
  WR_X: ["Possession", "Deep Threat", "Physical"],
  WR_Z: ["Route Runner", "Deep Threat"],
  WR_SLOT: ["Slot", "Quick"],
  TE: ["Vertical", "Blocking", "Possession"],
  LT: ["Pass Protector", "Balanced"],
  LG: ["Run Blocker", "Balanced"],
  C: ["Anchor", "Balanced"],
  RG: ["Run Blocker", "Balanced"],
  RT: ["Power", "Balanced"],
  EDGE: ["Speed Rusher", "Power Rusher"],
  DE: ["Balanced", "Power"],
  DT_NT: ["Run Stuffer"],
  DT_3T: ["Penetrator"],
  MLB: ["Field General", "Run Stopper"],
  OLB: ["Pass Rush", "Coverage"],
  CB: ["Man", "Zone", "Press"],
  NCB: ["Slot", "Zone"],
  FS: ["Center Fielder", "Zone"],
  SS: ["Box", "Hybrid"],
  K: ["Accurate", "Power"],
  P: ["Directional", "Power"],
  LS: ["Standard"],
};

export function assignArchetype(position: DraftPosition): string {
  return pickOne(ARCHETYPES[position]);
}