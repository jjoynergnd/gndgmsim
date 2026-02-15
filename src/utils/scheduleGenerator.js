// src/utils/scheduleGenerator.js

import { teams } from "../data/teams";

/**
 * PUBLIC API
 * Deterministic, NFL-style schedule generator.
 * - 17 games + 1 bye per team
 * - 6 division games (home/away vs 3 rivals)
 * - 4 intraconference rotation games
 * - 4 interconference rotation games
 * - 2 strength-of-schedule games (same-place, same conference)
 * - 1 cross-conference 17th game (same-place, different division than inter-rotation)
 * - No duplicate non-division opponents
 * - No back-to-back vs same opponent
 * - 18 weeks, exactly 1 bye per team
 */
export function generateSeasonSchedule(year) {
  const divisions = buildDivisionStructure();
  const ranks = buildDivisionRanks(divisions); // pseudo-standings, deterministic

  // 1) Build opponent lists (no weeks yet)
  const schedule = {};
  teams.forEach((t) => {
    schedule[t.id] = [];
  });

  // Division games (6)
  addDivisionGames(schedule, divisions);

  // Intra-conference rotation (4)
  addIntraConferenceRotationGames(schedule, divisions, year);

  // Inter-conference rotation (4)
  addInterConferenceRotationGames(schedule, divisions, year);

  // Strength-of-schedule (2)
  addStrengthOfScheduleGames(schedule, divisions, ranks, year);

  // 17th game (1)
  addSeventeenthGame(schedule, divisions, ranks, year);

  // 2) Assign weeks + byes
  assignWeeksAndByes(schedule, year);

  // 3) Sort each team schedule by week
  for (const teamId in schedule) {
    schedule[teamId].sort((a, b) => a.week - b.week);
  }

  // 4) Run schedule test harness every season
  runScheduleTestWrapper(schedule, year);

  return schedule;
}

/* ======================================================
   DIVISION / RANK HELPERS
====================================================== */

function buildDivisionStructure() {
  const divisions = {
    AFC: {
      North: [],
      East: [],
      South: [],
      West: []
    },
    NFC: {
      North: [],
      East: [],
      South: [],
      West: []
    }
  };

  teams.forEach((t) => {
    divisions[t.conference][t.division].push(t.id);
  });

  // Ensure deterministic ordering
  for (const conf of ["AFC", "NFC"]) {
    for (const div of ["North", "East", "South", "West"]) {
      divisions[conf][div].sort();
    }
  }

  return divisions;
}

// Pseudo-standings: alphabetical order within division = prior-year rank
// rank 0 = 1st place, 1 = 2nd, etc.
function buildDivisionRanks(divisions) {
  const ranks = {};
  for (const conf of ["AFC", "NFC"]) {
    ranks[conf] = {};
    for (const div of ["North", "East", "South", "West"]) {
      const list = divisions[conf][div];
      ranks[conf][div] = {};
      list.forEach((teamId, idx) => {
        ranks[conf][div][teamId] = idx; // 0–3
      });
    }
  }
  return ranks;
}

/* ======================================================
   GAME CREATION HELPERS
====================================================== */

function createEmptyGame({ week = null, type = "REGULAR_SEASON", opponent, home }) {
  return {
    week,
    type,
    opponent,
    home,
    played: false,
    scoreFor: null,
    scoreAgainst: null,
    result: null,
    overtime: false,
    attendance: null,
    notes: null
  };
}

function addGamePair(schedule, homeTeam, awayTeam) {
  // Home entry
  schedule[homeTeam].push(
    createEmptyGame({
      opponent: awayTeam,
      home: true
    })
  );

  // Away entry
  schedule[awayTeam].push(
    createEmptyGame({
      opponent: homeTeam,
      home: false
    })
  );
}

/* ======================================================
   DIVISION GAMES (6 per team)
====================================================== */

