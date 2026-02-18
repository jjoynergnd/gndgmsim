// src/utils/seasonEngine/gameSimEngine.js

import { simulateWeightedGame } from "../gameSim";
import { DEBUG_GAME_SIM } from "./constants";

/* ======================================================
   HELPERS (COACH RATINGS)
====================================================== */

export function extractCoachRatings(staffByTeam) {
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
   SHARED GAME SIMULATION
====================================================== */

export function simulateGamesForWeek(
  season,
  { week, type, affectStandings },
  context
) {
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
    const pairKey = `${type}-${week}-${[teamId, opponentId].sort().join("-")}`;
    if (paired.has(pairKey)) return;
    paired.add(pairKey);

    const home = game.home ? teamId : opponentId;
    const away = game.home ? opponentId : teamId;

    const result = simulateGame(home, away, rostersByTeam, coachRatingsByTeam);

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
   INTERNAL HELPERS
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
      `Winner: ${
        result.homeScore > result.awayScore ? home : away
      } (${result.homeScore}-${result.awayScore})`
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
