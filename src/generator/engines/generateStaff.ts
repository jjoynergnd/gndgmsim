import fs from "fs";
import path from "path";
import { faker } from "@faker-js/faker";
import {
  StaffMember,
  StaffRole,
  HeadCoachType
} from "../../types/staff/StaffMember.js";

// ---------------------------------------------
// Constants
// ---------------------------------------------

const TEAMS = [
  "ARI","ATL","BAL","BUF","CAR","CHI","CIN","CLE","DAL","DEN","DET","GB","HOU","IND",
  "JAX","KC","LV","LAC","LAR","MIA","MIN","NE","NO","NYG","NYJ","PHI","PIT","SEA","SF","TB","TEN","WAS"
];

const HC_TYPES: HeadCoachType[] = [
  "ceo",
  "mastermind",
  "teacher",
  "strategist",
  "hybrid"
];

const ROLE_NAMES: Record<StaffRole, string> = {
  HC: "Head Coach",
  OC: "Offensive Coordinator",
  DC: "Defensive Coordinator",
  STC: "Strength & Conditioning Coach",
  HAT: "Head Athletic Trainer",
  DPP: "Director of Player Personnel",
  HEAD_SCOUT: "Head Scout",
  REGIONAL_SCOUT_EAST: "Regional Scout (East)",
  REGIONAL_SCOUT_WEST: "Regional Scout (West)",
  DA: "Director of Analytics",
  QBC: "Quarterback Coach"
};

const ROLES: StaffRole[] = [
  "HC",
  "OC",
  "DC",
  "STC",
  "HAT",
  "DPP",
  "HEAD_SCOUT",
  "REGIONAL_SCOUT_EAST",
  "REGIONAL_SCOUT_WEST",
  "DA",
  "QBC"
];

// ---------------------------------------------
// Helpers
// ---------------------------------------------

const random = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const pick = <T>(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];

const baseStaff = (role: StaffRole) => ({
  id: faker.string.uuid(),
  firstName: faker.person.firstName("male"), // MALE ONLY
  lastName: faker.person.lastName(),
  role,
  roleCode: role,
  roleName: ROLE_NAMES[role],
  age: random(35, 68),
  yearsExperience: random(5, 30)
});

// ---------------------------------------------
// Role Generators
// ---------------------------------------------

const generateStaffMember = (role: StaffRole): StaffMember => {
  switch (role) {
    case "HC":
      return {
        ...baseStaff("HC"),
        role: "HC",
        type: pick(HC_TYPES),
        leadership: random(60, 99),
        culture: random(60, 99),
        strategy: random(60, 99),
        playerDevelopment: random(60, 99),
        discipline: random(60, 99),
        schemeOffense: pick(["west_coast", "spread", "vertical", "power_run", "zone_run"]),
        schemeDefense: pick(["four_three", "three_four", "hybrid", "nickel_heavy"]),
        schemeFlexibility: random(40, 95),
        staffManagement: random(60, 99)
      };

    case "OC":
      return {
        ...baseStaff("OC"),
        role: "OC",
        playCalling: random(60, 99),
        qbDevelopment: random(60, 99),
        skillPlayerDevelopment: random(60, 99),
        offensiveSchemeKnowledge: random(60, 99),
        runGameDesign: random(60, 99),
        passGameDesign: random(60, 99),
        creativity: random(60, 99),
        schemePreference: pick(["west_coast", "spread", "vertical"])
      };

    case "DC":
      return {
        ...baseStaff("DC"),
        role: "DC",
        playCalling: random(60, 99),
        frontSevenDevelopment: random(60, 99),
        secondaryDevelopment: random(60, 99),
        defensiveSchemeKnowledge: random(60, 99),
        blitzDesign: random(60, 99),
        coverageDesign: random(60, 99),
        discipline: random(60, 99),
        schemePreference: pick(["four_three", "three_four", "hybrid"])
      };

    case "STC":
      return {
        ...baseStaff("STC"),
        role: "STC",
        injuryPrevention: random(60, 99),
        recoverySpeed: random(60, 99),
        conditioning: random(60, 99),
        strengthTraining: random(60, 99),
        speedTraining: random(60, 99),
        workEthicBoost: random(60, 99)
      };

    case "HAT":
      return {
        ...baseStaff("HAT"),
        role: "HAT",
        diagnosisAccuracy: random(60, 99),
        rehabQuality: random(60, 99),
        injuryRiskAssessment: random(60, 99),
        returnToPlayConservatism: random(40, 99),
        longTermHealthManagement: random(60, 99)
      };

    case "DPP":
      return {
        ...baseStaff("DPP"),
        role: "DPP",
        proEvaluation: random(60, 99),
        contractInsight: random(60, 99),
        tradeValueAssessment: random(60, 99),
        rosterConstruction: random(60, 99),
        schemeFitAwareness: random(60, 99),
        developmentProjection: random(60, 99)
      };

    case "HEAD_SCOUT":
      return {
        ...baseStaff("HEAD_SCOUT"),
        role: "HEAD_SCOUT",
        draftBoardManagement: random(60, 99),
        prospectEvaluation: random(60, 99),
        combineInterpretation: random(60, 99),
        positionalNeedsAwareness: random(60, 99),
        scoutingAccuracy: random(60, 99),
        regionalCoordination: random(60, 99)
      };

    case "REGIONAL_SCOUT_EAST":
      return {
        ...baseStaff("REGIONAL_SCOUT_EAST"),
        role: "REGIONAL_SCOUT_EAST",
        regionalKnowledge: random(60, 99),
        positionalStrengths: random(60, 99),
        evaluationAccuracy: random(60, 99),
        intangiblesAssessment: random(60, 99),
        schemeFitProjection: random(60, 99)
      };

    case "REGIONAL_SCOUT_WEST":
      return {
        ...baseStaff("REGIONAL_SCOUT_WEST"),
        role: "REGIONAL_SCOUT_WEST",
        regionalKnowledge: random(60, 99),
        positionalStrengths: random(60, 99),
        evaluationAccuracy: random(60, 99),
        intangiblesAssessment: random(60, 99),
        schemeFitProjection: random(60, 99)
      };

    case "DA":
      return {
        ...baseStaff("DA"),
        role: "DA",
        modelingQuality: random(60, 99),
        fourthDownAggressiveness: random(40, 99),
        riskManagement: random(60, 99),
        contractValuation: random(60, 99),
        injuryRiskModeling: random(60, 99),
        tendencyAnalysis: random(60, 99)
      };

    case "QBC":
      return {
        ...baseStaff("QBC"),
        role: "QBC",
        mechanicsTraining: random(60, 99),
        decisionMakingTraining: random(60, 99),
        accuracyDevelopment: random(60, 99),
        pocketPresenceDevelopment: random(60, 99),
        leadershipMentoring: random(60, 99),
        filmStudyImpact: random(60, 99)
      };
  }
};

// ---------------------------------------------
// Output
// ---------------------------------------------

const OUTPUT_DIR = path.join(process.cwd(), "src/data/staff");

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

TEAMS.forEach(team => {
  const staff = ROLES.map(role => generateStaffMember(role));
  const filePath = path.join(OUTPUT_DIR, `${team}.json`);
  fs.writeFileSync(filePath, JSON.stringify(staff, null, 2));
  console.log(`Generated staff for ${team}`);
});