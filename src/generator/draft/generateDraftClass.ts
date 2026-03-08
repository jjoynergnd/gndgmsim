import type { ProspectState } from "../../state/prospect.js";
import { POSITIONS } from "../config/positions.js";
import type { DraftPosition } from "./types.js";
import { generateProspect } from "./generateProspect.js";

const POSITION_DISTRIBUTION: Record<DraftPosition, number> = {
  QB: 12,
  HB: 15,
  FB: 3,
  WR_X: 18,
  WR_Z: 18,
  WR_SLOT: 18,
  TE: 12,
  LT: 10,
  LG: 10,
  C: 10,
  RG: 10,
  RT: 10,
  EDGE: 18,
  DE: 12,
  DT_NT: 8,
  DT_3T: 8,
  MLB: 10,
  OLB: 12,
  CB: 20,
  NCB: 10,
  FS: 8,
  SS: 8,
  K: 4,
  P: 4,
  LS: 4,
};

export function generateDraftClass(year: number): ProspectState[] {
  const prospects: ProspectState[] = [];

  const draftPositions = Object.keys(POSITIONS)
    .filter((p): p is DraftPosition => p !== "KR" && p !== "PR");

  for (const pos of draftPositions) {
    const count = POSITION_DISTRIBUTION[pos];
    for (let i = 0; i < count; i++) {
      prospects.push(generateProspect(pos, year));
    }
  }

  prospects.sort((a, b) => {
    const aScore = (a.ratings.ovr ?? 0) + a.potential.ceilingBoost;
    const bScore = (b.ratings.ovr ?? 0) + b.potential.ceilingBoost;
    return bScore - aScore;
  });

  prospects.forEach((p, i) => {
    p.draft.bigBoardRank = i + 1;
  });

  const byPos: Record<string, ProspectState[]> = {};

  for (const p of prospects) {
    if (!byPos[p.position]) byPos[p.position] = [];
    byPos[p.position].push(p);
  }

  for (const pos of Object.keys(byPos)) {
    byPos[pos].sort((a, b) => (b.ratings.ovr ?? 0) - (a.ratings.ovr ?? 0));
    byPos[pos].forEach((p, i) => {
      p.draft.positionalRank = i + 1;
    });
  }

  return prospects;
}