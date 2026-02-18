// src/utils/seasonEngine/regularSeasonEngine.js

import { REGULAR_SEASON_WEEKS, PLAYOFF_ROUNDS } from "./constants";
import { simulateGamesForWeek } from "./gameSimEngine";

/* ======================================================
   REGULAR SEASON
====================================================== */

export function simulateRegularSeasonWeek(season, context) {
  const week = season.week;
  const key = `REGULAR_SEASON-${week}`;

  if (season.gamesByKey[key]) {
    console.log("[seasonEngine] Regular season week already simulated:", week);
    advanceFromRegularSeasonIfDone(season);
    return;
  }

  const games = simulateGamesForWeek(
    season,
    {
      week,
      type: "REGULAR_SEASON",
      affectStandings: true
    },
    context
  );

  season.gamesByKey[key] = games;

  season.lastResult = {
    summary: `Week ${week} complete`,
    details: `${games.length} games played`
  };

  if (week < REGULAR_SEASON_WEEKS) {
    season.week += 1;
  } else {
    season.phase = "PLAYOFFS";
    season.week = null;
    season.playoffRound = PLAYOFF_ROUNDS[0];
    season.lastResult = {
      summary: "Regular season complete",
      details: "Playoffs begin."
    };
  }
}

function advanceFromRegularSeasonIfDone(season) {
  if (season.week >= REGULAR_SEASON_WEEKS) {
    season.phase = "PLAYOFFS";
    season.week = null;
    season.playoffRound = PLAYOFF_ROUNDS[0];
    season.lastResult = {
      summary: "Regular season complete",
      details: "Playoffs begin."
    };
  } else {
    season.week += 1;
  }
}

