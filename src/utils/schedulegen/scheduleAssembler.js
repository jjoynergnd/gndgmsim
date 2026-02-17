// src/utils/schedulegen/scheduleAssembler.js
import { teams } from "../../data/teams";

function createEmptyGame({ week, opponent, home }) {
  return {
    week,
    type: "REGULAR_SEASON",
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

function buildDivisionStructure() {
  const divisions = {
    AFC: { North: [], East: [], South: [], West: [] },
    NFC: { North: [], East: [], South: [], West: [] }
  };

  teams.forEach((t) => {
    divisions[t.conference][t.division].push(t.id);
  });

  for (const conf of ["AFC", "NFC"]) {
    for (const div of ["North", "East", "South", "West"]) {
      divisions[conf][div].sort();
    }
  }

  return divisions;
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

function analyzeTeamSchedule(teamId, schedule, divisions, year) {
  const games = schedule[teamId].filter(
    (g) => g.type === "REGULAR_SEASON" && g.opponent
  );

  const divInfo = findTeamDivision(teamId, divisions);
  const { conference, division } = divInfo;

  let div = 0;
  let intra = 0;
  let inter = 0;
  let sos = 0;
  let extra = 0;

  const opponentCounts = {};

  for (const g of games) {
    const opp = g.opponent;

    if (!opponentCounts[opp]) opponentCounts[opp] = 0;
    opponentCounts[opp]++;

    const oppInfo = findTeamDivision(opp, divisions);

    const isDivisionRival =
      oppInfo.conference === conference && oppInfo.division === division;

    if (isDivisionRival) {
      if (opponentCounts[opp] > 2) {
        return { ok: false, error: `too many games vs division rival ${opp}` };
      }
      div++;
    } else {
      if (opponentCounts[opp] > 1) {
        return { ok: false, error: `duplicate non-division opponent ${opp}` };
      }

      if (oppInfo.conference === conference) {
        const intraPartner = getIntraPartner(conference, division, year);
        if (oppInfo.division === intraPartner) {
          intra++;
        } else {
          sos++;
        }
      } else {
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

  if (div !== 6) return { ok: false, error: `division count ${div} != 6` };
  if (intra !== 4) return { ok: false, error: `intra count ${intra} != 4` };
  if (inter !== 4) return { ok: false, error: `inter count ${inter} != 4` };
  if (sos !== 2) return { ok: false, error: `sos count ${sos} != 2` };
  if (extra !== 1) return { ok: false, error: `extra count ${extra} != 1` };

  return { ok: true, div, intra, inter, sos, extra };
}

function runScheduleTest(schedule, year) {
  const divisions = buildDivisionStructure();
  console.log(`\n===== SCHEDULE TEST — YEAR ${year} =====`);
  const teamIds = Object.keys(schedule).sort();

  for (const teamId of teamIds) {
    const result = analyzeTeamSchedule(teamId, schedule, divisions, year);
    const prefix = `[SCHEDULE TEST] ${teamId} —`;

    if (result.ok) {
      console.log(
        `${prefix} OK (div ${result.div}, intra ${result.intra}, inter ${result.inter}, sos ${result.sos}, extra ${result.extra})`
      );
    } else {
      console.log(`${prefix} ERROR: ${result.error}`);
    }
  }

  console.log("===== END SCHEDULE TEST =====\n");
}

export function assembleSchedule(scheduleWithWeeksByTeam, byeWeeks, year) {
  const schedule = {};
  const teamIds = Object.keys(scheduleWithWeeksByTeam).sort();

  teamIds.forEach((teamId) => {
    schedule[teamId] = [];

    const games = scheduleWithWeeksByTeam[teamId];

    games.forEach((g) => {
      schedule[teamId].push(
        createEmptyGame({
          week: g.week,
          opponent: g.opponent,
          home: g.home
        })
      );
    });

    schedule[teamId].push({
      week: byeWeeks[teamId],
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

    schedule[teamId].sort((a, b) => a.week - b.week);
  });

  runScheduleTest(schedule, year);

  return schedule;
}
