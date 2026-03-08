import fs from "fs";
import path from "path";
import { generateDraftClass } from "./generateDraftClass.js";

const LEAGUE_PATH = path.resolve("src/data/league/league.json");

export function saveDraftClass(year: number) {
  // Load league.json
  const raw = fs.readFileSync(LEAGUE_PATH, "utf8");
  const league = JSON.parse(raw);

  // Generate the class
  const draftClass = generateDraftClass(year);

  // Ensure container exists
  if (!league.draftClasses) {
    league.draftClasses = {};
  }

  // Save it
  league.draftClasses[String(year)] = draftClass;

  // Write back to disk
  fs.writeFileSync(LEAGUE_PATH, JSON.stringify(league, null, 2));

  console.log(`Draft class for ${year} saved to league.json`);
}