function addDivisionGames(schedule, divisions) {
  for (const conf of ["AFC", "NFC"]) {
    for (const div of ["North", "East", "South", "West"]) {
      const list = divisions[conf][div]; // 4 teams

      // Round-robin, home/away
      for (let i = 0; i < list.length; i++) {
        for (let j = i + 1; j < list.length; j++) {
          const t1 = list[i];
          const t2 = list[j];

          // One game with t1 home, one with t2 home
          addGamePair(schedule, t1, t2);
          addGamePair(schedule, t2, t1);
        }
      }
    }
  }
}

/* ======================================================
   ROTATION TABLES
   - These are structural, not tied to real NFL years,
     but follow the same formula: 3-year intra, 4-year inter.
====================================================== */

// Intra-conference rotation (3-year cycle)
// For each yearIndex (0,1,2), define pairings within a conference.
const INTRA_ROTATION = {
  AFC: [
    // yearIndex 0
    {
      North: "East",
      East: "North",
      South: "West",
      West: "South"
    },
    // yearIndex 1
    {
      North: "South",
      South: "North",
      East: "West",
      West: "East"
    },
    // yearIndex 2
    {
      North: "West",
      West: "North",
      East: "South",
      South: "East"
    }
  ],
  NFC: [
    // yearIndex 0
    {
      North: "East",
      East: "North",
      South: "West",
      West: "South"
    },
    // yearIndex 1
    {
      North: "South",
      South: "North",
      East: "West",
      West: "East"
    },
    // yearIndex 2
    {
      North: "West",
      West: "North",
      East: "South",
      South: "East"
    }
  ]
};

// Inter-conference rotation (4-year cycle)
// Pair each AFC division with an NFC division.
const INTER_ROTATION = [
  // yearIndex 0
  {
    AFC: {
      North: "North",
      East: "East",
      South: "South",
      West: "West"
    },
    NFC: {
      North: "North",
      East: "East",
      South: "South",
      West: "West"
    }
  },
  // yearIndex 1
  {
    AFC: {
      North: "East",
      East: "South",
      South: "West",
      West: "North"
    },
    NFC: {
      North: "West",
      East: "North",
      South: "East",
      West: "South"
    }
  },
  // yearIndex 2
  {
    AFC: {
      North: "South",
      East: "West",
      South: "North",
      West: "East"
    },
    NFC: {
      North: "South",
      East: "North",
      South: "West",
      West: "East"
    }
  },
  // yearIndex 3
  {
    AFC: {
      North: "West",
      East: "North",
      South: "East",
      West: "South"
    },
    NFC: {
      North: "East",
      East: "South",
      South: "North",
      West: "West"
    }
  }
];

// 17th game cross-conference division mapping (4-year cycle)
// Must be different from that year's INTER_ROTATION division.
const EXTRA17_ROTATION = [
  // yearIndex 0
  {
    AFC: {
      North: "South",
      East: "West",
      South: "North",
      West: "East"
    },
    NFC: {
      North: "South",
      East: "West",
      South: "North",
      West: "East"
    }
  },
  // yearIndex 1
  {
    AFC: {
      North: "West",
      East: "North",
      South: "East",
      West: "South"
    },
    NFC: {
      North: "East",
      East: "South",
      South: "North",
      West: "West"
    }
  },
  // yearIndex 2
  {
    AFC: {
      North: "East",
      East: "South",
      South: "West",
      West: "North"
    },
    NFC: {
      North: "West",
      East: "North",
      South: "East",
      West: "South"
    }
  },
  // yearIndex 3
  {
    AFC: {
      North: "North",
      East: "East",
      South: "South",
      West: "West"
    },
    NFC: {
      North: "North",
      East: "East",
      South: "South",
      West: "West"
    }
  }
];

function getIntraRotationYearIndex(year) {
  // 3-year cycle starting at 2026
  return (year - 2026) % 3;
}

function getInterRotationYearIndex(year) {
  // 4-year cycle starting at 2026
  return (year - 2026) % 4;
}

