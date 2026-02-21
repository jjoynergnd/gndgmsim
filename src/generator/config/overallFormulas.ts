// src/generator/config/overallFormulas.ts

import type { Position } from "./positions.js";

export const OVERALL_FORMULAS: Record<
  Position,
  Record<string, number>
> = {
  // ---------------------------------------
  // OFFENSE
  // ---------------------------------------

  QB: {
    throwAccuracyShort: 0.18,
    throwAccuracyMid: 0.18,
    throwAccuracyDeep: 0.14,
    throwPower: 0.12,
    awareness: 0.18,
    throwOnRun: 0.10,
    playAction: 0.10
  },

  HB: {
    breakTackle: 0.20,
    elusiveness: 0.20,
    speed: 0.15,
    acceleration: 0.15,
    ballSecurity: 0.15,
    trucking: 0.10,
    catching: 0.05
  },

  FB: {
    impactBlock: 0.30,
    strength: 0.20,
    trucking: 0.15,
    breakTackle: 0.15,
    awareness: 0.10,
    speed: 0.10
  },

  WR_X: {
    routeRunningDeep: 0.20,
    catchInTraffic: 0.20,
    spectacularCatch: 0.15,
    release: 0.15,
    speed: 0.15,
    routeRunningMid: 0.15
  },

  WR_Z: {
    routeRunningMid: 0.20,
    routeRunningDeep: 0.20,
    speed: 0.20,
    release: 0.15,
    catchInTraffic: 0.15,
    spectacularCatch: 0.10
  },

  WR_SLOT: {
    routeRunningShort: 0.25,
    agility: 0.20,
    acceleration: 0.20,
    catchInTraffic: 0.15,
    awareness: 0.10,
    release: 0.10
  },

  TE: {
    catchInTraffic: 0.25,
    spectacularCatch: 0.15,
    routeRunningShort: 0.15,
    impactBlock: 0.20,
    strength: 0.15,
    awareness: 0.10
  },

  // Offensive Line
  LT: {
    passBlock: 0.35,
    passBlockFootwork: 0.25,
    runBlock: 0.20,
    runBlockFootwork: 0.10,
    strength: 0.10
  },
  LG: {
    runBlock: 0.35,
    runBlockFootwork: 0.25,
    passBlock: 0.20,
    passBlockFootwork: 0.10,
    strength: 0.10
  },
  C: {
    awareness: 0.25,
    runBlock: 0.25,
    passBlock: 0.25,
    impactBlock: 0.15,
    strength: 0.10
  },
  RG: {
    runBlock: 0.35,
    runBlockFootwork: 0.25,
    passBlock: 0.20,
    passBlockFootwork: 0.10,
    strength: 0.10
  },
  RT: {
    passBlock: 0.35,
    passBlockFootwork: 0.25,
    runBlock: 0.20,
    runBlockFootwork: 0.10,
    strength: 0.10
  },

  // ---------------------------------------
  // DEFENSE
  // ---------------------------------------

  EDGE: {
    finesseMoves: 0.25,
    powerMoves: 0.20,
    blockShed: 0.20,
    pursuit: 0.15,
    speed: 0.10,
    tackling: 0.10
  },

  DE: {
    powerMoves: 0.25,
    blockShed: 0.25,
    strength: 0.20,
    pursuit: 0.15,
    tackling: 0.15
  },

  DT_NT: {
    strength: 0.30,
    blockShed: 0.30,
    powerMoves: 0.20,
    pursuit: 0.10,
    tackling: 0.10
  },

  DT_3T: {
    powerMoves: 0.30,
    finesseMoves: 0.25,
    blockShed: 0.20,
    pursuit: 0.15,
    tackling: 0.10
  },

  MLB: {
    tackling: 0.25,
    pursuit: 0.20,
    awareness: 0.20,
    blockShed: 0.15,
    zoneCoverage: 0.10,
    manCoverage: 0.10
  },

  OLB: {
    pursuit: 0.25,
    tackling: 0.20,
    blockShed: 0.20,
    zoneCoverage: 0.15,
    manCoverage: 0.10,
    awareness: 0.10
  },

  CB: {
    manCoverage: 0.30,
    zoneCoverage: 0.25,
    press: 0.20,
    playRecognition: 0.15,
    speed: 0.10
  },

  NCB: {
    manCoverage: 0.30,
    zoneCoverage: 0.25,
    agility: 0.20,
    playRecognition: 0.15,
    speed: 0.10
  },

  FS: {
    zoneCoverage: 0.30,
    playRecognition: 0.25,
    speed: 0.15,
    manCoverage: 0.15,
    tackling: 0.15
  },

  SS: {
    tackling: 0.30,
    playRecognition: 0.20,
    zoneCoverage: 0.20,
    manCoverage: 0.15,
    strength: 0.15
  },

  // ---------------------------------------
  // SPECIAL TEAMS
  // ---------------------------------------

  K: {
    kickPower: 0.50,
    kickAccuracy: 0.50
  },

  P: {
    puntPower: 0.50,
    puntAccuracy: 0.50
  },

  LS: {
    snapAccuracy: 0.60,
    snapSpeed: 0.40
  },

  KR: {
    returnAbility: 0.50,
    speed: 0.25,
    acceleration: 0.25
  },

  PR: {
    returnAbility: 0.50,
    agility: 0.25,
    acceleration: 0.25
  }
};
