// src/generator/config/schemeProfiles.ts

import type { Position } from "./positions.js";

/*
  Option C Hybrid Scheme Taxonomy
  - Authentic NFL schemes
  - Grouped into clean categories
  - Each scheme defines attribute weights per position
  - Scheme fit = Σ(attribute * weight)
*/

export type OffensiveScheme =
  | "west_coast"
  | "vertical"
  | "spread"
  | "power_run"
  | "zone_run"
  | "rpo"
  | "play_action";

export type DefensiveScheme =
  | "four_three_over"
  | "four_three_under"
  | "three_four_base"
  | "three_four_hybrid"
  | "nickel_heavy"
  | "man_match"
  | "zone_match"
  | "blitz_heavy";

export type Scheme = OffensiveScheme | DefensiveScheme;

// ------------------------------------------------------------
// Helper: define weights for a single position in a scheme
// ------------------------------------------------------------
type SchemeWeights = Record<string, number>;

// ------------------------------------------------------------
// Offensive Scheme Profiles
// ------------------------------------------------------------
export const OFFENSIVE_SCHEME_PROFILES: Record<
  OffensiveScheme,
  Partial<Record<Position, SchemeWeights>>
> = {
  west_coast: {
    QB: {
      throwAccuracyShort: 0.30,
      awareness: 0.25,
      throwOnRun: 0.20,
      playAction: 0.15,
      agility: 0.10
    },
    WR_X: {
      routeRunningShort: 0.30,
      release: 0.25,
      catchInTraffic: 0.25,
      awareness: 0.20
    },
    WR_Z: {
      routeRunningShort: 0.30,
      routeRunningMid: 0.25,
      release: 0.20,
      speed: 0.15,
      awareness: 0.10
    },
    WR_SLOT: {
      routeRunningShort: 0.35,
      agility: 0.25,
      acceleration: 0.20,
      awareness: 0.20
    },
    HB: {
      catching: 0.30,
      elusiveness: 0.25,
      acceleration: 0.20,
      breakTackle: 0.15,
      awareness: 0.10
    }
  },

  vertical: {
    QB: {
      throwPower: 0.30,
      throwAccuracyDeep: 0.30,
      awareness: 0.20,
      playAction: 0.20
    },
    WR_X: {
      routeRunningDeep: 0.35,
      speed: 0.25,
      spectacularCatch: 0.20,
      release: 0.20
    },
    WR_Z: {
      routeRunningDeep: 0.35,
      speed: 0.30,
      catchInTraffic: 0.20,
      release: 0.15
    },
    TE: {
      spectacularCatch: 0.30,
      catchInTraffic: 0.30,
      routeRunningMid: 0.20,
      awareness: 0.20
    }
  },

  spread: {
    QB: {
      throwAccuracyShort: 0.30,
      throwAccuracyMid: 0.25,
      agility: 0.20,
      throwOnRun: 0.15,
      awareness: 0.10
    },
    WR_SLOT: {
      agility: 0.30,
      acceleration: 0.25,
      routeRunningShort: 0.25,
      awareness: 0.20
    },
    WR_Z: {
      speed: 0.30,
      routeRunningMid: 0.25,
      agility: 0.20,
      release: 0.15,
      awareness: 0.10
    }
  },

  power_run: {
    HB: {
      trucking: 0.35,
      breakTackle: 0.30,
      strength: 0.20,
      ballSecurity: 0.15
    },
    FB: {
      impactBlock: 0.40,
      strength: 0.30,
      trucking: 0.20,
      breakTackle: 0.10
    },
    LG: {
      runBlock: 0.40,
      runBlockFootwork: 0.30,
      strength: 0.20,
      awareness: 0.10
    },
    RG: {
      runBlock: 0.40,
      runBlockFootwork: 0.30,
      strength: 0.20,
      awareness: 0.10
    }
  },

  zone_run: {
    HB: {
      elusiveness: 0.30,
      acceleration: 0.25,
      agility: 0.25,
      breakTackle: 0.20
    },
    LT: {
      runBlockFootwork: 0.35,
      agility: 0.25,
      runBlock: 0.25,
      awareness: 0.15
    },
    LG: {
      runBlockFootwork: 0.35,
      agility: 0.25,
      runBlock: 0.25,
      awareness: 0.15
    }
  },

  rpo: {
    QB: {
      throwAccuracyShort: 0.30,
      agility: 0.25,
      acceleration: 0.20,
      throwOnRun: 0.15,
      awareness: 0.10
    },
    HB: {
      acceleration: 0.30,
      elusiveness: 0.25,
      agility: 0.25,
      breakTackle: 0.20
    },
    WR_SLOT: {
      acceleration: 0.30,
      agility: 0.25,
      routeRunningShort: 0.25,
      awareness: 0.20
    }
  },

  play_action: {
    QB: {
      playAction: 0.35,
      throwAccuracyMid: 0.25,
      awareness: 0.20,
      throwAccuracyDeep: 0.20
    },
    WR_X: {
      routeRunningDeep: 0.30,
      spectacularCatch: 0.25,
      release: 0.25,
      awareness: 0.20
    },
    TE: {
      catchInTraffic: 0.30,
      spectacularCatch: 0.25,
      routeRunningShort: 0.25,
      awareness: 0.20
    }
  }
};

