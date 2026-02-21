import type { Position } from "./positions.js";

export const PHYSICAL_PROFILES: Record<
  Position,
  {
    heightMean: number; // inches
    heightStd: number;
    weightMean: number;
    weightStd: number;
  }
> = {
  // Offense
  QB: { heightMean: 75, heightStd: 1.5, weightMean: 220, weightStd: 10 },

  // Halfback – feature back
  HB: { heightMean: 70, heightStd: 1.5, weightMean: 210, weightStd: 12 },

  // Fullback – shorter, thicker
  FB: { heightMean: 71, heightStd: 1.5, weightMean: 240, weightStd: 12 },

  // Wide receivers
  WR_X: { heightMean: 74, heightStd: 1.5, weightMean: 210, weightStd: 10 },   // boundary, physical
  WR_Z: { heightMean: 73, heightStd: 1.5, weightMean: 205, weightStd: 10 },   // flanker
  WR_SLOT: { heightMean: 71, heightStd: 1.5, weightMean: 190, weightStd: 8 }, // smaller, quicker

  // Tight end
  TE: { heightMean: 77, heightStd: 1.5, weightMean: 250, weightStd: 15 },

  // Offensive line
  LT: { heightMean: 78, heightStd: 1.5, weightMean: 315, weightStd: 15 },
  LG: { heightMean: 76.5, heightStd: 1.5, weightMean: 315, weightStd: 15 },
  C:  { heightMean: 75.5, heightStd: 1.2, weightMean: 305, weightStd: 12 },
  RG: { heightMean: 76.5, heightStd: 1.5, weightMean: 315, weightStd: 15 },
  RT: { heightMean: 78, heightStd: 1.5, weightMean: 320, weightStd: 15 },

  // Defensive front
  EDGE: { heightMean: 76, heightStd: 1.5, weightMean: 255, weightStd: 12 }, // modern edge rusher
  DE:   { heightMean: 76, heightStd: 1.5, weightMean: 275, weightStd: 12 }, // hand-in-dirt end
  DT_NT: { heightMean: 74, heightStd: 1.2, weightMean: 330, weightStd: 15 }, // nose tackle
  DT_3T: { heightMean: 75, heightStd: 1.2, weightMean: 305, weightStd: 15 }, // 3-tech penetrator

  // Linebackers
  MLB: { heightMean: 74, heightStd: 1.5, weightMean: 240, weightStd: 10 },
  OLB: { heightMean: 75, heightStd: 1.5, weightMean: 235, weightStd: 10 },

  // Secondary
  CB:  { heightMean: 71, heightStd: 1.5, weightMean: 195, weightStd: 8 },
  NCB: { heightMean: 70.5, heightStd: 1.5, weightMean: 190, weightStd: 8 },
  FS:  { heightMean: 72, heightStd: 1.5, weightMean: 200, weightStd: 8 },
  SS:  { heightMean: 72, heightStd: 1.5, weightMean: 210, weightStd: 8 },

  // Special teams
  K:  { heightMean: 72, heightStd: 1.5, weightMean: 195, weightStd: 8 },
  P:  { heightMean: 74, heightStd: 1.5, weightMean: 205, weightStd: 8 },
  LS: { heightMean: 75, heightStd: 1.5, weightMean: 240, weightStd: 10 },
  KR: { heightMean: 70.5, heightStd: 1.5, weightMean: 190, weightStd: 8 },
  PR: { heightMean: 70, heightStd: 1.5, weightMean: 185, weightStd: 8 }
};
