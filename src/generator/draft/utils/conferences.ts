// src/generator/draft/utils/conferences.ts

import { pickOne } from "../../utils/random.js";

export const CONFERENCES = [
  "SEC",
  "Big Ten",
  "ACC",
  "Big 12",
  "Pac-12",
  "AAC",
  "Mountain West",
  "Sun Belt",
  "MAC",
  "Independent",
];

export function randomConference(): string {
  return pickOne(CONFERENCES);
}