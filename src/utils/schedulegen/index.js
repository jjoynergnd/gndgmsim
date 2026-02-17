// src/utils/schedulegen/index.js
import { buildOpponents } from "./opponentBuilder";
import { allocateWeeks } from "./weekAllocator";
import { allocateByes } from "./byeAllocator";
import { assembleSchedule } from "./scheduleAssembler";

export function generateSeasonSchedule(year) {
  const { opponentsByTeam } = buildOpponents(year);
  const withWeeks = allocateWeeks(opponentsByTeam, year);
  const byeWeeks = allocateByes(withWeeks, year);
  const schedule = assembleSchedule(withWeeks, byeWeeks, year);
  return schedule;
}

// For compatibility with your existing API
export function runScheduleTestWrapper() {
  console.log("[runScheduleTestWrapper] called — tests already run during assembly.");
}


