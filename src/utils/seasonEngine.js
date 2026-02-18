// src/utils/seasonEngine.js

import { initializePlayoffs, simulatePlayoffRound } from "./playoffEngine";
import { generateSeasonSchedule } from "./scheduleGenerator";

import {
  PRESEASON_WEEKS,
  REGULAR_SEASON_WEEKS,
  PLAYOFF_ROUNDS,
  OFFSEASON_STEPS
} from "./seasonEngine/constants";

import { simulatePreseasonWeek } from "./seasonEngine/preseasonEngine";
import { simulateRegularSeasonWeek } from "./seasonEngine/regularSeasonEngine";
import { advanceOffseason } from "./seasonEngine/offseasonEngine";

/* ======================================================
   PUBLIC API
====================================================== */

export function advanceSeason(prev, context) {
  const season = structuredClone(prev);

  // Initialize league once per season
  if (!season._initialized) {
    initializeLeague(season, context);
  }

  console.log(
    "[seasonEngine] advanceSeason — phase:",
    season.phase,
    "preseasonWeek:",
    season.preseasonWeek,
    "week:",
    season.week,
    "offseasonStep:",
    season.offseasonStep
  );

  switch (season.phase) {
    case "OFFSEASON":
      advanceOffseason(season);
      break;

    case "PRESEASON":
      simulatePreseasonWeek(season, context);
      break;

    case "REGULAR_SEASON":
      simulateRegularSeasonWeek(season, context);
      break;

    case "PLAYOFFS":
      advancePlayoffs(season);
      break;

    default:
      break;
  }

  return season;
}

/* ======================================================
   INITIALIZATION
====================================================== */

function initializeLeague(season, { teams }) {
  console.log("[seasonEngine] initializeLeague — starting with:", season);

  // ---- SCHEDULES ----
  console.log(`[seasonEngine] Generating procedural schedule for ${season.year}`);
  season.schedules = generateSeasonSchedule(season.year);

  // ===== DEBUG: PRINT BAL SCHEDULE =====
  try {
    const balSchedule = season.schedules["BAL"];

    console.log("===== DEBUG: BAL SCHEDULE FOR", season.year, "=====");

    balSchedule
      .slice()
      .sort((a, b) => {
        const typeOrder = { PRESEASON: 0, REGULAR_SEASON: 1 };
        const tA = typeOrder[a.type] ?? 99;
        const tB = typeOrder[b.type] ?? 99;
        if (tA !== tB) return tA - tB;
        return (a.week ?? 0) - (b.week ?? 0);
      })
      .forEach((g) => {
        console.log(
          `${g.type.padEnd(15)}  Week ${String(g.week).padEnd(2)}  vs ${
            g.opponent
          }  home=${g.home}`
        );
      });

    console.log("===============================================");
  } catch (err) {
    console.log("DEBUG PRINT FAILED:", err);
  }
  // ===== END DEBUG =====

  season._initialized = true;

  // ---- STANDINGS ----
  season.teams = {};
  teams.forEach((t) => {
    season.teams[t.id] = {
      wins: 0,
      losses: 0,
      ties: 0,
      pointsFor: 0,
      pointsAgainst: 0
    };
  });

  season.gamesByKey = {}; // keyed by `${type}-${week}-${sortedTeamIds}`

  // ---- TIMING ----
  season.phase = "OFFSEASON";
  season.offseasonStep = OFFSEASON_STEPS[0];

  season.preseasonWeek = 1; // 1–3
  season.week = 1; // 1–18
  season.playoffRound = null;

  season.lastResult = {
    summary: "League initialized",
    details: "Offseason — RESIGNINGS"
  };

  console.log("[seasonEngine] initializeLeague — finished:", season);
}

/* ======================================================
   PLAYOFFS
====================================================== */

function advancePlayoffs(season) {
  if (!season.playoffs?.initialized) {
    initializePlayoffs(season);
    season.playoffRound = PLAYOFF_ROUNDS[0];
    season.lastResult = {
      summary: "Playoffs begin",
      details: "Wildcard round set."
    };
    return;
  }

  const summary = simulatePlayoffRound(season);
  const idx = PLAYOFF_ROUNDS.indexOf(season.playoffRound);
  const isLast = idx === PLAYOFF_ROUNDS.length - 1;

  if (!isLast) {
    const prevRound = season.playoffRound;
    season.playoffRound = PLAYOFF_ROUNDS[idx + 1];
    season.lastResult = {
      summary: `${prevRound.replace("_", " ")} complete`,
      details: summary
    };
  } else {
    const finalSummary = summary || "Super Bowl complete.";
    season.lastResult = {
      summary: "Season complete",
      details: finalSummary
    };
    resetForNextSeason(season);
  }
}

/* ======================================================
   SEASON RESET
====================================================== */

function resetForNextSeason(season) {
  season.year += 1;

  Object.values(season.teams).forEach((t) => {
    t.wins = 0;
    t.losses = 0;
    t.ties = 0;
    t.pointsFor = 0;
    t.pointsAgainst = 0;
  });

  // We let initializeLeague rebuild schedules for the new year
  season.gamesByKey = {};
  season._initialized = false;

  season.phase = "OFFSEASON";
  season.offseasonStep = OFFSEASON_STEPS[0];
  season.preseasonWeek = 1;
  season.week = 1;
  season.playoffRound = null;

  season.lastResult = {
    summary: "Season complete",
    details: `Welcome to the ${season.year} season`
  };
}

/* ======================================================
   EXPORTED HELPERS
====================================================== */

export function getOffseasonSteps() {
  return OFFSEASON_STEPS;
}

export function getPlayoffRounds() {
  return PLAYOFF_ROUNDS;
}
