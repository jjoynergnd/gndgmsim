// src/utils/schedulegen/byeAllocator.js

// Byes in weeks 5–14 when possible

const BYE_MIN = 5;
const BYE_MAX = 14;
const TOTAL_WEEKS = 18;

export function allocateByes(scheduleWithWeeksByTeam, year) {
  const teamIds = Object.keys(scheduleWithWeeksByTeam).sort();
  const byeWeeks = {};

  teamIds.forEach((teamId, idx) => {
    const games = scheduleWithWeeksByTeam[teamId];

    const weeksUsed = new Set(games.map((g) => g.week));
    let bye = null;

    // Prefer 5–14
    for (let w = BYE_MIN; w <= BYE_MAX; w++) {
      if (!weeksUsed.has(w)) {
        bye = w;
        break;
      }
    }

    // Fallback: any free week
    if (bye == null) {
      for (let w = 1; w <= TOTAL_WEEKS; w++) {
        if (!weeksUsed.has(w)) {
          bye = w;
          break;
        }
      }
    }

    // Absolute fallback: deterministic pseudo if somehow full (shouldn't happen)
    if (bye == null) {
      bye = BYE_MIN + ((year + idx) % (BYE_MAX - BYE_MIN + 1));
    }

    byeWeeks[teamId] = bye;
  });

  console.log("===== BYE ALLOCATOR =====");
  Object.entries(byeWeeks).forEach(([id, w]) => {
    console.log(`[BYE] ${id} => week ${w}`);
  });
  console.log("===== END BYE ALLOCATOR =====");

  return byeWeeks;
}
