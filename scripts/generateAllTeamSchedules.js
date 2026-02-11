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
    type,
    opponent,
    home,
    played: false,
    scoreFor: null,
    scoreAgainst: null,
    result: null,
    overtime: false,
    attendance:
      type === "REGULAR_SEASON"
        ? faker.number.int({ min: 55000, max: 78000 })
        : faker.number.int({ min: 45000, max: 70000 }),
    notes: null
  };
}

function groupTeams() {
  const byConfDiv = {};
  teams.forEach((t) => {
    if (!byConfDiv[t.conference]) byConfDiv[t.conference] = {};
    if (!byConfDiv[t.conference][t.division])
      byConfDiv[t.conference][t.division] = [];
    byConfDiv[t.conference][t.division].push(t.id);
  });

  Object.values(byConfDiv).forEach((divs) => {
    Object.keys(divs).forEach((d) => {
      divs[d] = divs[d].slice().sort();
    });
  });

  return byConfDiv;
}

/* -----------------------------
   STRUCTURED WEEK GENERATION
------------------------------*/

function buildStructuredWeeks() {
  const byConfDiv = groupTeams();
  const weeks = [];

  const conferences = ["AFC", "NFC"];
  const divisions = ["North", "East", "South", "West"];

  // 1️⃣ Division double round robin (6 weeks)
  for (let round = 0; round < 6; round++) {
    weeks.push([]);
  }

  conferences.forEach((conf) => {
    divisions.forEach((div) => {
      const [a, b, c, d] = byConfDiv[conf][div];

      const firstHalf = [
        [[a, b], [c, d]],
        [[a, c], [b, d]],
        [[a, d], [b, c]]
      ];

      const secondHalf = firstHalf.map((games) =>
        games.map(([home, away]) => [away, home])
      );

      [...firstHalf, ...secondHalf].forEach((games, i) => {
        games.forEach(([home, away]) => {
          weeks[i].push({ home, away });
        });
      });
    });
  });

  // 2️⃣ Intra-conference paired divisions (4 weeks)
  const intraPairs = [
    { conf: "AFC", a: "North", b: "East" },
    { conf: "AFC", a: "South", b: "West" },
    { conf: "NFC", a: "North", b: "East" },
    { conf: "NFC", a: "South", b: "West" }
  ];

  for (let i = 0; i < 4; i++) weeks.push([]);

  intraPairs.forEach(({ conf, a, b }) => {
    const A = byConfDiv[conf][a];
    const B = byConfDiv[conf][b];

    for (let weekOffset = 0; weekOffset < 4; weekOffset++) {
      for (let j = 0; j < 4; j++) {
        const home = (weekOffset + j) % 2 === 0 ? A[j] : B[(j + weekOffset) % 4];
        const away = home === A[j] ? B[(j + weekOffset) % 4] : A[j];
        weeks[6 + weekOffset].push({ home, away });
      }
    }
  });

  // 3️⃣ Cross-conference paired divisions (4 weeks)
  const crossPairs = [
    { afc: "North", nfc: "North" },
    { afc: "East", nfc: "East" },
    { afc: "South", nfc: "South" },
    { afc: "West", nfc: "West" }
  ];

  for (let i = 0; i < 4; i++) weeks.push([]);

  crossPairs.forEach(({ afc, nfc }) => {
    const A = byConfDiv["AFC"][afc];
    const B = byConfDiv["NFC"][nfc];

    for (let weekOffset = 0; weekOffset < 4; weekOffset++) {
      for (let j = 0; j < 4; j++) {
        const home = (weekOffset + j) % 2 === 0 ? A[j] : B[(j + weekOffset) % 4];
        const away = home === A[j] ? B[(j + weekOffset) % 4] : A[j];
        weeks[10 + weekOffset].push({ home, away });
      }
    }
  });

  // 4️⃣ Extra 3 structured conference rotation weeks
  for (let i = 0; i < 3; i++) weeks.push([]);

  conferences.forEach((conf) => {
    const north = byConfDiv[conf]["North"];
    const south = byConfDiv[conf]["South"];
    const east = byConfDiv[conf]["East"];
    const west = byConfDiv[conf]["West"];

    for (let round = 0; round < 3; round++) {
      for (let i = 0; i < 4; i++) {
        const home1 = round % 2 === 0 ? north[i] : south[(i + round) % 4];
        const away1 = home1 === north[i] ? south[(i + round) % 4] : north[i];

        const home2 = round % 2 === 0 ? east[i] : west[(i + round) % 4];
        const away2 = home2 === east[i] ? west[(i + round) % 4] : east[i];

        weeks[14 + round].push({ home: home1, away: away1 });
        weeks[14 + round].push({ home: home2, away: away2 });
      }
    }
  });

  // 5️⃣ Add a full Week 18 with random valid matchups (Option A1)
  const extraWeek = [];
  const shuffledTeams = shuffle(TEAM_IDS.slice()); // 32 teams
  for (let i = 0; i < shuffledTeams.length; i += 2) {
    const t1 = shuffledTeams[i];
    const t2 = shuffledTeams[i + 1];
    const homeFirst = Math.random() < 0.5;
    const home = homeFirst ? t1 : t2;
    const away = homeFirst ? t2 : t1;
    extraWeek.push({ home, away });
  }
  weeks.push(extraWeek); // now 18 weeks total

  return weeks; // 18 fully valid weeks
}

