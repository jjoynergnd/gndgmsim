import { Position } from "../generator/config/positions.js";


export const PHYSICAL_PROFILES = {
  QB: { heightMean: 75, heightStd: 1.5, weightMean: 220, weightStd: 10 },
  HB: { heightMean: 70, heightStd: 1.5, weightMean: 210, weightStd: 12 },
  FB: { heightMean: 71, heightStd: 1.5, weightMean: 240, weightStd: 12 },

  WR_X: { heightMean: 74, heightStd: 1.5, weightMean: 210, weightStd: 10 },
  WR_Z: { heightMean: 73, heightStd: 1.5, weightMean: 205, weightStd: 10 },
  WR_SLOT: { heightMean: 71, heightStd: 1.5, weightMean: 190, weightStd: 8 },

  TE: { heightMean: 77, heightStd: 1.5, weightMean: 250, weightStd: 15 },

  LT: { heightMean: 78, heightStd: 1.5, weightMean: 315, weightStd: 15 },
  LG: { heightMean: 76.5, heightStd: 1.5, weightMean: 315, weightStd: 15 },
  C:  { heightMean: 75.5, heightStd: 1.2, weightMean: 305, weightStd: 12 },
  RG: { heightMean: 76.5, heightStd: 1.5, weightMean: 315, weightStd: 15 },
  RT: { heightMean: 78, heightStd: 1.5, weightMean: 320, weightStd: 15 },

  EDGE: { heightMean: 76, heightStd: 1.5, weightMean: 255, weightStd: 12 },
  DE:   { heightMean: 76, heightStd: 1.5, weightMean: 275, weightStd: 12 },
  DT_NT: { heightMean: 74, heightStd: 1.2, weightMean: 330, weightStd: 15 },
  DT_3T: { heightMean: 75, heightStd: 1.2, weightMean: 305, weightStd: 15 },

  MLB: { heightMean: 74, heightStd: 1.5, weightMean: 240, weightStd: 10 },
  OLB: { heightMean: 75, heightStd: 1.5, weightMean: 235, weightStd: 10 },

  CB:  { heightMean: 71, heightStd: 1.5, weightMean: 195, weightStd: 8 },
  NCB: { heightMean: 70.5, heightStd: 1.5, weightMean: 190, weightStd: 8 },
  FS:  { heightMean: 72, heightStd: 1.5, weightMean: 200, weightStd: 8 },
  SS:  { heightMean: 72, heightStd: 1.5, weightMean: 210, weightStd: 8 },

  K:  { heightMean: 72, heightStd: 1.5, weightMean: 195, weightStd: 8 },
  P:  { heightMean: 74, heightStd: 1.5, weightMean: 205, weightStd: 8 },
  LS: { heightMean: 75, heightStd: 1.5, weightMean: 240, weightStd: 10 },
  KR: { heightMean: 70.5, heightStd: 1.5, weightMean: 190, weightStd: 8 },
  PR: { heightMean: 70, heightStd: 1.5, weightMean: 185, weightStd: 8 }
};