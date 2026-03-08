// src/generator/draft/blueprints/photoBlueprints.ts

import { randInt } from "../../utils/random.js";

export function assignProspectPhoto(): string {
  // You can replace this with your real portrait generator later
  const id = randInt(1, 50); // assumes 50 placeholder images
  return `/images/prospects/${id}.png`;
}