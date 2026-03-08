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

export function advanceDraftYear() {
  const league = loadLeague();

  if (!league.draft || !league.draft.currentYear) {
    throw new Error("league.draft.currentYear is not set.");
  }

  const currentYear: number = league.draft.currentYear;
  const nextYear = currentYear + 1;

  if (!league.draftClasses) {
    league.draftClasses = {};
  }

  // Remove the class that was just drafted
  delete league.draftClasses[String(currentYear)];

  // Ensure nextYear exists as the new current class
  if (!league.draftClasses[String(nextYear)]) {
    console.log(`No draft class for ${nextYear} found, generating...`);
    league.draftClasses[String(nextYear)] = generateDraftClass(nextYear);
  }

  // Determine furthest future year we currently have
  const years = Object.keys(league.draftClasses).map((y) => Number(y));
  const maxYear = years.length ? Math.max(...years) : nextYear;

  const newFutureYear = maxYear + 1;

  // Generate one new future class (keep pipeline 4 years deep)
  console.log(`Generating new future draft class for ${newFutureYear}...`);
  league.draftClasses[String(newFutureYear)] = generateDraftClass(newFutureYear);

  league.draft.currentYear = nextYear;
  league.draft.currentClass = String(nextYear);

  saveLeague(league);
  console.log(`Advanced draft from ${currentYear} to ${nextYear}.`);
}