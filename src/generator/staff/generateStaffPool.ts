// src/generator/staff/generateStaffPool.ts

import { StaffMember } from "../../state/franchise.js";
import { v4 as uuid } from "uuid";

// ---------------------------------------------
// ROLE DEFINITIONS (aligned to your staff file)
// ---------------------------------------------
const ROLE_DEFINITIONS = [
  { role: "HC", roleName: "Head Coach" },
  { role: "OC", roleName: "Offensive Coordinator" },
  { role: "DC", roleName: "Defensive Coordinator" },
  { role: "STC", roleName: "Strength & Conditioning Coach" },
  { role: "HAT", roleName: "Head Athletic Trainer" },
  { role: "DPP", roleName: "Director of Player Personnel" },
  { role: "HEAD_SCOUT", roleName: "Head Scout" },
  { role: "REGIONAL_SCOUT_EAST", roleName: "Regional Scout (East)" },
  { role: "REGIONAL_SCOUT_WEST", roleName: "Regional Scout (West)" },
  { role: "DA", roleName: "Director of Analytics" },
  { role: "QBC", roleName: "Quarterback Coach" },
];

// ---------------------------------------------
// ATTRIBUTE GENERATION HELPERS
// ---------------------------------------------
function rand(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function maybeElite(base: number): number {
  // 5% chance to generate elite attribute (96–99)
  if (Math.random() < 0.05) return rand(96, 99);
  return base;
}

// Option C ranges
function coreAttr(): number {
  return maybeElite(rand(60, 95));
}

function secondaryAttr(): number {
  return maybeElite(rand(50, 90));
}

// Scheme preferences for coaches
const OFFENSIVE_SCHEMES = ["spread", "west_coast", "power_run", "vertical"];
const DEFENSIVE_SCHEMES = ["three_four", "four_three", "hybrid"];

// ---------------------------------------------
// SALARY GENERATION
// ---------------------------------------------
function generateSalary(role: string, rating: number): number {
  // Base salary by role
  const base = {
    HC: 5500000,
    OC: 3000000,
    DC: 3000000,
    STC: 1500000,
    HAT: 1500000,
    DPP: 2500000,
    HEAD_SCOUT: 2200000,
    REGIONAL_SCOUT_EAST: 1200000,
    REGIONAL_SCOUT_WEST: 1200000,
    DA: 2000000,
    QBC: 1500000,
  }[role] ?? 1500000;

  // Rating multiplier
  const multiplier = 0.5 + rating / 100;

  return Math.floor(base * multiplier);
}

// ---------------------------------------------
// ATTRIBUTE GENERATION PER ROLE
// ---------------------------------------------
function generateAttributesForRole(role: string): Record<string, number | string> {
  switch (role) {
    case "HC":
      return {
        leadership: coreAttr(),
        culture: coreAttr(),
        strategy: coreAttr(),
        playerDevelopment: secondaryAttr(),
        discipline: coreAttr(),
        schemeOffense: OFFENSIVE_SCHEMES[rand(0, OFFENSIVE_SCHEMES.length - 1)],
        schemeDefense: DEFENSIVE_SCHEMES[rand(0, DEFENSIVE_SCHEMES.length - 1)],
        schemeFlexibility: secondaryAttr(),
        staffManagement: secondaryAttr(),
      };

    case "OC":
      return {
        playCalling: coreAttr(),
        qbDevelopment: coreAttr(),
        skillPlayerDevelopment: secondaryAttr(),
        offensiveSchemeKnowledge: coreAttr(),
        runGameDesign: secondaryAttr(),
        passGameDesign: secondaryAttr(),
        creativity: secondaryAttr(),
        schemePreference: OFFENSIVE_SCHEMES[rand(0, OFFENSIVE_SCHEMES.length - 1)],
      };

    case "DC":
      return {
        playCalling: coreAttr(),
        frontSevenDevelopment: secondaryAttr(),
        secondaryDevelopment: secondaryAttr(),
        defensiveSchemeKnowledge: coreAttr(),
        blitzDesign: secondaryAttr(),
        coverageDesign: secondaryAttr(),
        discipline: coreAttr(),
        schemePreference: DEFENSIVE_SCHEMES[rand(0, DEFENSIVE_SCHEMES.length - 1)],
      };

    case "STC":
      return {
        injuryPrevention: coreAttr(),
        recoverySpeed: coreAttr(),
        conditioning: secondaryAttr(),
        strengthTraining: secondaryAttr(),
        speedTraining: secondaryAttr(),
        workEthicBoost: secondaryAttr(),
      };

    case "HAT":
      return {
        diagnosisAccuracy: secondaryAttr(),
        rehabQuality: coreAttr(),
        injuryRiskAssessment: coreAttr(),
        returnToPlayConservatism: secondaryAttr(),
        longTermHealthManagement: secondaryAttr(),
      };

    case "DPP":
      return {
        proEvaluation: coreAttr(),
        contractInsight: coreAttr(),
        tradeValueAssessment: secondaryAttr(),
        rosterConstruction: secondaryAttr(),
        schemeFitAwareness: secondaryAttr(),
        developmentProjection: secondaryAttr(),
      };

    case "HEAD_SCOUT":
      return {
        draftBoardManagement: coreAttr(),
        prospectEvaluation: secondaryAttr(),
        combineInterpretation: secondaryAttr(),
        positionalNeedsAwareness: coreAttr(),
        scoutingAccuracy: secondaryAttr(),
        regionalCoordination: secondaryAttr(),
      };

    case "REGIONAL_SCOUT_EAST":
    case "REGIONAL_SCOUT_WEST":
      return {
        regionalKnowledge: secondaryAttr(),
        positionalStrengths: secondaryAttr(),
        evaluationAccuracy: secondaryAttr(),
        intangiblesAssessment: coreAttr(),
        schemeFitProjection: secondaryAttr(),
      };

    case "DA":
      return {
        modelingQuality: secondaryAttr(),
        fourthDownAggressiveness: coreAttr(),
        riskManagement: coreAttr(),
        contractValuation: secondaryAttr(),
        injuryRiskModeling: secondaryAttr(),
        tendencyAnalysis: secondaryAttr(),
      };

    case "QBC":
      return {
        mechanicsTraining: secondaryAttr(),
        decisionMakingTraining: coreAttr(),
        accuracyDevelopment: secondaryAttr(),
        pocketPresenceDevelopment: secondaryAttr(),
        leadershipMentoring: coreAttr(),
        filmStudyImpact: coreAttr(),
      };

    default:
      return {};
  }
}

// ---------------------------------------------
// GENERATE A SINGLE STAFF MEMBER
// ---------------------------------------------
function generateStaffMember(role: string, roleName: string): StaffMember {
  const attributes = generateAttributesForRole(role);

  // Compute a "rating" from core attributes
  const numericValues = Object.values(attributes).filter(v => typeof v === "number") as number[];
  const rating = Math.floor(numericValues.reduce((a, b) => a + b, 0) / numericValues.length);

  return {
    id: uuid(),
    role,
    roleCode: role,
    roleName,
    firstName: FIRST_NAMES[rand(0, FIRST_NAMES.length - 1)],
    lastName: LAST_NAMES[rand(0, LAST_NAMES.length - 1)],
    age: rand(35, 70),
    yearsExperience: rand(5, 30),
    attributes,
    contract: {
      years: rand(1, 4),
      salary: generateSalary(role, rating),
    },
  };
}

// ---------------------------------------------
// NAME POOLS
// ---------------------------------------------
const FIRST_NAMES = [
  "Chris", "Rudy", "Jermaine", "Ryan", "Ben", "Jeffrey", "Julius", "Rodolfo",
  "Clark", "Samuel", "Marcus", "Derrick", "Anthony", "James", "Evan", "Caleb",
  "Logan", "Victor", "Troy", "Darren"
];

const LAST_NAMES = [
  "Jakubowski", "Goodwin", "Franey", "Gutkowski", "Reichel", "Wehner", "Lehner",
  "Berge", "Hand", "Rutherford", "Manning", "Douglas", "Harrington", "Cole",
  "Benson", "Foster", "Hughes", "Knight", "Wells", "Simmons"
];

// ---------------------------------------------
// MAIN GENERATOR
// ---------------------------------------------
export function generateStaffPool(): StaffMember[] {
  const pool: StaffMember[] = [];

  // Generate 40–60 total staff candidates
  const total = rand(40, 60);

  for (let i = 0; i < total; i++) {
    const def = ROLE_DEFINITIONS[rand(0, ROLE_DEFINITIONS.length - 1)];
    pool.push(generateStaffMember(def.role, def.roleName));
  }

  return pool;
}