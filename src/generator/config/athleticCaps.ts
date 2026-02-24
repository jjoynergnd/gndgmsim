// src/generator/config/athleticCaps.ts

import type { Position } from "./positions.js";

/*
  Athletic caps ensure realistic physical attributes.
  These override default means/std for core athletic traits.
*/

export interface AthleticCaps {
  speed: { mean: number; std: number };
  acceleration: { mean: number; std: number };
  agility: { mean: number; std: number };
}

export const ATHLETIC_CAPS: Record<Position, AthleticCaps> = {
  // -------------------------
  // OFFENSE
  // -------------------------

  QB: {
    speed: { mean: 70, std: 6 },
    acceleration: { mean: 72, std: 6 },
    agility: { mean: 70, std: 6 }
  },

  HB: {
    speed: { mean: 88, std: 5 },
    acceleration: { mean: 90, std: 5 },
    agility: { mean: 86, std: 5 }
  },

  FB: {
    speed: { mean: 72, std: 5 },
    acceleration: { mean: 74, std: 5 },
    agility: { mean: 68, std: 5 }
  },

  WR_X: {
    speed: { mean: 90, std: 4 },
    acceleration: { mean: 92, std: 4 },
    agility: { mean: 88, std: 4 }
  },

  WR_Z: {
    speed: { mean: 92, std: 4 },
    acceleration: { mean: 94, std: 4 },
    agility: { mean: 90, std: 4 }
  },

  WR_SLOT: {
    speed: { mean: 88, std: 4 },
    acceleration: { mean: 94, std: 4 },
    agility: { mean: 92, std: 4 }
  },

  TE: {
    speed: { mean: 78, std: 5 },
    acceleration: { mean: 80, std: 5 },
    agility: { mean: 74, std: 5 }
  },

  // Offensive Line
  LT: {
    speed: { mean: 55, std: 4 },
    acceleration: { mean: 60, std: 4 },
    agility: { mean: 55, std: 4 }
  },
  LG: {
    speed: { mean: 52, std: 4 },
    acceleration: { mean: 58, std: 4 },
    agility: { mean: 52, std: 4 }
  },
  C: {
    speed: { mean: 50, std: 4 },
    acceleration: { mean: 56, std: 4 },
    agility: { mean: 50, std: 4 }
  },
  RG: {
    speed: { mean: 52, std: 4 },
    acceleration: { mean: 58, std: 4 },
    agility: { mean: 52, std: 4 }
  },
  RT: {
    speed: { mean: 55, std: 4 },
    acceleration: { mean: 60, std: 4 },
    agility: { mean: 55, std: 4 }
  },

  // -------------------------
  // DEFENSE
  // -------------------------

  EDGE: {
    speed: { mean: 78, std: 5 },
    acceleration: { mean: 82, std: 5 },
    agility: { mean: 76, std: 5 }
  },

  DE: {
    speed: { mean: 70, std: 5 },
    acceleration: { mean: 74, std: 5 },
    agility: { mean: 68, std: 5 }
  },

  DT_NT: {
    speed: { mean: 50, std: 4 },
    acceleration: { mean: 54, std: 4 },
    agility: { mean: 48, std: 4 }
  },

  DT_3T: {
    speed: { mean: 60, std: 5 },
    acceleration: { mean: 64, std: 5 },
    agility: { mean: 58, std: 5 }
  },

  MLB: {
    speed: { mean: 78, std: 5 },
    acceleration: { mean: 82, std: 5 },
    agility: { mean: 76, std: 5 }
  },

  OLB: {
    speed: { mean: 80, std: 5 },
    acceleration: { mean: 84, std: 5 },
    agility: { mean: 78, std: 5 }
  },

  CB: {
    speed: { mean: 92, std: 4 },
    acceleration: { mean: 94, std: 4 },
    agility: { mean: 92, std: 4 }
  },

  NCB: {
    speed: { mean: 90, std: 4 },
    acceleration: { mean: 94, std: 4 },
    agility: { mean: 94, std: 4 }
  },

  FS: {
    speed: { mean: 88, std: 4 },
    acceleration: { mean: 92, std: 4 },
    agility: { mean: 88, std: 4 }
  },

  SS: {
    speed: { mean: 86, std: 4 },
    acceleration: { mean: 90, std: 4 },
    agility: { mean: 84, std: 4 }
  },

  // -------------------------
  // SPECIAL TEAMS
  // -------------------------

  K: {
    speed: { mean: 60, std: 5 },
    acceleration: { mean: 62, std: 5 },
    agility: { mean: 60, std: 5 }
  },

  P: {
    speed: { mean: 60, std: 5 },
    acceleration: { mean: 62, std: 5 },
    agility: { mean: 60, std: 5 }
  },

  LS: {
    speed: { mean: 55, std: 4 },
    acceleration: { mean: 58, std: 4 },
    agility: { mean: 55, std: 4 }
  },

  KR: {
    speed: { mean: 94, std: 4 },
    acceleration: { mean: 96, std: 4 },
    agility: { mean: 94, std: 4 }
  },

  PR: {
    speed: { mean: 92, std: 4 },
    acceleration: { mean: 96, std: 4 },
    agility: { mean: 96, std: 4 }
  }
};