/* ======================================================
   INTRA-CONFERENCE ROTATION GAMES (4 per team)
====================================================== */

function addIntraConferenceRotationGames(schedule, divisions, year) {
  const idx = getIntraRotationYearIndex(year);

  for (const conf of ["AFC", "NFC"]) {
    const mapping = INTRA_ROTATION[conf][idx];

    // To avoid double-processing, only handle when division name is "North" or "East"
    // and let the mapping handle the symmetric partner.
    for (const div of ["North", "East", "South", "West"]) {
      const partnerDiv = mapping[div];
      if (!partnerDiv) continue;

      // Process each pair only once
      if (!shouldProcessDivisionPair(div, partnerDiv)) continue;

      const divTeams = divisions[conf][div];
      const partnerTeams = divisions[conf][partnerDiv];

      // Full bipartite: each team plays all 4 teams in the other division
      for (let i = 0; i < divTeams.length; i++) {
        for (let j = 0; j < partnerTeams.length; j++) {
          const t1 = divTeams[i];
          const t2 = partnerTeams[j];

          // Deterministic home/away: alternate by indices + year
          const homeFirst = (i + j + year) % 2 === 0 ? t1 : t2;
          const awayFirst = homeFirst === t1 ? t2 : t1;

          addGamePair(schedule, homeFirst, awayFirst);
        }
      }
    }
  }
}

function shouldProcessDivisionPair(divA, divB) {
  // Ensure each unordered pair is processed once
  const order = ["North", "East", "South", "West"];
  const idxA = order.indexOf(divA);
  const idxB = order.indexOf(divB);
  return idxA < idxB;
}

/* ======================================================
   INTER-CONFERENCE ROTATION GAMES (4 per team)
====================================================== */

function addInterConferenceRotationGames(schedule, divisions, year) {
  const idx = getInterRotationYearIndex(year);
  const mapping = INTER_ROTATION[idx];

  // AFC vs NFC
  for (const afcDiv of ["North", "East", "South", "West"]) {
    const nfcDiv = mapping.AFC[afcDiv];
    const afcTeams = divisions.AFC[afcDiv];
    const nfcTeams = divisions.NFC[nfcDiv];

    // Full bipartite: each AFC team plays all 4 NFC teams
    for (let i = 0; i < afcTeams.length; i++) {
      for (let j = 0; j < nfcTeams.length; j++) {
        const afcTeam = afcTeams[i];
        const nfcTeam = nfcTeams[j];

        // Deterministic home/away: alternate by indices + year
        const homeFirst = (i + j + year) % 2 === 0 ? afcTeam : nfcTeam;
        const awayFirst = homeFirst === afcTeam ? nfcTeam : afcTeam;

        addGamePair(schedule, homeFirst, awayFirst);
      }
    }
  }
}

/* ======================================================
   STRENGTH-OF-SCHEDULE GAMES (2 per team)
   - Same-place finishers from the two divisions in the
     same conference that are NOT the intra-rotation division.
   - Uses pseudo-ranks (alphabetical) as prior-year standings.
====================================================== */

function addStrengthOfScheduleGames(schedule, divisions, ranks, year) {
  const intraIdx = getIntraRotationYearIndex(year);

  for (const conf of ["AFC", "NFC"]) {
    const intraMap = INTRA_ROTATION[conf][intraIdx];
    const allDivs = ["North", "East", "South", "West"];

    for (const div of allDivs) {
      const intraPartner = intraMap[div];
      const otherDivs = allDivs.filter((d) => d !== div && d !== intraPartner); // 2 divisions

      const baseTeams = divisions[conf][div];

      baseTeams.forEach((teamId) => {
        const rank = ranks[conf][div][teamId]; // 0–3

        otherDivs.forEach((otherDiv, idx) => {
          const otherTeams = divisions[conf][otherDiv];
          const opponentId = otherTeams[rank];

          // Deterministic home/away: alternate by idx + year
          const homeFirst = (rank + idx + year) % 2 === 0 ? teamId : opponentId;
          const awayFirst = homeFirst === teamId ? opponentId : teamId;

          // To avoid duplicates, only create if teamId is "lexicographically smaller"
          if (teamId < opponentId) {
            addGamePair(schedule, homeFirst, awayFirst);
          }
        });
      });
    }
  }
}

