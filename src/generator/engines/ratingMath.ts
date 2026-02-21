import { gaussian } from "../utils/gaussian.js";

export function clamp(v: number, min = 40, max = 99) {
  return Math.max(min, Math.min(max, Math.round(v)));
}

export function roll(mean: number, std: number) {
  return clamp(gaussian(mean, std));
}
