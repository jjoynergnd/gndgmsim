import fs from "fs";
import path from "path";

const LEAGUE_PATH = path.resolve("src/data/league/league.json");

function loadLeague() {
  const raw = fs.readFileSync(LEAGUE_PATH, "utf8");
  return JSON.parse(raw);
}

function saveLeague(league: any) {
  fs.writeFileSync(LEAGUE_PATH, JSON.stringify(league, null, 2));
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export function progressFutureDraftClasses() {
  const league = loadLeague();

  if (!league.draft || !league.draft.currentYear) {
    throw new Error("league.draft.currentYear is not set.");
  }

  const currentYear: number = league.draft.currentYear;

  if (!league.draftClasses) return;

  const years = Object.keys(league.draftClasses)
    .map((y) => Number(y))
    .filter((y) => y > currentYear); // only future classes

  for (const year of years) {
    const cls = league.draftClasses[String(year)];
    console.log(`Progressing future draft class ${year} (${cls.length} prospects)...`);

    for (const prospect of cls) {
      // Simple placeholder dev: small random bump to OVR + a few key ratings
      if (!prospect.ratings) continue;

      const devFactor = Math.random() * 3; // 0–3 points
      const keys = ["ovr", "speed", "accel", "agility", "strength", "awareness"];

      for (const key of keys) {
        const base = prospect.ratings[key] ?? 60;
        const updated = clamp(base + devFactor, 40, 99);
        prospect.ratings[key] = updated;
      }

      // You could also tweak draft stock, storylines, etc. here later.
    }
  }

  saveLeague(league);
  console.log("Progressed all future draft classes.");
}