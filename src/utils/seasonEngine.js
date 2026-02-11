// src/utils/seasonEngine.js

import { initializePlayoffs, simulatePlayoffRound } from "./playoffEngine";

const PRESEASON_WEEKS = 3;
const REGULAR_SEASON_WEEKS = 18;
const PLAYOFF_ROUNDS = ["WILDCARD", "DIVISIONAL", "CONFERENCE", "SUPER_BOWL"];
const OFFSEASON_STEPS = ["RESIGNINGS", "FREE_AGENCY", "DRAFT"];

/* ======================================================
   PUBLIC API
====================================================== */

export function advanceSeason(prev, context) {
  const season = structuredClone(prev);

  // Initialize league once
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
      simulatePreseasonWeek(season);
      break;

    case "REGULAR_SEASON":
      simulateRegularSeasonWeek(season);
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

  // ---- SCHEDULES ----
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

function simulatePreseasonWeek(season) {
  const week = season.preseasonWeek;
  const key = `PRESEASON-${week}`;

  if (season.gamesByKey[key]) {
    console.log("[seasonEngine] Preseason week already simulated:", week);
    advanceFromPreseasonIfDone(season);
    return;
  }

  const games = simulateGamesForWeek(season, {
    week,
    type: "PRESEASON",
    affectStandings: false
  });

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

function simulateRegularSeasonWeek(season) {
  const week = season.week;
  const key = `REGULAR_SEASON-${week}`;

  if (season.gamesByKey[key]) {
    console.log("[seasonEngine] Regular season week already simulated:", week);
    advanceFromRegularSeasonIfDone(season);
    return;
  }

  const games = simulateGamesForWeek(season, {
    week,
    type: "REGULAR_SEASON",
    affectStandings: true
  });

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

function simulateGamesForWeek(season, { week, type, affectStandings }) {
  const games = [];
  const paired = new Set();

  Object.entries(season.schedules).forEach(([teamId, schedule]) => {
    const game = schedule.find((g) => g.week === week && g.type === type);
    if (!game) return;

    // Bye week
    if (game.result === "BYE" || game.opponent === null) return;

    const opponentId = game.opponent;

    // Canonical pair key: same for both teams
    const pairKey = `${type}-${week}-${[teamId, opponentId].sort().join("-")}`;

    if (paired.has(pairKey)) return;
    paired.add(pairKey);

    const home = game.home ? teamId : opponentId;
    const away = game.home ? opponentId : teamId;

    const result = simulateGame(home, away);
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
   PLAYOFFS (STUB)
====================================================== */

function advancePlayoffs(season) {
  // First time entering playoffs
  if (!season.playoffs?.initialized) {
    initializePlayoffs(season);
    season.playoffs.initialized = true;

    season.lastResult = {
      summary: "Playoffs begin",
      details: "Wildcard round set."
    };
    return;
  }

  // Simulate the current round
  const finished = simulatePlayoffRound(season);

  if (!finished) {
    // Round still in progress (shouldn't happen with current design)
    return;
  }

  const idx = PLAYOFF_ROUNDS.indexOf(season.playoffRound);
  const isLast = idx === PLAYOFF_ROUNDS.length - 1;

  if (!isLast) {
    season.playoffRound = PLAYOFF_ROUNDS[idx + 1];
    season.lastResult = {
      summary: `${PLAYOFF_ROUNDS[idx]} complete`,
      details: ""
    };
  } else {
    // SUPER BOWL just finished
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

  Object.values(season.schedules).forEach((schedule) => {
    schedule.forEach((g) => {
      g.played = false;
      g.scoreFor = null;
      g.scoreAgainst = null;
      // Preserve BYE marker
      g.result = g.result === "BYE" ? "BYE" : null;
    });
  });

  season.gamesByKey = {};
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

function simulateGame(home, away) {
  const homeScore = rand(17, 38);
  const awayScore = rand(14, 34);

  return {
    home,
    away,
    homeScore,
    awayScore
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
   HELPERS
====================================================== */

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getOffseasonSteps() {
  return OFFSEASON_STEPS;
}

export function getPlayoffRounds() {
  return PLAYOFF_ROUNDS;
}
