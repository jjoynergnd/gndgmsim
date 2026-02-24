// src/generator/engines/playerPotential.ts

import type { Player } from "./playerGenerator.js";

export type PotentialGrade = "A" | "B" | "C" | "D" | "F";

export interface PotentialProfile {
  grade: PotentialGrade;
  ceilingBoost: number;   // max extra OVR they can grow
  volatility: number;     // how swingy yearly changes are (0–1)
}

export function assignPotential(player: Player): PotentialProfile {
  const { age, ratings, tier } = player;

  const athleticAvg =
    ((ratings.speed ?? 60) +
      (ratings.acceleration ?? 60) +
      (ratings.agility ?? 60)) / 3;

  const technicalAvg =
    ((ratings.awareness ?? 60) +
      (ratings.blockShed ?? 60) +
      (ratings.powerMoves ?? 60) +
      (ratings.finesseMoves ?? 60) +
      (ratings.throwAccuracyShort ?? 60)) / 5;

  const overall = ratings.overall ?? 60;

  // Baseline by tier
  let baseGrade: PotentialGrade = "C";
  if (tier === "superstar") baseGrade = "A";
  else if (tier === "star") baseGrade = "A";
  else if (tier === "solid") baseGrade = "B";
  else if (tier === "developmental") baseGrade = "A";
  else if (tier === "depth") baseGrade = "C";
  else if (tier === "fringe") baseGrade = "D";

  // Age adjustment
  if (age >= 28) {
    if (baseGrade === "A") baseGrade = "B";
    else if (baseGrade === "B") baseGrade = "C";
  } else if (age <= 23 && athleticAvg > technicalAvg + 5) {
    // Young, toolsy
    if (baseGrade === "B") baseGrade = "A";
    else if (baseGrade === "C") baseGrade = "B";
  }

  // Overall adjustment (very high OVR at young age = high ceiling)
  if (overall >= 88 && age <= 25) {
    baseGrade = "A";
  } else if (overall <= 65 && age >= 27) {
    baseGrade = "D";
  }

  let ceilingBoost = 0;
  let volatility = 0.2;

// Hard fail potential (F-tier)
if (
  age >= 30 &&
  athleticAvg < 55 &&
  overall < 65
) {
  baseGrade = "F";
}



  switch (baseGrade) {
    case "A":
      ceilingBoost = 10;
      volatility = 0.35;
      break;
    case "B":
      ceilingBoost = 7;
      volatility = 0.3;
      break;
    case "C":
      ceilingBoost = 4;
      volatility = 0.25;
      break;
    case "D":
      ceilingBoost = 2;
      volatility = 0.2;
      break;
    case "F":
      ceilingBoost = 0;
      volatility = 0.15;
      break;
  }

  return {
    grade: baseGrade,
    ceilingBoost,
    volatility
  };
}
