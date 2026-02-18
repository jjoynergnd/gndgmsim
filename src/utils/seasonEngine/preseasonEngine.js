// src/utils/seasonEngine/preseasonEngine.js

import { PRESEASON_WEEKS } from "./constants";
import { simulateGamesForWeek } from "./gameSimEngine";

/* ======================================================
   PRESEASON
====================================================== */

export function simulatePreseasonWeek(season, context) {
  const week = season.preseasonWeek;
  const key = `PRESEASON-${week}`;

  if (season.gamesByKey[key]) {
    console.log("[seasonEngine] Preseason week already simulated:", week);
    advanceFromPreseasonIfDone(season);
    return;
  }

  const games = simulateGamesForWeek(
    season,
    {
      week,
      type: "PRESEASON",
      affectStandings: false
    },
    context
  );

  season.gamesByKey[key] = games;

  season.lastResult = {
    summary: `Preseason Week ${week} complete`,
    details: `${games.length} games played`
  };

  if (week < PRESEASON_WEEKS) {
    season.preseasonWeek += 1;
  } else {
    season.phase = "REGULAR_SEASON";
    season.week = 1;
    season.lastResult = {
      summary: "Preseason complete",
      details: "Ready to begin Week 1."
    };
  }
}

function advanceFromPreseasonIfDone(season) {
  if (season.preseasonWeek >= PRESEASON_WEEKS) {
    season.phase = "REGULAR_SEASON";
    season.week = 1;
    season.lastResult = {
      summary: "Preseason complete",
      details: "Ready to begin Week 1."
    };
  } else {
    season.preseasonWeek += 1;
  }
}
