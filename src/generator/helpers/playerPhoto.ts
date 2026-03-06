// src/generator/helpers/playerPhoto.ts

import { Position } from "../config/positions.js";

export function pickPlayerPhoto(position: Position): string {
  // You will replace this later with real assets
  return `/player_faces/${position.toLowerCase()}/placeholder.png`;
}