// src/utils/gameSim.js
//
// Roster- and coach-weighted game simulation.
// This file is intentionally engine-agnostic: it does NOT import React or seasonEngine.
// You pass in the data it needs from wherever you call it.

function avgOverall(players) {
  if (!players || players.length === 0) return 0;
  const sum = players.reduce((s, p) => s + (p.ratings?.overall ?? 0), 0);
  return sum / players.length;
}

function pickStarter(players, position) {
  if (!players) return null;
  const filtered = players.filter(
    (p) => p.position === position && (p.depth === 1 || p.depth === 0 || p.depth == null)
  );
  if (filtered.length === 0) return null;
  // If multiple "starters", just take the highest overall
  return filtered.reduce((best, p) =>
    (p.ratings?.overall ?? 0) > (best.ratings?.overall ?? 0) ? p : best
  );
}

function filterByPosition(roster, positions) {
  if (!roster) return [];
  return roster.filter((p) => positions.includes(p.position));
}

// Simple Box–Muller normal distribution
function randomNormal(mean = 0, stdDev = 1) {
  let u = 0,
    v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  return mean + z * stdDev;
}

function computeTeamStrength({ roster, coachRating = 75, isHome = false }) {
  if (!roster || roster.length === 0) {
    // Failsafe: treat as expansion-level team
    return 60 + (coachRating - 75) * 0.2 + (isHome ? 1.0 : 0);
  }

  const qb = pickStarter(roster, "QB");
  const rbs = filterByPosition(roster, ["RB", "HB", "FB"]);
  const wrs = filterByPosition(roster, ["WR"]);
  const tes = filterByPosition(roster, ["TE"]);
  const ol = filterByPosition(roster, ["LT", "LG", "C", "RG", "RT", "OL"]);

  const dl = filterByPosition(roster, ["DE", "DT", "DL"]);
  const lbs = filterByPosition(roster, ["LB", "MLB", "OLB"]);
  const cbs = filterByPosition(roster, ["CB"]);
  const ss = filterByPosition(roster, ["SS", "FS", "S"]);

  const ks = filterByPosition(roster, ["K"]);
  const ps = filterByPosition(roster, ["P"]);

  const offenseRating =
    (qb?.ratings?.overall ?? 60) * 0.30 +
    avgOverall(rbs) * 0.08 +
    avgOverall(wrs) * 0.18 +
    (tes[0]?.ratings?.overall ?? avgOverall(tes)) * 0.06 +
    avgOverall(ol) * 0.20;

  const defenseRating =
    avgOverall(dl) * 0.07 +
    avgOverall(lbs) * 0.07 +
    avgOverall(cbs) * 0.08 +
    avgOverall(ss) * 0.06;

  const specialRating =
    ((ks[0]?.ratings?.overall ?? avgOverall(ks)) +
      (ps[0]?.ratings?.overall ?? avgOverall(ps))) /
    2 *
    0.02;

  const baseStrength = offenseRating + defenseRating + specialRating;

  // Coach influence: 0–100 → ±5 points swing
  const coachAdj = (coachRating - 75) * 0.2;

  // Home field: small but meaningful bump
  const homeAdj = isHome ? 2.0 : 0.0;

  return baseStrength + coachAdj + homeAdj;
}

/**
 * simulateWeightedGame
 *
 * @param {Object} params
 * @param {string} params.homeTeamId
 * @param {string} params.awayTeamId
 * @param {Object<string,Array>} params.rostersByTeam - map of teamId → roster array
 * @param {Object<string,number>} [params.coachRatingsByTeam] - map of teamId → coach overall (0–100)
 * @param {number} [params.chaosStdDev=5] - higher = more upsets/variance
 *
 * @returns {{
 *   homeScore: number,
 *   awayScore: number,
 *   homeStrength: number,
 *   awayStrength: number,
 *   upset: boolean
 * }}
 */
export function simulateWeightedGame({
  homeTeamId,
  awayTeamId,
  rostersByTeam,
  coachRatingsByTeam = {},
  chaosStdDev = 5
}) {
  const homeRoster = rostersByTeam[homeTeamId] || [];
  const awayRoster = rostersByTeam[awayTeamId] || [];

  const homeCoach = coachRatingsByTeam[homeTeamId] ?? 75;
  const awayCoach = coachRatingsByTeam[awayTeamId] ?? 75;

  const homeStrength = computeTeamStrength({
    roster: homeRoster,
    coachRating: homeCoach,
    isHome: true
  });

  const awayStrength = computeTeamStrength({
    roster: awayRoster,
    coachRating: awayCoach,
    isHome: false
  });

  // Add randomness around each strength
  const homeScoreRaw = homeStrength / 4 + randomNormal(0, chaosStdDev);
  const awayScoreRaw = awayStrength / 4 + randomNormal(0, chaosStdDev);

  // Clamp and round to football-ish scores
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  let homeScore = Math.round(clamp(homeScoreRaw, 10, 45));
  let awayScore = Math.round(clamp(awayScoreRaw, 10, 45));

  // Avoid ties for now (you can relax this later)
  if (homeScore === awayScore) {
    if (Math.random() < 0.5) homeScore += 3;
    else awayScore += 3;
  }

  const favored =
    homeStrength === awayStrength
      ? null
      : homeStrength > awayStrength
      ? "HOME"
      : "AWAY";

  const actualWinner =
    homeScore === awayScore ? null : homeScore > awayScore ? "HOME" : "AWAY";

  const upset =
    favored !== null && actualWinner !== null && favored !== actualWinner;

  return {
    homeScore,
    awayScore,
    homeStrength,
    awayStrength,
    upset
  };
}