/* ======================================================
   17th GAME (1 per team)
   - Cross-conference, same-place finisher
   - Division mapping from EXTRA17_ROTATION
====================================================== */

function addSeventeenthGame(schedule, divisions, ranks, year) {
  const idx = getInterRotationYearIndex(year);
  const mapping = EXTRA17_ROTATION[idx];

  // AFC side
  for (const afcDiv of ["North", "East", "South", "West"]) {
    const nfcDiv = mapping.AFC[afcDiv];
    const afcTeams = divisions.AFC[afcDiv];
    const nfcTeams = divisions.NFC[nfcDiv];

    afcTeams.forEach((afcTeamId) => {
      const rank = ranks.AFC[afcDiv][afcTeamId];
      const nfcTeamId = nfcTeams[rank];

      // Deterministic home/away:
      // Let AFC host in even years, NFC host in odd years
      const afcHosts = year % 2 === 0;
      const homeFirst = afcHosts ? afcTeamId : nfcTeamId;
      const awayFirst = afcHosts ? nfcTeamId : afcTeamId;

      // Avoid duplicates: only create if AFC team id < NFC team id
      const keyA = `A-${afcTeamId}`;
      const keyB = `N-${nfcTeamId}`;
      if (keyA < keyB) {
        addGamePair(schedule, homeFirst, awayFirst);
      }
    });
  }
}

/* ======================================================
   WEEK + BYE ASSIGNMENT
   - 18 weeks
   - 17 games + 1 bye per team
   - No back-to-back vs same opponent when possible
====================================================== */

