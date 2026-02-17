// src/utils/scheduleGenerator.js
// Thin wrapper to keep existing imports working.

import { generateSeasonSchedule as coreGenerate, runScheduleTestWrapper as coreTest } from "./schedulegen";

export function generateSeasonSchedule(year) {
  return coreGenerate(year);
}

export function runScheduleTestWrapper(schedule, year) {
  return coreTest(schedule, year);
}
