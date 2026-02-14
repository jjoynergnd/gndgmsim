// src/utils/scheduleGenerator.js
//
// Lightweight, repeatable schedule generator for post-2026 seasons.
// Goal: variety + fairness, not perfect NFL formula.
// Output shape matches your existing schedule JSON objects.

import { teams } from "../data/teams";

function shuffle(array) {
  const arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function createEmptyLeagueSchedule() {
  const league = {};
  teams.forEach((t) => {
    league[t.id] = [];
  });
  return league;
}

function assignByes(leagueSchedule, { minWeek = 6, maxWeek = 14 }) {
  const teamIds = Object.keys(leagueSchedule);
  teamIds.forEach((teamId) => {
    const byeWeek =
      Math.floor(Math.random() * (maxWeek - minWeek + 1)) + minWeek;

    leagueSchedule[teamId].push({
      week: byeWeek,
      type: "REGULAR_SEASON",
      opponent: null,
      home: false,
      played: false,
      scoreFor: null,
      scoreAgainst: null,
      result: "BYE",
      overtime: false,
      attendance: null,
      notes: "Bye week"
    });
  });
}

function hasGameInWeek(teamSchedule, week) {
  return teamSchedule.some((g) => g.week === week);
}

function addGame(leagueSchedule, week, homeId, awayId) {
  const attendance = 60000 + Math.floor(Math.random() * 15000);

  leagueSchedule[homeId].push({
    week,
    type: "REGULAR_SEASON",
    opponent: awayId,
    home: true,
    played: false,
    scoreFor: null,
    scoreAgainst: null,
    result: null,
    overtime: false,
    attendance,
    notes: null
  });

  leagueSchedule[awayId].push({
    week,
    type: "REGULAR_SEASON",
    opponent: homeId,
    home: false,
    played: false,
    scoreFor: null,
    scoreAgainst: null,
    result: null,
    overtime: false,
    attendance,
    notes: null
  });
}

function countNonByeGames(teamSchedule) {
  return teamSchedule.filter((g) => g.result !== "BYE").length;
}

/**
 * generateSeasonSchedule
 *
 * @param {number} year - season year (used only for logging/consistency right now)
 * @returns {Object<string,Array>} leagueSchedule - map of teamId → schedule array
 */
export function generateSeasonSchedule(year) {
  console.log(`Generating schedule for ${year}`);

  const leagueSchedule = createEmptyLeagueSchedule();

  // 18 weeks (17 games + 1 bye)
  const TOTAL_WEEKS = 18;
  const TARGET_GAMES_PER_TEAM = 17;

  // Step 1: assign byes
  assignByes(leagueSchedule, { minWeek: 6, maxWeek: 14 });

  const teamIds = teams.map((t) => t.id);

  // Precompute all possible pairings (unordered)
  const pairings = [];
  for (let i = 0; i < teamIds.length; i++) {
    for (let j = i + 1; j < teamIds.length; j++) {
      pairings.push([teamIds[i], teamIds[j]]);
    }
  }

  const shuffledPairings = shuffle(pairings);

  // Step 2: iterate weeks and fill with games until each team has 17 games
  for (let week = 1; week <= TOTAL_WEEKS; week++) {
    // For each week, try to schedule as many games as possible
    for (let idx = 0; idx < shuffledPairings.length; idx++) {
      const [teamA, teamB] = shuffledPairings[idx];

      const schedA = leagueSchedule[teamA];
      const schedB = leagueSchedule[teamB];

      // Skip if either already has a game this week
      if (hasGameInWeek(schedA, week) || hasGameInWeek(schedB, week)) {
        continue;
      }

      // Skip if either already reached target games
      if (
        countNonByeGames(schedA) >= TARGET_GAMES_PER_TEAM ||
        countNonByeGames(schedB) >= TARGET_GAMES_PER_TEAM
      ) {
        continue;
      }

      // Decide home/away randomly but try to keep rough balance
      const homeGamesA = schedA.filter((g) => g.home && g.result !== "BYE").length;
      const homeGamesB = schedB.filter((g) => g.home && g.result !== "BYE").length;

      let homeId = teamA;
      let awayId = teamB;

      if (homeGamesA > homeGamesB) {
        homeId = teamB;
        awayId = teamA;
      } else if (homeGamesA === homeGamesB) {
        // random tiebreaker
        if (Math.random() < 0.5) {
          homeId = teamB;
          awayId = teamA;
        }
      }

      addGame(leagueSchedule, week, homeId, awayId);
    }
  }

  // Optional: sort each team schedule by week for consistency
  Object.keys(leagueSchedule).forEach((teamId) => {
    leagueSchedule[teamId].sort((a, b) => a.week - b.week);
  });

  // You can log or tag the year if you want to debug later
  // console.log(`Generated schedule for year ${year}`, leagueSchedule);

  return leagueSchedule;
}
