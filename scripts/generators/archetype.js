// scripts/generators/archetype.js

const ARCHETYPES = {
  QB: ["Field General", "Strong Arm", "Improviser"],
  RB: ["Power", "Elusive", "Receiving"],
  WR: ["Deep Threat", "Slot", "Possession"],
  TE: ["Vertical", "Blocking", "Hybrid"],
  EDGE: ["Speed Rusher", "Power Rusher"],
  DT: ["Run Stopper", "Power"],
  LB: ["Field General", "Pass Coverage", "Run Stopper"],
  CB: ["Man", "Zone", "Hybrid"],
  FS: ["Zone", "Hybrid", "Run Support"],
  SS: ["Zone", "Hybrid", "Run Support"],
  OL: ["Pass Protector", "Run Blocker"],
  K: ["Accurate", "Power"],
  P: ["Directional", "Power"],
};

export function generateArchetype(position) {
  if (ARCHETYPES[position]) {
    const list = ARCHETYPES[position];
    return list[Math.floor(Math.random() * list.length)];
  }

  // fallback
  return "Balanced";
}
