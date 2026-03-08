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

export function seedFutureDraftClasses(startYear: number, yearsAhead: number) {
  const league = loadLeague();

  if (!league.draftClasses) {
    league.draftClasses = {};
  }
  if (!league.draft) {
    league.draft = {};
  }

  for (let year = startYear; year < startYear + yearsAhead; year++) {
    if (!league.draftClasses[String(year)]) {
      console.log(`Generating draft class for ${year}...`);
      league.draftClasses[String(year)] = generateDraftClass(year);
    } else {
      console.log(`Draft class for ${year} already exists, skipping.`);
    }
  }

  league.draft.currentYear = startYear;
  league.draft.currentClass = String(startYear);

  saveLeague(league);
  console.log(`Seeded draft classes ${startYear}–${startYear + yearsAhead - 1}`);
}