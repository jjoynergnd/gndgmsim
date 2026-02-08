// Full season loop engine with extension hooks

const PLAYOFF_ROUNDS = ["WILDCARD", "DIVISIONAL", "CONFERENCE", "SUPER_BOWL"];
const OFFSEASON_STEPS = ["RESIGNINGS", "FREE_AGENCY", "DRAFT", "PRESEASON"];

export function advanceSeason(prev, teamContext) {
  const season = { ...prev };

  // --- HOOKS (future logic) ---
  runWeekSimulation(season, teamContext);
  runPlayoffSimulation(season, teamContext);
  runOffseasonStep(season, teamContext);

  switch (season.phase) {
    case "PRESEASON": {
      season.phase = "REGULAR_SEASON";
      season.week = 1;
      season.playoffRound = null;
      season.offseasonStep = null;
      season.lastResult = {
        summary: "Preseason complete",
        details: "Your roster is set for Week 1."
      };
      return season;
    }

    case "REGULAR_SEASON": {
      if (season.week < 18) {
        season.week += 1;
      } else {
        season.phase = "PLAYOFFS";
        season.playoffRound = PLAYOFF_ROUNDS[0];
        season.week = null;
        season.lastResult = {
          summary: "Regular season complete",
          details: "Playoffs begin now."
        };
      }
      return season;
    }

    case "PLAYOFFS": {
      const idx = PLAYOFF_ROUNDS.indexOf(season.playoffRound);
      if (idx >= 0 && idx < PLAYOFF_ROUNDS.length - 1) {
        season.playoffRound = PLAYOFF_ROUNDS[idx + 1];
        season.lastResult = {
          summary: `${PLAYOFF_ROUNDS[idx]} round complete`,
          details: ""
        };
      } else {
        season.phase = "OFFSEASON";
        season.playoffRound = null;
        season.offseasonStep = OFFSEASON_STEPS[0];
        season.lastResult = {
          summary: "Season complete",
          details: "Offseason begins."
        };
      }
      return season;
    }

    case "OFFSEASON": {
      const idx = OFFSEASON_STEPS.indexOf(season.offseasonStep);
      if (idx >= 0 && idx < OFFSEASON_STEPS.length - 1) {
        season.offseasonStep = OFFSEASON_STEPS[idx + 1];
        season.lastResult = {
          summary: `${OFFSEASON_STEPS[idx]} complete`,
          details: ""
        };
      } else {
        season.year += 1;
        season.phase = "PRESEASON";
        season.week = 0;
        season.offseasonStep = null;
        season.playoffRound = null;
        season.lastResult = {
          summary: "Offseason complete",
          details: `Welcome to the ${season.year} season.`
        };
      }
      return season;
    }

    default:
      return season;
  }
}

// --------------------------------------------------
// WEEK SIMULATION (Increment 2 – Narrative Results)
// --------------------------------------------------
export function runWeekSimulation(SEASON, TEAM_CONTEXT) {
  if (SEASON.phase !== "REGULAR_SEASON") return;
  if (!SEASON.week) return;
  if (!TEAM_CONTEXT) return;

  const { roster = [], schedule = [] } = TEAM_CONTEXT;

  const matchup = schedule.find((g) => g.week === SEASON.week);
  const opponent = matchup?.opponent || "Opponent";
  const isHome = matchup?.home ?? true;

  // --- Score generation ---
  const base = 17 + rand(0, 14);
  const variance = rand(-7, 14);

  const scoreFor = base + Math.max(0, variance);
  const scoreAgainst = base + rand(-10, 10);

  const win = scoreFor >= scoreAgainst;

  // --- Star player selection ---
  const qb =
    roster.find(
      (p) =>
        p.position === "QB" &&
        p.depth === 1
    ) || null;

  let star = qb;

  if (!star) {
    star =
      roster
        .filter((p) => p.ratings?.overall >= 85)
        .sort((a, b) => b.ratings.overall - a.ratings.overall)[0] || null;
  }

  // --- Narrative ---
  let details = win
    ? "A strong team performance sealed the win."
    : "A tough loss despite some bright spots.";

  if (star) {
    const yards = rand(220, 380);
    const tds = rand(1, 4);

    details = `⭐ ${star.name} led the way with ${yards} yards and ${tds} TDs.`;
  }

  SEASON.lastResult = {
    summary: `${win ? "Win" : "Loss"} — ${scoreFor}-${scoreAgainst} ${
      isHome ? "vs" : "at"
    } ${opponent}`,
    details
  };
}

// --- FUTURE HOOKS ---
// --- FUTURE HOOKS ---
export function runPlayoffSimulation() {}
export function runOffseasonStep() {}
export function runPlayerDevelopment() {}
export function runCpuRosterLogic() {}
export function runInjurySimulation() {}
export function runScouting() {}
export function runDraftLogic() {}


export function getOffseasonSteps() {
  return OFFSEASON_STEPS;
}

export function getPlayoffRounds() {
  return PLAYOFF_ROUNDS;
}

// --- utils ---
function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
