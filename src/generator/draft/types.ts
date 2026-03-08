// src/generator/draft/types.ts

import type { Position } from "../config/positions.js";

export type DraftPosition = Exclude<Position, "KR" | "PR">;
