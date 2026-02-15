// src/utils/seasonEngine.js

import { initializePlayoffs, simulatePlayoffRound } from "./playoffEngine";
import { generateSeasonSchedule } from "./scheduleGenerator";
import { simulateWeightedGame } from "./gameSim";
const DEBUG_GAME_SIM = true;   // set to false to silence logs


const PRESEASON_WEEKS = 3;
const REGULAR_SEASON_WEEKS = 18;
const PLAYOFF_ROUNDS = ["WILDCARD", "DIVISIONAL", "CONFERENCE", "SUPER_BOWL"];
const OFFSEASON_STEPS = ["RESIGNINGS", "FREE_AGENCY", "DRAFT"];

/* ======================================================
   HELPERS (COACH RATINGS)
====================================================== */

function extractCoachRatings(staffByTeam) {
  const out = {};
  if (!staffByTeam) return out;

  for (const teamId in staffByTeam) {
    const coaches = staffByTeam[teamId] || [];
    const headCoach = coaches.find((c) => c.role === "HC");
    out[teamId] = headCoach?.ratings?.overall ?? 75;
  }

  return out;
}

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

function initializeLeague(season, { teams, schedules }) {
  console.log("[seasonEngine] initializeLeague — starting with:", season);

  // ---- SCHEDULES ----
  if (season.year > 2026) {
    console.log(
      `[seasonEngine] Generating procedural schedule for ${season.year}`
    );
    season.schedules = generateSeasonSchedule(season.year);
  } else {
    console.log("[seasonEngine] Using static 2026 schedule JSON");
    season.schedules = {};
    teams.forEach((t) => {
      const raw = schedules[t.id] || [];
      season.schedules[t.id] = raw.map((g) => ({
        ...g,
        played: g.played ?? false,
        scoreFor: g.scoreFor ?? null,
        scoreAgainst: g.scoreAgainst ?? null,
        result: g.result ?? null
      }));
    });
  }

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
   OFFSEASON
====================================================== */

function advanceOffseason(season) {
  const idx = OFFSEASON_STEPS.indexOf(season.offseasonStep);

  if (idx < OFFSEASON_STEPS.length - 1) {
    season.offseasonStep = OFFSEASON_STEPS[idx + 1];
    season.lastResult = {
      summary: `${OFFSEASON_STEPS[idx]} complete`,
      details: ""
    };
  } else {
    season.phase = "PRESEASON";
    season.offseasonStep = null;
    season.lastResult = {
      summary: "Offseason complete",
      details: "Preseason begins."
    };
  }
}

/* ======================================================
   PRESEASON
====================================================== */

function simulatePreseasonWeek(season, context) {
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

/* ======================================================
   REGULAR SEASON
====================================================== */

function simulateRegularSeasonWeek(season, context) {
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

/* ======================================================
   SHARED GAME SIMULATION
====================================================== */

function simulateGamesForWeek(season, { week, type, affectStandings }, context) {
  const games = [];
  const paired = new Set();

  const coachRatingsByTeam = extractCoachRatings(context?.staff);
  const rostersByTeam = context?.rosters || {};

  Object.entries(season.schedules).forEach(([teamId, schedule]) => {
    const game = schedule.find((g) => g.week === week && g.type === type);
    if (!game) return;

    // Bye week
    if (game.result === "BYE" || game.opponent === null) return;

    const opponentId = game.opponent;

    // Canonical pair key: same for both teams
    const pairKey = `${type}-${week}-${[teamId, opponentId]
      .sort()
      .join("-")}`;
    if (paired.has(pairKey)) return;
    paired.add(pairKey);

    const home = game.home ? teamId : opponentId;
    const away = game.home ? opponentId : teamId;

    const result = simulateGame(
      home,
      away,
      rostersByTeam,
      coachRatingsByTeam
    );

    games.push(result);

    if (affectStandings) {
      applyResult(season, result);
    }

    markGamesPlayed(season, week, type, result);
  });

  console.log(
    "[seasonEngine] simulateGamesForWeek",
    "type:",
    type,
    "week:",
    week,
    "games:",
    games.length
  );

  return games;
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
   GAME SIMULATION
====================================================== */

function simulateGame(home, away, rostersByTeam, coachRatingsByTeam) {
  const result = simulateWeightedGame({
    homeTeamId: home,
    awayTeamId: away,
    rostersByTeam,
    coachRatingsByTeam,
    chaosStdDev: 5
  });

  if (DEBUG_GAME_SIM) {
    const homeStrength = result.homeStrength.toFixed(1);
    const awayStrength = result.awayStrength.toFixed(1);
    const diff = (result.homeStrength - result.awayStrength).toFixed(1);

    const homeQB =
      (rostersByTeam[home]?.find((p) => p.position === "QB")?.ratings?.overall ??
        0);
    const awayQB =
      (rostersByTeam[away]?.find((p) => p.position === "QB")?.ratings?.overall ??
        0);

    const qbDiff = homeQB - awayQB;

    console.log(
      `GAME SIM: ${home} (${homeStrength}) vs ${away} (${awayStrength}) → diff ${diff}`
    );
    console.log(`QB diff: ${qbDiff}`);
    console.log(
      `Winner: ${result.homeScore > result.awayScore ? home : away} (${result.homeScore}-${result.awayScore})`
    );
    console.log("--------------------------------------------------");
  }

  return {
    home,
    away,
    homeScore: result.homeScore,
    awayScore: result.awayScore
  };
}


function applyResult(season, game) {
  const { home, away, homeScore, awayScore } = game;

  const homeTeam = season.teams[home];
  const awayTeam = season.teams[away];

  homeTeam.pointsFor += homeScore;
  homeTeam.pointsAgainst += awayScore;
  awayTeam.pointsFor += awayScore;
  awayTeam.pointsAgainst += homeScore;

  if (homeScore > awayScore) {
    homeTeam.wins++;
    awayTeam.losses++;
  } else if (awayScore > homeScore) {
    awayTeam.wins++;
    homeTeam.losses++;
  } else {
    homeTeam.ties++;
    awayTeam.ties++;
  }
}

function markGamesPlayed(season, week, type, game) {
  const { home, away, homeScore, awayScore } = game;

  const update = (teamId, scored, allowed) => {
    const g = season.schedules[teamId].find(
      (x) => x.week === week && x.type === type
    );
    if (!g) return;

    g.played = true;
    g.scoreFor = scored;
    g.scoreAgainst = allowed;
    g.result = scored > allowed ? "W" : scored < allowed ? "L" : "T";
  };

  update(home, homeScore, awayScore);
  update(away, awayScore, homeScore);
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