function assignWeeksAndByes(schedule, year) {
  const teamIds = Object.keys(schedule).sort();

  // Precompute bye weeks (5–14) deterministically
  const byeWeeks = {};
  teamIds.forEach((teamId, idx) => {
    const bye = 5 + ((year + idx) % 10); // 5–14
    byeWeeks[teamId] = bye;
  });

  // Build list of unique matchups
  const games = [];
  const seenPairs = new Set();

  for (const teamId of teamIds) {
    schedule[teamId].forEach((g) => {
      if (g.type !== "REGULAR_SEASON" || g.opponent == null) return;

      const pairKey = makePairKey(teamId, g.opponent);
      if (seenPairs.has(pairKey)) return;
      seenPairs.add(pairKey);

      // Determine canonical home/away from one of the entries
      const homeEntry = schedule[teamId].find(
        (x) =>
          x.opponent === g.opponent &&
          x.type === "REGULAR_SEASON" &&
          x.home === true
      );

      const homeTeam = homeEntry ? teamId : g.opponent;
      const awayTeam = homeEntry ? g.opponent : teamId;

      games.push({
        home: homeTeam,
        away: awayTeam,
        week: null
      });
    });
  }

  // Deterministic ordering of games
  games.sort((a, b) => {
    const ka = `${a.home}-${a.away}`;
    const kb = `${b.home}-${b.away}`;
    return ka.localeCompare(kb);
  });

  // Track per-team week occupancy and last opponent
  const teamWeek = {};
  const lastOpponentByWeek = {};
  teamIds.forEach((id) => {
    teamWeek[id] = {};
    lastOpponentByWeek[id] = {};
  });

  const TOTAL_WEEKS = 18;

  // Greedy assignment: for each game, find earliest valid week
  for (const game of games) {
    let assigned = false;

    for (let week = 1; week <= TOTAL_WEEKS; week++) {
      const home = game.home;
      const away = game.away;

      if (week === byeWeeks[home] || week === byeWeeks[away]) continue;
      if (teamWeek[home][week] || teamWeek[away][week]) continue;

      const prevWeek = week - 1;
      if (
        prevWeek >= 1 &&
        (lastOpponentByWeek[home][prevWeek] === away ||
          lastOpponentByWeek[away][prevWeek] === home)
      ) {
        // Would create back-to-back vs same opponent; try another week
        continue;
      }

      // Assign
      game.week = week;
      teamWeek[home][week] = true;
      teamWeek[away][week] = true;
      lastOpponentByWeek[home][week] = away;
      lastOpponentByWeek[away][week] = home;
      assigned = true;
      break;
    }

    // Fallback: if we couldn't avoid back-to-back, place it anywhere free
    if (!assigned) {
      for (let week = 1; week <= TOTAL_WEEKS; week++) {
        const home = game.home;
        const away = game.away;

        if (week === byeWeeks[home] || week === byeWeeks[away]) continue;
        if (teamWeek[home][week] || teamWeek[away][week]) continue;

        game.week = week;
        teamWeek[home][week] = true;
        teamWeek[away][week] = true;
        lastOpponentByWeek[home][week] = away;
        lastOpponentByWeek[away][week] = home;
        assigned = true;
        break;
      }
    }

    if (!assigned) {
      console.warn(
        "[scheduleGenerator] Failed to assign week for game:",
        game.home,
        "vs",
        game.away
      );
    }
  }

  // Now write weeks back into each team's schedule and add BYE entries
  for (const teamId of teamIds) {
    const byeWeek = byeWeeks[teamId];

    // Map opponent -> list of weeks for this team
    const gameWeeksByOpponent = {};
    games.forEach((g) => {
      if (g.week == null) return;
      if (g.home === teamId || g.away === teamId) {
        const opp = g.home === teamId ? g.away : g.home;
        if (!gameWeeksByOpponent[opp]) gameWeeksByOpponent[opp] = [];
        gameWeeksByOpponent[opp].push(g.week);
      }
    });

    // Assign weeks to schedule entries
    schedule[teamId].forEach((g) => {
      if (g.type !== "REGULAR_SEASON" || g.opponent == null) return;
      const opp = g.opponent;
      const list = gameWeeksByOpponent[opp] || [];
      if (list.length === 0) return;
      const week = list.shift();
      g.week = week;
    });

    // Add BYE entry
    schedule[teamId].push({
      week: byeWeek,
      type: "REGULAR_SEASON",
      opponent: null,
      home: true,
      played: false,
      scoreFor: null,
      scoreAgainst: null,
      result: "BYE",
      overtime: false,
      attendance: null,
      notes: null
    });
  }
}

function makePairKey(a, b) {
  return [a, b].sort().join("-");
}

/* ======================================================
   SCHEDULE TEST HARNESS (runs every season initialization)
   Prints one clean summary line per team.
====================================================== */

function runScheduleTest(schedule, divisions, year) {
  console.log(`\n===== SCHEDULE TEST — YEAR ${year} =====`);
  const teams = Object.keys(schedule).sort();

  for (const teamId of teams) {
    const result = analyzeTeamSchedule(teamId, schedule, divisions, year);
    const prefix = `[SCHEDULE TEST] ${teamId} —`;

    if (result.ok) {
      console.log(
        `${prefix} OK ` +
          `(div ${result.div}, intra ${result.intra}, inter ${result.inter}, sos ${result.sos}, extra ${result.extra})`
      );
    } else {
      console.log(`${prefix} ERROR: ${result.error}`);
    }
  }

  console.log("===== END SCHEDULE TEST =====\n");
}

