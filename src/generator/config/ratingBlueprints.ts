import type { Position } from "./positions.js";
import { ATTRIBUTE_GROUPS } from "./attributeGroups.js";

// Helper to merge attribute groups
function g(...groups: (keyof typeof ATTRIBUTE_GROUPS)[]) {
  return groups.flatMap(g => ATTRIBUTE_GROUPS[g]);
}

// Base mean/std for core attributes
const CORE_BASE = {
  speed: { mean: 65, std: 8 },
  acceleration: { mean: 68, std: 8 },
  agility: { mean: 65, std: 8 },
  strength: { mean: 70, std: 8 },
  awareness: { mean: 65, std: 8 }
};

// Position-specific blueprints
export const RATING_BLUEPRINTS: Record<
  Position,
  {
    attributes: string[];
    base: Record<string, { mean: number; std: number }>;
    archetypeMods: Record<string, Partial<Record<string, number>>>;
  }
> = {
  // -----------------------------
  // OFFENSE
  // -----------------------------
  QB: {
    attributes: g("core", "qb"),
    base: {
      ...CORE_BASE,
      throwPower: { mean: 80, std: 5 },
      throwAccuracyShort: { mean: 78, std: 6 },
      throwAccuracyMid: { mean: 76, std: 6 },
      throwAccuracyDeep: { mean: 74, std: 6 },
      throwOnRun: { mean: 75, std: 6 },
      playAction: { mean: 76, std: 6 }
    },
    archetypeMods: {
      field_general: { awareness: 10, throwAccuracyShort: 5 },
      scrambler: { speed: 10, agility: 10, throwOnRun: 5 }
    }
  },

  HB: {
    attributes: g("core", "rb"),
    base: {
      ...CORE_BASE,
      breakTackle: { mean: 75, std: 8 },
      trucking: { mean: 70, std: 8 },
      elusiveness: { mean: 75, std: 8 },
      ballSecurity: { mean: 70, std: 6 },
      catching: { mean: 60, std: 6 }
    },
    archetypeMods: {
      power_back: { trucking: 12, strength: 8 },
      elusive_back: { agility: 12, elusiveness: 10 }
    }
  },

  FB: {
    attributes: g("core", "rb", "ol"),
    base: {
      ...CORE_BASE,
      breakTackle: { mean: 70, std: 6 },
      trucking: { mean: 78, std: 6 },
      impactBlock: { mean: 80, std: 6 }
    },
    archetypeMods: {
      lead_blocker: { impactBlock: 10, strength: 8 }
    }
  },

  WR_X: {
    attributes: g("core", "wr"),
    base: {
      ...CORE_BASE,
      routeRunningShort: { mean: 75, std: 6 },
      routeRunningMid: { mean: 75, std: 6 },
      routeRunningDeep: { mean: 78, std: 6 },
      release: { mean: 78, std: 6 },
      catchInTraffic: { mean: 80, std: 6 },
      spectacularCatch: { mean: 80, std: 6 }
    },
    archetypeMods: {
      deep_threat: { speed: 10, routeRunningDeep: 10 },
      possession: { catchInTraffic: 10, release: 8 }
    }
  },

  WR_Z: {
    attributes: g("core", "wr"),
    base: {
      ...CORE_BASE,
      routeRunningShort: { mean: 76, std: 6 },
      routeRunningMid: { mean: 76, std: 6 },
      routeRunningDeep: { mean: 80, std: 6 },
      release: { mean: 75, std: 6 },
      catchInTraffic: { mean: 78, std: 6 },
      spectacularCatch: { mean: 78, std: 6 }
    },
    archetypeMods: {
      deep_threat: { speed: 10, routeRunningDeep: 10 },
      route_runner: { routeRunningShort: 8, routeRunningMid: 8 }
    }
  },

  WR_SLOT: {
    attributes: g("core", "wr"),
    base: {
      ...CORE_BASE,
      routeRunningShort: { mean: 80, std: 6 },
      routeRunningMid: { mean: 78, std: 6 },
      routeRunningDeep: { mean: 70, std: 6 },
      release: { mean: 72, std: 6 },
      catchInTraffic: { mean: 75, std: 6 },
      spectacularCatch: { mean: 70, std: 6 }
    },
    archetypeMods: {
      slot_receiver: { agility: 10, routeRunningShort: 10 }
    }
  },

  TE: {
    attributes: g("core", "te"),
    base: {
      ...CORE_BASE,
      routeRunningShort: { mean: 70, std: 6 },
      routeRunningMid: { mean: 68, std: 6 },
      catchInTraffic: { mean: 78, std: 6 },
      spectacularCatch: { mean: 75, std: 6 },
      impactBlock: { mean: 75, std: 6 }
    },
    archetypeMods: {
      receiving_te: { routeRunningShort: 8, spectacularCatch: 8 },
      blocking_te: { impactBlock: 10, strength: 8 }
    }
  },

  // -----------------------------
  // OFFENSIVE LINE
  // -----------------------------
  LT: { attributes: g("core", "ol"), base: {}, archetypeMods: {} },
  LG: { attributes: g("core", "ol"), base: {}, archetypeMods: {} },
  C:  { attributes: g("core", "ol"), base: {}, archetypeMods: {} },
  RG: { attributes: g("core", "ol"), base: {}, archetypeMods: {} },
  RT: { attributes: g("core", "ol"), base: {}, archetypeMods: {} },

  // -----------------------------
  // DEFENSIVE FRONT
  // -----------------------------
  EDGE: { attributes: g("core", "dl"), base: {}, archetypeMods: {} },
  DE:   { attributes: g("core", "dl"), base: {}, archetypeMods: {} },
  DT_NT: { attributes: g("core", "dl"), base: {}, archetypeMods: {} },
  DT_3T: { attributes: g("core", "dl"), base: {}, archetypeMods: {} },

  // -----------------------------
  // LINEBACKERS
  // -----------------------------
  MLB: { attributes: g("core", "lb"), base: {}, archetypeMods: {} },
  OLB: { attributes: g("core", "lb"), base: {}, archetypeMods: {} },

  // -----------------------------
  // DEFENSIVE BACKS
  // -----------------------------
  CB:  { attributes: g("core", "db"), base: {}, archetypeMods: {} },
  NCB: { attributes: g("core", "db"), base: {}, archetypeMods: {} },
  FS:  { attributes: g("core", "db"), base: {}, archetypeMods: {} },
  SS:  { attributes: g("core", "db"), base: {}, archetypeMods: {} },

  // -----------------------------
  // SPECIAL TEAMS
  // -----------------------------
  K:  { attributes: g("core", "k"), base: {}, archetypeMods: {} },
  P:  { attributes: g("core", "p"), base: {}, archetypeMods: {} },
  LS: { attributes: g("core", "ls"), base: {}, archetypeMods: {} },
  KR: { attributes: g("core", "returner"), base: {}, archetypeMods: {} },
  PR: { attributes: g("core", "returner"), base: {}, archetypeMods: {} }
};
