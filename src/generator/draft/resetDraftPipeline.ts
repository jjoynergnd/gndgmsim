import fs from "fs";
import path from "path";
import { generateDraftClass } from "./generateDraftClass.js";

const LEAGUE_PATH = path.resolve("src/data/league/league.json");

function loadLeague() {
  const raw = fs.readFileSync(LEAGUE_PATH, "utf8");
  return JSON.parse(raw);
}

function saveLeague(league: any) {
  fs.writeFileSync(LEAGUE_PATH, JSON.stringify(league, null, 2));
}

export function resetDraftPipeline(startYear: number = 2026, yearsAhead: number = 4) {
  const league = loadLeague();

  // Reset containers
  league.draft = {
    currentYear: startYear,
    currentClass: String(startYear),
  };

  league.draftClasses = {};

  // Regenerate fresh multi-year classes
  for (let year = startYear; year < startYear + yearsAhead; year++) {
    console.log(`Generating draft class for ${year}...`);
    league.draftClasses[String(year)] = generateDraftClass(year);
  }

  saveLeague(league);
  console.log(`Draft pipeline reset. Classes ${startYear}–${startYear + yearsAhead - 1} regenerated.`);
}