// src/generator/draft/utils/names.ts

import { pickOne } from "../../utils/random.js";

const FIRST_NAMES = [
  "Jalen", "Marcus", "Derrick", "Trey", "Jordan", "Caleb", "Xavier", "Malik",
  "Ethan", "Cole", "Bryce", "Noah", "Jace", "Logan", "Aiden", "Zion",
  "Kendrick", "Tavion", "DeShawn", "Javon", "Khalil", "Amari"
];

const LAST_NAMES = [
  "Johnson", "Williams", "Brown", "Davis", "Miller", "Wilson", "Moore",
  "Taylor", "Anderson", "Thomas", "Jackson", "White", "Harris", "Martin",
  "Thompson", "Young", "Scott", "Green", "Baker", "Mitchell"
];

export function randomName(): string {
  return `${pickOne(FIRST_NAMES)} ${pickOne(LAST_NAMES)}`;
}