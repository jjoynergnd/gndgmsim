import fs from "fs";
import path from "path";
import { generatePlayer } from "./engines/playerGenerator.js";
import type { Position } from "./config/positions.js";

const TEST_POSITIONS: Position[] = [
  "QB", "HB", "FB", "WR_X", "WR_Z", "WR_SLOT", "TE", "LT", "LG", "C", "RG", "RT", "EDGE", "DE", "DT_NT", "DT_3T", "MLB", "OLB", "CB", "NCB", "FS", "SS", "K", "P", "LS", "KR", "PR"
];

const roster = TEST_POSITIONS.map(pos =>
  generatePlayer(pos)
);

const outputPath = path.join(
  process.cwd(),
  "src/data/rosters/TEST.json"
);

fs.writeFileSync(outputPath, JSON.stringify(roster, null, 2));

console.log("✅ Test roster generated");
