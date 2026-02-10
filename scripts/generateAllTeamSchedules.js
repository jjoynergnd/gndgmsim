/* eslint-env node */

// scripts/generateAllTeamSchedules.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { faker } from "@faker-js/faker";
import { teams } from "../src/data/teams.js";

// Fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Output directory
const OUTPUT_DIR = path.join(__dirname, "../src/data/schedules");
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const TEAM_IDS = teams.map((t) => t.id);

// ---------- Helpers ----------

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function createGame({ week, opponent, home, type }) {
  return {
    week,
    type, // PRESEASON | REGULAR_SEASON
    opponent,
    home,
    played: false,
    scoreFor: null,
    scoreAgainst: null,
    result: null,
    overtime: false,
    attendance: faker.number.int({ min: 55000, max: 78000 }),
    notes: null
  };
}

function groupTeamsByConferenceAndDivision() {
  const byConfDiv = {};
  teams.forEach((t) => {
    if (!byConfDiv[t.conference]) byConfDiv[t.conference] = {};
    if (!byConfDiv[t.conference][t.division]) byConfDiv[t.conference][t.division] = [];
    byConfDiv[t.conference][t.division].push(t.id);
  });

  // Ensure stable ordering within divisions
  Object.values(byConfDiv).forEach((divisions) => {
    Object.keys(divisions).forEach((div) => {
      divisions[div] = divisions[div].slice().sort();
    });
  });

  return byConfDiv;
}

// ---------- Regular season matchup construction ----------

/**
 * Build a league-wide list of regular season matchups (no weeks yet).
 * Each matchup: { home, away }
 */
function buildRegularSeasonMatchups() {
  const byConfDiv = groupTeamsByConferenceAndDivision();

  const matchups = [];

  const conferences = ["AFC", "NFC"];
  const divisionsOrder = ["North", "East", "South", "West"];

  // 1) Division games: each team plays division rivals twice (home & away)
  conferences.forEach((conf) => {
    divisionsOrder.forEach((div) => {
      const divTeams = byConfDiv[conf][div];
      for (let i = 0; i < divTeams.length; i++) {
        for (let j = i + 1; j < divTeams.length; j++) {
          const a = divTeams[i];
          const b = divTeams[j];
          matchups.push({ home: a, away: b });
          matchups.push({ home: b, away: a });
        }
      }
    });
  });

  // 2) Intra-conference paired divisions (fictional rotation)
  // AFC: North vs East, South vs West
  // NFC: North vs East, South vs West
  const intraPairs = [
    { conf: "AFC", divA: "North", divB: "East" },
    { conf: "AFC", divA: "South", divB: "West" },
    { conf: "NFC", divA: "North", divB: "East" },
    { conf: "NFC", divA: "South", divB: "West" }
  ];

  intraPairs.forEach(({ conf, divA, divB }) => {
    const aTeams = byConfDiv[conf][divA];
    const bTeams = byConfDiv[conf][divB];

    // 4 games per team: full cross of 4x4
    aTeams.forEach((a, i) => {
      bTeams.forEach((b, j) => {
        const home = (i + j) % 2 === 0 ? a : b;
        const away = home === a ? b : a;
        matchups.push({ home, away });
      });
    });
  });

  // 3) Cross-conference paired divisions (fictional but structured)
  // AFC North vs NFC North, AFC East vs NFC East, etc.
  const crossPairs = [
    { afcDiv: "North", nfcDiv: "North" },
    { afcDiv: "East", nfcDiv: "East" },
    { afcDiv: "South", nfcDiv: "South" },
    { afcDiv: "West", nfcDiv: "West" }
  ];

  crossPairs.forEach(({ afcDiv, nfcDiv }) => {
    const afcTeams = byConfDiv["AFC"][afcDiv];
    const nfcTeams = byConfDiv["NFC"][nfcDiv];

    afcTeams.forEach((a, i) => {
      nfcTeams.forEach((b, j) => {
        const home = (i + j) % 2 === 0 ? a : b;
        const away = home === a ? b : a;
        matchups.push({ home, away });
      });
    });
  });

  // At this point:
  // - Each team has:
  //   - 6 division games
  //   - 4 intra-conference vs paired division
  //   - 4 cross-conference vs paired division
  //   = 14 games
  //
  // 4) Add 3 extra intra-conference games per team (fictional "same-place" style)
  // We'll pair divisions within each conference:
  //   North <-> South, East <-> West (two games)
  //   North <-> West, East <-> South (one game)
  const extraPairs = [
    // First extra round
    { conf: "AFC", divA: "North", divB: "South" },
    { conf: "AFC", divA: "East", divB: "West" },
    { conf: "NFC", divA: "North", divB: "South" },
    { conf: "NFC", divA: "East", divB: "West" },
    // Second extra round
    { conf: "AFC", divA: "North", divB: "West" },
    { conf: "AFC", divA: "East", divB: "South" },
    { conf: "NFC", divA: "North", divB: "West" },
    { conf: "NFC", divA: "East", divB: "South" },
    // Third extra round (repeat first pairing; may create some non-division duplicates, which is acceptable in this fictional setup)
    { conf: "AFC", divA: "North", divB: "South" },
    { conf: "AFC", divA: "East", divB: "West" },
    { conf: "NFC", divA: "North", divB: "South" },
    { conf: "NFC", divA: "East", divB: "West" }
  ];

  extraPairs.forEach(({ conf, divA, divB }) => {
    const aTeams = byConfDiv[conf][divA];
    const bTeams = byConfDiv[conf][divB];

    // Pair by index: a[i] vs b[i]
    for (let i = 0; i < aTeams.length; i++) {
      const a = aTeams[i];
      const b = bTeams[i];
      const home = i % 2 === 0 ? a : b;
      const away = home === a ? b : a;
      matchups.push({ home, away });
    }
  });

  return matchups;
}

