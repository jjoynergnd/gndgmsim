// Expanded, future-proof position model with football-unit grouping

export type Position =
  // Offense
  | "QB"
  | "HB"
  | "FB"
  | "WR_X"
  | "WR_Z"
  | "WR_SLOT"
  | "TE"
  | "LT"
  | "LG"
  | "C"
  | "RG"
  | "RT"
  // Defense – front
  | "EDGE"
  | "DE"
  | "DT_NT"
  | "DT_3T"
  // Linebackers
  | "MLB"
  | "OLB"
  // Secondary
  | "CB"
  | "NCB"
  | "FS"
  | "SS"
  // Special teams
  | "K"
  | "P"
  | "LS"
  | "KR"
  | "PR";

export type PositionUnit = "offense" | "defense" | "special";

export interface PositionMeta {
  unit: PositionUnit;
  family: string; // e.g. "WR", "OL", "DL", "LB", "DB", "ST"
}

// Flat map used by existing engine
export const POSITIONS: Record<Position, PositionMeta> = {
  // Offense
  QB:   { unit: "offense", family: "QB" },
  HB:   { unit: "offense", family: "RB" },
  FB:   { unit: "offense", family: "RB" },
  WR_X: { unit: "offense", family: "WR" },
  WR_Z: { unit: "offense", family: "WR" },
  WR_SLOT: { unit: "offense", family: "WR" },
  TE:   { unit: "offense", family: "TE" },
  LT:   { unit: "offense", family: "OL" },
  LG:   { unit: "offense", family: "OL" },
  C:    { unit: "offense", family: "OL" },
  RG:   { unit: "offense", family: "OL" },
  RT:   { unit: "offense", family: "OL" },

  // Defense – front
  EDGE:  { unit: "defense", family: "DL" },
  DE:    { unit: "defense", family: "DL" },
  DT_NT: { unit: "defense", family: "DL" },
  DT_3T: { unit: "defense", family: "DL" },

  // Linebackers
  MLB: { unit: "defense", family: "LB" },
  OLB: { unit: "defense", family: "LB" },

  // Secondary
  CB:  { unit: "defense", family: "DB" },
  NCB: { unit: "defense", family: "DB" },
  FS:  { unit: "defense", family: "DB" },
  SS:  { unit: "defense", family: "DB" },

  // Special teams
  K:  { unit: "special", family: "ST" },
  P:  { unit: "special", family: "ST" },
  LS: { unit: "special", family: "ST" },
  KR: { unit: "special", family: "ST" },
  PR: { unit: "special", family: "ST" }
};

// Optional: grouped view for future logic (not used by engine yet)
export const POSITION_UNITS = {
  offense: {
    QB: ["QB"],
    RB: ["HB", "FB"],
    WR: ["WR_X", "WR_Z", "WR_SLOT"],
    TE: ["TE"],
    OL: ["LT", "LG", "C", "RG", "RT"]
  },
  defense: {
    DL: ["EDGE", "DE", "DT_NT", "DT_3T"],
    LB: ["MLB", "OLB"],
    DB: ["CB", "NCB", "FS", "SS"]
  },
  special: {
    ST: ["K", "P", "LS", "KR", "PR"]
  }
} as const;
