/* eslint-env node */
import fs from "fs";
import path from "path";
import { faker } from "@faker-js/faker";

import { generateMaleName } from "./generators/name.js";

const STAFF_ROLES = [
  "Head Coach",
  "Offensive Coordinator",
  "Defensive Coordinator",
  "Strength & Conditioning Coach",
  "Physical Therapist",
  "Athletic Trainer",
  "Analytics Coordinator",
];

function generateStaffMember(role, team, index) {
  return {
    id: `${team}-STAFF-${index}`,
    team,
    role,
    name: generateMaleName(),

    vitals: {
      age: faker.number.int({ min: 30, max: 65 }),
      experience: faker.number.int({ min: 3, max: 40 }),
    },

    ratings: {
      leadership: faker.number.int({ min: 60, max: 95 }),
      discipline: faker.number.int({ min: 60, max: 95 }),
      schemeKnowledge: faker.number.int({ min: 60, max: 95 }),
      playerDev: faker.number.int({ min: 60, max: 95 }),
      motivation: faker.number.int({ min: 60, max: 95 }),

      // Role-specific
      injuryManagement: role.includes("Therapist") || role.includes("Trainer")
        ? faker.number.int({ min: 70, max: 95 })
        : faker.number.int({ min: 40, max: 70 }),

      conditioning: role.includes("Strength")
        ? faker.number.int({ min: 75, max: 95 })
        : faker.number.int({ min: 40, max: 70 }),

      analyticsIQ: role.includes("Analytics")
        ? faker.number.int({ min: 80, max: 99 })
        : faker.number.int({ min: 40, max: 70 }),
    },

    contract: {
      years: faker.number.int({ min: 2, max: 5 }),
      salary: faker.number.int({ min: 500000, max: 8000000 }),
    },
  };
}

function generateStaff(team) {
  return STAFF_ROLES.map((role, i) =>
    generateStaffMember(role, team, i + 1)
  );
}

const TEAM = process.argv[2];

if (!TEAM) {
  console.error("Usage: node scripts/generateStaff.js <TEAM>");
  process.exit(1);
}

const outPath = path.join("src/data/staff", `${TEAM}.json`);
fs.writeFileSync(outPath, JSON.stringify(generateStaff(TEAM), null, 2));

console.log(`Generated staff for ${TEAM} → ${outPath}`);