// ---------- Week assignment & byes ----------

function assignWeeksAndBuildSchedules() {
  const regularMatchups = buildRegularSeasonMatchups();

  // Initialize per-team week map: teamId -> { [week]: { home, away } }
  const teamWeekGames = {};
  TEAM_IDS.forEach((id) => {
    teamWeekGames[id] = {};
  });

  // We have 18 weeks, 17 games per team, 1 bye per team.
  const weeks = Array.from({ length: 18 }, (_, i) => i + 1);
  let remaining = shuffle(regularMatchups);

  weeks.forEach((week) => {
    const usedThisWeek = new Set();

    const nextRemaining = [];
    for (const game of remaining) {
      const { home, away } = game;
      if (usedThisWeek.has(home) || usedThisWeek.has(away)) {
        nextRemaining.push(game);
        continue;
      }

      // Assign this game to this week
      teamWeekGames[home][week] = { home, away };
      teamWeekGames[away][week] = { home, away };
      usedThisWeek.add(home);
      usedThisWeek.add(away);
    }

    remaining = nextRemaining;
  });

  if (remaining.length > 0) {
    console.warn(
      "[schedule-generator] WARNING: Some regular season matchups could not be scheduled into 18 weeks:",
      remaining.length
    );
  }

  // Build final per-team schedule arrays (preseason + regular season)
  const schedulesByTeam = {};

  TEAM_IDS.forEach((teamId) => {
    const schedule = [];

    // --- PRESEASON (weeks 1–3) ---
    // Simple, independent, non-mirrored preseason; does not affect standings.
    const otherTeams = TEAM_IDS.filter((t) => t !== teamId);
    const preseasonOpponents = shuffle(otherTeams).slice(0, 3);
    preseasonOpponents.forEach((opp, index) => {
      schedule.push(
        createGame({
          week: index + 1,
          opponent: opp,
          home: index % 2 === 0,
          type: "PRESEASON"
        })
      );
    });

    // --- REGULAR SEASON (weeks 1–18) ---
    weeks.forEach((week) => {
      const game = teamWeekGames[teamId][week];
      if (!game) {
        // BYE week
        schedule.push({
          week,
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
      } else {
        const isHome = game.home === teamId;
        const opponent = isHome ? game.away : game.home;
        schedule.push(
          createGame({
            week,
            opponent,
            home: isHome,
            type: "REGULAR_SEASON"
          })
        );
      }
    });

    schedulesByTeam[teamId] = schedule;
  });

  return schedulesByTeam;
}

// ---------- Main ----------

function generateAllSchedules() {
  console.log("[schedule-generator] Building league-wide regular season matchups...");
  const schedulesByTeam = assignWeeksAndBuildSchedules();

  TEAM_IDS.forEach((teamId) => {
    const schedule = schedulesByTeam[teamId];
    const filePath = path.join(OUTPUT_DIR, `${teamId}.json`);
    fs.writeFileSync(filePath, JSON.stringify(schedule, null, 2));
    console.log(`✓ Created schedule for ${teamId}`);
  });

  console.log("\nAll team schedules generated successfully.");
}

generateAllSchedules();
