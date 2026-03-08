// src/generator/draft/generateProspect.ts

import type { ProspectState } from "../../state/prospect.js";
import type { PlayerTier } from "../config/tiers.js";
import type { DraftPosition } from "./types.js";

import { generateRatingsForPosition } from "./blueprints/ratingBlueprints.js";
import { assignArchetype } from "./blueprints/archetypeBlueprints.js";
import { generateCombine } from "./blueprints/combineBlueprints.js";
import { generatePersonalityProfile } from "./blueprints/personalityBlueprints.js";
import { generateDevelopmentCurve } from "./blueprints/developmentBlueprints.js";
import { generateProductionContext } from "./blueprints/productionContextBlueprints.js";
import { generateInjuryRisk } from "./blueprints/injuryBlueprints.js";
import { generateStorylines } from "./blueprints/storylineBlueprints.js";

import { randomCollege } from "../config/colleges.js";
import { randomName } from "./utils/names.js";
import { randInt, randFloat } from "../utils/random.js";

export function generateProspect(position: DraftPosition, year: number): ProspectState {
  const name = randomName();
  const college = randomCollege();

  const archetype = assignArchetype(position);
  const ratings = generateRatingsForPosition(position, archetype);

  const tierRoll = Math.random();
  const tier = (
    tierRoll < 0.05 ? "elite" :
    tierRoll < 0.25 ? "starter" :
    tierRoll < 0.70 ? "role" :
    "fringe"
  ) as PlayerTier;

  const potentialGrade: "A" | "B" | "C" | "D" | "F" = (() => {
    const r = Math.random();
    if (r < 0.10) return "A";
    if (r < 0.35) return "B";
    if (r < 0.70) return "C";
    if (r < 0.90) return "D";
    return "F";
  })();

  const potential = {
    grade: potentialGrade,
    ceilingBoost: randInt(2, 15),
    volatility: randFloat(0.05, 0.35),
  };

  const combine = generateCombine(position);
  const personalityProfile = generatePersonalityProfile();
  const development = generateDevelopmentCurve();
  const collegeContext = generateProductionContext();
  const injuryRisk = generateInjuryRisk();
  const story = generateStorylines(position);

  const draft = {
    projectedRound: randInt(1, 7),
    projectedPick: randInt(1, 256),
    bigBoardRank: 0,
    positionalRank: 0,
    strengths: story.strengths,
    weaknesses: story.weaknesses,
    scoutingReport: story.report,
  };

  const medical = {
    durabilityGrade: ["A", "B", "C", "D", "F"][randInt(0, 4)] as "A" | "B" | "C" | "D" | "F",
    redFlags: story.medicalFlags,
  };

  const background = {
    hometown: story.hometown,
    recruitingStars: randInt(1, 5),
    formerPosition: story.formerPosition,
    walkOn: Math.random() < 0.1,
  };

  return {
    id: crypto.randomUUID(),
    name,
    position,
    age: randInt(20, 23),
    height: randInt(68, 80),
    weight: randInt(180, 340),
    college,
    vitals: {
      handedness: Math.random() < 0.9 ? "Right" : "Left",
    },
    ratings,
    tier,
    archetype,
    potential,
    schemeFits: {},
    traits: {
      devTrait: story.devTrait,
      personality: story.personality,
      lockerRoom: story.lockerRoom,
      tags: story.tags,
      intangibles: story.intangibles,
    },
    personalityProfile,
    development,
    combine,
    draft,
    collegeContext,
    medical,
    injuryRisk,
    risk: {
      bustProbability: randFloat(0.05, 0.40),
      boomProbability: randFloat(0.05, 0.25),
    },
    background,
    storyTags: story.tags,
    collegeStats: story.stats,
    photo: story.photo,
  };
}