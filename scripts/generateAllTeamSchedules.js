/* eslint-env node */

// scripts/generateAllTeamSchedules.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Correct import for your teams.js file
import { teams } from "../src/data/teams.js";


// Output directory
const OUTPUT_DIR = path.join(__dirname, "../src/data/schedules");

// Ensure directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const TEAM_IDS = teams.map(t => t.id);

// Fisher–Yates shuffle
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function generateTeamSchedule(teamId) {
  const otherTeams = TEAM_IDS.filter(t => t !== teamId);
  const shuffled = shuffle(otherTeams);

  const preseasonOpponents = shuffled.slice(0, 3);
  const regularOpponents = shuffled.slice(3, 20);

  const schedule = [];

  // Preseason weeks 1–3
  preseasonOpponents.forEach((opp, index) => {
    schedule.push({
      week: index + 1,
      opponent: opp,
      home: index % 2 === 0,
      played: false
    });
  });

  // Regular season weeks 4–20
  regularOpponents.forEach((opp, index) => {
    schedule.push({
      week: index + 4,
      opponent: opp,
      home: index % 2 === 1,
      played: false
    });
  });

  return schedule;
}

function generateAllSchedules() {
  TEAM_IDS.forEach(teamId => {
    const schedule = generateTeamSchedule(teamId);
    const filePath = path.join(OUTPUT_DIR, `${teamId}.json`);

    fs.writeFileSync(filePath, JSON.stringify(schedule, null, 2));
    console.log(`✓ Created schedule for ${teamId}`);
  });

  console.log("\nAll team schedules generated successfully.");
}

generateAllSchedules();