function analyzeTeamSchedule(teamId, schedule, divisions, year) {
  const games = schedule[teamId].filter(
    (g) => g.type === "REGULAR_SEASON" && g.opponent
  );

  const divInfo = findTeamDivision(teamId, divisions);
  const { conference, division } = divInfo;

  // Count categories
  let div = 0;
  let intra = 0;
  let inter = 0;
  let sos = 0;
  let extra = 0;

  // Track opponent counts to allow:
  // - up to 2 games vs division rivals (home/away)
  // - only 1 game vs non-division opponents
  const opponentCounts = {};

  for (const g of games) {
    const opp = g.opponent;

    if (!opponentCounts[opp]) opponentCounts[opp] = 0;
    opponentCounts[opp]++;

    const oppInfo = findTeamDivision(opp, divisions);

    const isDivisionRival =
      oppInfo.conference === conference && oppInfo.division === division;

    if (isDivisionRival) {
      // Allow up to 2 games vs division rivals
      if (opponentCounts[opp] > 2) {
        return { ok: false, error: `too many games vs division rival ${opp}` };
      }
      div++;
    } else {
      // Non-division: allow only 1 game vs each opponent
      if (opponentCounts[opp] > 1) {
        return { ok: false, error: `duplicate non-division opponent ${opp}` };
      }

      if (oppInfo.conference === conference) {
        // Same conference, different division
        const intraPartner = getIntraPartner(conference, division, year);
        if (oppInfo.division === intraPartner) {
          intra++;
        } else {
          sos++;
        }
      } else {
        // Opponent is in the other conference
        const interPartner = getInterPartner(conference, division, year);
        const extraPartner = getExtra17Partner(conference, division, year);

        if (oppInfo.division === interPartner) {
          inter++;
        } else if (oppInfo.division === extraPartner) {
          extra++;
        } else {
          return {
            ok: false,
            error: `unexpected cross-conference opponent ${opp}`
          };
        }
      }
    }
  }

  // Validate counts
  if (div !== 6) return { ok: false, error: `division count ${div} != 6` };
  if (intra !== 4) return { ok: false, error: `intra count ${intra} != 4` };
  if (inter !== 4) return { ok: false, error: `inter count ${inter} != 4` };
  if (sos !== 2) return { ok: false, error: `sos count ${sos} != 2` };
  if (extra !== 1) return { ok: false, error: `extra count ${extra} != 1` };

  return { ok: true, div, intra, inter, sos, extra };
}

function findTeamDivision(teamId, divisions) {
  for (const conf of ["AFC", "NFC"]) {
    for (const div of ["North", "East", "South", "West"]) {
      if (divisions[conf][div].includes(teamId)) {
        return { conference: conf, division: div };
      }
    }
  }
  throw new Error("Team not found in divisions: " + teamId);
}

// These three helpers must match your rotation tables in the generator:
function getIntraPartner(conf, div, year) {
  const idx = (year - 2026) % 3;
  const map = {
    0: { North: "East", East: "North", South: "West", West: "South" },
    1: { North: "South", South: "North", East: "West", West: "East" },
    2: { North: "West", West: "North", East: "South", South: "East" }
  };
  return map[idx][div];
}

function getInterPartner(conf, div, year) {
  const idx = (year - 2026) % 4;
  const map = {
    0: { North: "North", East: "East", South: "South", West: "West" },
    1: { North: "East", East: "South", South: "West", West: "North" },
    2: { North: "South", East: "West", South: "North", West: "East" },
    3: { North: "West", East: "North", South: "East", West: "South" }
  };
  return map[idx][div];
}

function getExtra17Partner(conf, div, year) {
  const idx = (year - 2026) % 4;
  const map = {
    0: { North: "South", East: "West", South: "North", West: "East" },
    1: { North: "West", East: "North", South: "East", West: "South" },
    2: { North: "East", East: "South", South: "West", West: "North" },
    3: { North: "North", East: "East", South: "South", West: "West" }
  };
  return map[idx][div];
}

/* ======================================================
   SCHEDULE TEST HARNESS WRAPPER (lint-safe)
   Runs every time generateSeasonSchedule() is called.
====================================================== */

export function runScheduleTestWrapper(schedule, year) {
  try {
    const divisions = buildDivisionStructure();
    runScheduleTest(schedule, divisions, year);
  } catch (err) {
    console.error("[SCHEDULE TEST] Harness error:", err);
  }
}
