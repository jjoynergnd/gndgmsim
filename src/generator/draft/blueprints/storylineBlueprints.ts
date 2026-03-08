// src/generator/draft/blueprints/storylineBlueprints.ts

import { pickOne, randInt, chance } from "../../utils/random.js";

const STRENGTHS = [
  "elite athleticism",
  "high football IQ",
  "great motor",
  "strong hands",
  "excellent burst",
  "natural leader",
  "versatile skillset",
  "great balance",
  "high effort player",
];

const WEAKNESSES = [
  "inconsistent technique",
  "raw fundamentals",
  "limited production",
  "injury history",
  "streaky performance",
  "needs better conditioning",
  "limited scheme experience",
];

const MEDICAL_FLAGS = [
  "previous ACL tear",
  "shoulder issues",
  "back tightness",
  "hamstring concerns",
  "ankle instability",
];

const HOMETOWNS = [
  "Miami, FL",
  "Atlanta, GA",
  "Houston, TX",
  "Los Angeles, CA",
  "Cleveland, OH",
  "Detroit, MI",
  "Charlotte, NC",
  "New Orleans, LA",
  "Phoenix, AZ",
];

const FORMER_POSITIONS = [
  "QB",
  "WR",
  "RB",
  "LB",
  "S",
  "TE",
  "none",
];

export function generateStorylines(position: string) {
  const strengths = [
    pickOne(STRENGTHS),
    pickOne(STRENGTHS),
  ];

  const weaknesses = [
    pickOne(WEAKNESSES),
  ];

  const medicalFlags = chance(0.15)
    ? [pickOne(MEDICAL_FLAGS)]
    : [];

  const hometown = pickOne(HOMETOWNS);

  const formerPosition = chance(0.2)
    ? pickOne(FORMER_POSITIONS)
    : null;

  const tags = [];

  if (formerPosition && formerPosition !== "none") {
    tags.push("positionConvert");
  }

  if (medicalFlags.length > 0) {
    tags.push("injuryConcern");
  }

  if (randInt(1, 100) < 10) {
    tags.push("smallSchoolStar");
  }

  const scoutingReport = `
${position} prospect with ${strengths.join(" and ")}. 
Shows ${weaknesses[0]} on tape. 
${medicalFlags.length ? "Medical red flag: " + medicalFlags[0] + "." : ""}
`.trim();

  return {
    strengths,
    weaknesses,
    medicalFlags,
    hometown,
    formerPosition,
    tags,
    intangibles: ["competitive", "coachable"],
    devTrait: "Normal",
    personality: "Balanced",
    lockerRoom: "Neutral",
    report: scoutingReport,
    stats: {
      gamesPlayed: randInt(8, 14),
      yards: randInt(200, 1500),
      touchdowns: randInt(0, 15),
      tackles: randInt(0, 120),
      sacks: randInt(0, 12),
      interceptions: randInt(0, 6),
    },
    photo: `/images/prospects/${randInt(1, 50)}.png`,
  };
}