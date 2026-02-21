// All attribute groups used across the league.
// These are NOT position-specific yet — just the full attribute pool.

export const ATTRIBUTE_GROUPS = {
  core: [
    "speed",
    "acceleration",
    "agility",
    "strength",
    "awareness"
  ],

  qb: [
    "throwPower",
    "throwAccuracyShort",
    "throwAccuracyMid",
    "throwAccuracyDeep",
    "throwOnRun",
    "playAction"
  ],

  rb: [
    "breakTackle",
    "trucking",
    "elusiveness",
    "ballSecurity",
    "catching"
  ],

  wr: [
    "routeRunningShort",
    "routeRunningMid",
    "routeRunningDeep",
    "release",
    "catchInTraffic",
    "spectacularCatch"
  ],

  te: [
    "routeRunningShort",
    "routeRunningMid",
    "catchInTraffic",
    "spectacularCatch",
    "impactBlock"
  ],

  ol: [
    "passBlock",
    "passBlockFootwork",
    "runBlock",
    "runBlockFootwork",
    "impactBlock"
  ],

  dl: [
    "blockShed",
    "powerMoves",
    "finesseMoves",
    "pursuit",
    "tackling"
  ],

  lb: [
    "tackling",
    "pursuit",
    "zoneCoverage",
    "manCoverage",
    "blockShed"
  ],

  db: [
    "manCoverage",
    "zoneCoverage",
    "press",
    "playRecognition",
    "tackling"
  ],

  k: [
    "kickPower",
    "kickAccuracy"
  ],

  p: [
    "puntPower",
    "puntAccuracy"
  ],

  returner: [
    "returnAbility",
    "ballSecurity",
    "acceleration"
  ],

  ls: [
    "snapAccuracy",
    "snapSpeed"
  ]
} as const;

export type Attribute = typeof ATTRIBUTE_GROUPS[keyof typeof ATTRIBUTE_GROUPS][number];