/* -----------------------------
   BYE WEEK ASSIGNMENT
------------------------------*/

function assignByeWeeks() {
  const byeWeeks = {}; // teamId → week
  const allowedWeeks = Array.from({ length: 11 }, (_, i) => i + 4); // 4–14
  const weekLoad = {}; // week → number of teams on bye

  allowedWeeks.forEach((w) => (weekLoad[w] = 0));

  const shuffledTeams = shuffle(TEAM_IDS);

  shuffledTeams.forEach((teamId) => {
    const possibleWeeks = shuffle(allowedWeeks);

    for (const w of possibleWeeks) {
      if (weekLoad[w] < 4) {
        byeWeeks[teamId] = w;
        weekLoad[w]++;
        break;
      }
    }
  });

  return byeWeeks;
}

/* -----------------------------
   BUILD TEAM WEEK MAP
------------------------------*/

function assignWeeks() {
  const structuredWeeks = buildStructuredWeeks(); // 18 weeks
  const shuffledWeeks = shuffle(structuredWeeks);

  const teamWeeks = {};
  TEAM_IDS.forEach((id) => (teamWeeks[id] = {}));

  // Fill 18 real weeks with games
  shuffledWeeks.forEach((games, index) => {
    const weekNumber = index + 1; // 1–18
    games.forEach(({ home, away }) => {
      teamWeeks[home][weekNumber] = { home, away };
      teamWeeks[away][weekNumber] = { home, away };
    });
  });

  // Assign byes across weeks 4–14 (exactly one per team)
  const byeWeeks = assignByeWeeks();

  TEAM_IDS.forEach((teamId) => {
    const byeWeek = byeWeeks[teamId];
    // Remove that week's game for this team → creates a bye
    delete teamWeeks[teamId][byeWeek];
  });

  return teamWeeks;
}

/* -----------------------------
   BUILD SCHEDULE FILES
------------------------------*/

function buildSchedules() {
  const teamWeeks = assignWeeks();
  const schedules = {};

  TEAM_IDS.forEach((teamId) => {
    const schedule = [];

    // Preseason
    const others = TEAM_IDS.filter((t) => t !== teamId);
    const preOpp = shuffle(others).slice(0, 3);

    preOpp.forEach((opp, i) => {
      schedule.push(
        createGame({
          week: i + 1,
          opponent: opp,
          home: i % 2 === 0,
          type: "PRESEASON"
        })
      );
    });

    // Regular season (weeks 1–18)
    for (let week = 1; week <= 18; week++) {
      const m = teamWeeks[teamId][week];

      if (!m) {
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
        const isHome = m.home === teamId;
        const opp = isHome ? m.away : m.home;

        schedule.push(
          createGame({
            week,
            opponent: opp,
            home: isHome,
            type: "REGULAR_SEASON"
          })
        );
      }
    }

    schedules[teamId] = schedule;
  });

  return schedules;
}

function generateAllSchedules() {
  console.log("[schedule-generator] Generating schedules...");
  const schedules = buildSchedules();

  TEAM_IDS.forEach((id) => {
    const file = path.join(OUTPUT_DIR, `${id}.json`);
    fs.writeFileSync(file, JSON.stringify(schedules[id], null, 2));
    console.log(`✓ Created schedule for ${id}`);
  });

  console.log("All schedules generated successfully.");
}

generateAllSchedules();