// ------------------------------------------------------------
// Defensive Scheme Profiles
// ------------------------------------------------------------
export const DEFENSIVE_SCHEME_PROFILES: Record<
  DefensiveScheme,
  Partial<Record<Position, SchemeWeights>>
> = {
  four_three_over: {
    DE: {
      powerMoves: 0.30,
      blockShed: 0.30,
      strength: 0.20,
      pursuit: 0.20
    },
    DT_3T: {
      powerMoves: 0.35,
      finesseMoves: 0.25,
      blockShed: 0.20,
      pursuit: 0.20
    }
  },

  four_three_under: {
    EDGE: {
      finesseMoves: 0.35,
      speed: 0.25,
      pursuit: 0.20,
      blockShed: 0.20
    },
    DT_NT: {
      strength: 0.35,
      blockShed: 0.35,
      powerMoves: 0.20,
      pursuit: 0.10
    }
  },

  three_four_base: {
    DT_NT: {
      strength: 0.40,
      blockShed: 0.35,
      powerMoves: 0.15,
      pursuit: 0.10
    },
    OLB: {
      blockShed: 0.30,
      powerMoves: 0.25,
      pursuit: 0.25,
      tackling: 0.20
    }
  },

  three_four_hybrid: {
    EDGE: {
      finesseMoves: 0.30,
      powerMoves: 0.25,
      pursuit: 0.25,
      speed: 0.20
    },
    MLB: {
      awareness: 0.30,
      tackling: 0.25,
      pursuit: 0.25,
      zoneCoverage: 0.20
    }
  },

  nickel_heavy: {
    CB: {
      manCoverage: 0.30,
      zoneCoverage: 0.25,
      press: 0.20,
      playRecognition: 0.15,
      speed: 0.10
    },
    NCB: {
      agility: 0.30,
      manCoverage: 0.25,
      zoneCoverage: 0.20,
      playRecognition: 0.15,
      speed: 0.10
    }
  },

  man_match: {
    CB: {
      manCoverage: 0.40,
      press: 0.30,
      speed: 0.20,
      playRecognition: 0.10
    }
  },

  zone_match: {
    FS: {
      zoneCoverage: 0.40,
      playRecognition: 0.30,
      speed: 0.20,
      tackling: 0.10
    },
    SS: {
      zoneCoverage: 0.35,
      tackling: 0.25,
      playRecognition: 0.25,
      manCoverage: 0.15
    }
  },

  blitz_heavy: {
    EDGE: {
      speed: 0.30,
      finesseMoves: 0.30,
      pursuit: 0.20,
      powerMoves: 0.20
    },
    MLB: {
      pursuit: 0.30,
      tackling: 0.25,
      blockShed: 0.25,
      awareness: 0.20
    }
  }
};
