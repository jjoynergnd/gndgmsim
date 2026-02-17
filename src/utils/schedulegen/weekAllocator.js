// src/utils/schedulegen/weekAllocator.js

// Slot-reservation style allocator.
// We predefine which weeks are used for which category for EVERY team.
// Then we fill those category slots with the actual games, deterministically.
//
// Category counts per team (from opponentBuilder):
//  - DIV   : 6
//  - INTRA : 4
//  - INTER : 4
//  - SOS   : 2
//  - EXTRA : 1
//  - BYE   : 1 (handled by byeAllocator)
//
// We define a global pattern of categories per week that matches these counts:
//  - 6 DIV weeks
//  - 4 INTRA weeks
//  - 4 INTER weeks
//  - 2 SOS weeks
//  - 1 EXTRA week
//  - 1 BYE week (not scheduled here)
//
// Weeks are 1–18. We only schedule games here; BYE is added later.

const TOTAL_WEEKS = 18;

// Category pattern per week (same for all teams).
// This spreads DIV across the season and avoids a 6-week DIV block.
const WEEK_CATEGORY_PATTERN = {
  1: "DIV",
  2: "INTRA",
  3: "INTER",
  4: "DIV",
  5: "SOS",
  6: "INTRA",
  7: "INTER",
  8: "DIV",
  9: "INTRA",
 10: "INTER",
 11: "DIV",
 12: "SOS",
 13: "DIV",
 14: "EXTRA",
 15: "INTER",
 16: "INTRA",
 17: "DIV",
 18: null // reserved for BYE or flexibility; we won't schedule here
};

function makePairKey(a, b) {
  return [a, b].sort().join("-");
}

// Build a normalized list of games from opponentsByTeam.
//  - DIV: keep both home/away, but enforce max 2 vs same rival
//  - non-DIV: unique pair per category
function buildGameList(opponentsByTeam) {
  const teamIds = Object.keys(opponentsByTeam).sort();

  const games = [];
  const seenNonDivPairsByCategory = {};
  const divPairCount = {}; // key: pairKey, value: count (max 2)

  for (const teamId of teamIds) {
    const gamesForTeam = opponentsByTeam[teamId];

    gamesForTeam.forEach((g) => {
      const { opponent, home, category } = g;
      if (!opponent) return;

      if (category === "DIV") {
        const pairKey = makePairKey(teamId, opponent);
        if (!divPairCount[pairKey]) divPairCount[pairKey] = 0;

        // We only want exactly 2 games per pair (home/away).
        if (divPairCount[pairKey] >= 2) {
          // Skip any extra DIV entries beyond the first 2.
          return;
        }

        const homeTeam = home ? teamId : opponent;
        const awayTeam = home ? opponent : teamId;

        games.push({
          home: homeTeam,
          away: awayTeam,
          category,
          week: null
        });

        divPairCount[pairKey] += 1;
      } else {
        if (!seenNonDivPairsByCategory[category]) {
          seenNonDivPairsByCategory[category] = new Set();
        }
        const key = makePairKey(teamId, opponent);
        if (seenNonDivPairsByCategory[category].has(key)) return;
        seenNonDivPairsByCategory[category].add(key);

        const homeTeam = home ? teamId : opponent;
        const awayTeam = home ? opponent : teamId;

        games.push({
          home: homeTeam,
          away: awayTeam,
          category,
          week: null
        });
      }
    });
  }

  // Deterministic ordering
  games.sort((a, b) => {
    const ka = `${a.category}-${a.home}-${a.away}`;
    const kb = `${b.category}-${b.home}-${b.away}`;
    return ka.localeCompare(kb);
  });

  return games;
}

// Build per-team tracking structures for week usage and category counts.
function initTeamState(opponentsByTeam) {
  const teamIds = Object.keys(opponentsByTeam).sort();
  const teamWeekUsed = {};
  const teamCategoryCount = {};
  const teamMaxCategory = {};

  teamIds.forEach((id) => {
    teamWeekUsed[id] = {};
    teamCategoryCount[id] = {
      DIV: 0,
      INTRA: 0,
      INTER: 0,
      SOS: 0,
      EXTRA: 0
    };
    // Expected counts per team (from opponentBuilder)
    teamMaxCategory[id] = {
      DIV: 6,
      INTRA: 4,
      INTER: 4,
      SOS: 2,
      EXTRA: 1
    };
  });

  return { teamIds, teamWeekUsed, teamCategoryCount, teamMaxCategory };
}

// Helper: get all weeks that are reserved for a given category.
function getWeeksForCategory(category) {
  const weeks = [];
  for (let w = 1; w <= TOTAL_WEEKS; w++) {
    if (WEEK_CATEGORY_PATTERN[w] === category) {
      weeks.push(w);
    }
  }
  return weeks;
}

// Build buckets (connected components) for a category's games.
// Each bucket should correspond to a 4x4 bipartite block (8 teams, 16 games).
function buildCategoryBuckets(categoryGames) {
  const buckets = [];

  // Build adjacency by team
  const adjacency = new Map();
  const gamesByTeam = new Map();

  for (let i = 0; i < categoryGames.length; i++) {
    const g = categoryGames[i];
    const { home, away } = g;

    if (!adjacency.has(home)) adjacency.set(home, new Set());
    if (!adjacency.has(away)) adjacency.set(away, new Set());
    adjacency.get(home).add(away);
    adjacency.get(away).add(home);

    if (!gamesByTeam.has(home)) gamesByTeam.set(home, []);
    if (!gamesByTeam.has(away)) gamesByTeam.set(away, []);
    gamesByTeam.get(home).push(i);
    gamesByTeam.get(away).push(i);
  }

  const visitedTeams = new Set();

  for (const team of adjacency.keys()) {
    if (visitedTeams.has(team)) continue;

    // BFS/DFS to get connected component
    const queue = [team];
    const componentTeams = [];
    visitedTeams.add(team);

    while (queue.length > 0) {
      const t = queue.shift();
      componentTeams.push(t);
      for (const neighbor of adjacency.get(t) || []) {
        if (!visitedTeams.has(neighbor)) {
          visitedTeams.add(neighbor);
          queue.push(neighbor);
        }
      }
    }

    // Collect games that involve any team in this component
    const componentGameIndices = new Set();
    for (const t of componentTeams) {
      for (const gi of gamesByTeam.get(t) || []) {
        componentGameIndices.add(gi);
      }
    }

    const bucketGames = Array.from(componentGameIndices).map(
      (idx) => categoryGames[idx]
    );

    buckets.push({
      teams: componentTeams,
      games: bucketGames
    });
  }

  return buckets;
}

// Infer the two sides (divisions) from the games in a bucket.
// Assumes strictly bipartite: all games are between sideA and sideB.
function inferSidesFromBucketGames(bucket) {
  const { games } = bucket;
  const teamSet = new Set();
  for (const g of games) {
    teamSet.add(g.home);
    teamSet.add(g.away);
  }
  const teams = Array.from(teamSet);

  const adjacency = new Map();
  for (const t of teams) adjacency.set(t, new Set());
  for (const g of games) {
    adjacency.get(g.home).add(g.away);
    adjacency.get(g.away).add(g.home);
  }

  // Pick an arbitrary team as sideA seed, then its neighbors are sideB.
  const [seed] = teams;
  const sideB = Array.from(adjacency.get(seed));
  const sideA = [seed, ...teams.filter((t) => t !== seed && !sideB.includes(t))];

  return { sideA, sideB };
}

// Build 4 rounds of bipartite pairings for 4x4 teams.
function buildBipartiteRounds(sideA, sideB) {
  const rounds = [];
  for (let r = 0; r < 4; r++) {
    const roundPairings = [];
    for (let i = 0; i < 4; i++) {
      const a = sideA[i];
      const b = sideB[(i + r) % 4];
      roundPairings.push({ a, b });
    }
    rounds.push(roundPairings);
  }
  return rounds;
}

// Pick a concrete game object index for a given team pair from the unused set.
function pickConcreteGameIndexForPair(teamA, teamB, unusedIndices, games) {
  for (const idx of unusedIndices) {
    const g = games[idx];
    const isMatch =
      (g.home === teamA && g.away === teamB) ||
      (g.home === teamB && g.away === teamA);
    if (isMatch) return idx;
  }
  return null;
}

// Deterministic round-robin assignment for INTRA and INTER.
// This sets game.week directly and updates teamWeekUsed/teamCategoryCount.
function assignIntraInterRoundRobin(
  games,
  gamesByCategory,
  teamWeekUsed,
  teamCategoryCount,
  teamMaxCategory
) {
  ["INTRA", "INTER"].forEach((category) => {
    const categoryGames = gamesByCategory[category];
    if (!categoryGames || categoryGames.length === 0) return;

    const weeksForCategory = getWeeksForCategory(category);
    if (weeksForCategory.length !== 4) {
      console.warn(
        `[weekAllocator] Expected 4 weeks for ${category}, found ${weeksForCategory.length}`
      );
      return;
    }

    // Build buckets (each should be an 8-team, 16-game bipartite block).
    const buckets = buildCategoryBuckets(categoryGames);

    buckets.forEach((bucket, bucketIndex) => {
      const { games: bucketGames } = bucket;

      // Map bucketGames back to indices in the main games array.
      const bucketGameIndices = bucketGames.map((bg) =>
        games.findIndex(
          (g) =>
            g.category === category &&
            g.home === bg.home &&
            g.away === bg.away &&
            g.week == null
        )
      );

      // Defensive: ensure we have 16 games and 8 teams.
      const teamSet = new Set();
      bucketGames.forEach((g) => {
        teamSet.add(g.home);
        teamSet.add(g.away);
      });

      if (teamSet.size !== 8 || bucketGameIndices.length !== 16) {
        console.warn(
          `[weekAllocator] ${category} bucket ${bucketIndex} not 8 teams / 16 games (teams=${teamSet.size}, games=${bucketGameIndices.length})`
        );
      }

      const { sideA, sideB } = inferSidesFromBucketGames(bucket);
      if (sideA.length !== 4 || sideB.length !== 4) {
        console.warn(
          `[weekAllocator] ${category} bucket ${bucketIndex} does not resolve to 4x4 sides (A=${sideA.length}, B=${sideB.length})`
        );
        return;
      }

      const rounds = buildBipartiteRounds(sideA, sideB);
      const unusedIndices = new Set(bucketGameIndices);

      // For this bucket, we still use the same 4 category weeks.
      // Buckets are disjoint in teams, so they can share weeks safely.
      for (let roundIndex = 0; roundIndex < 4; roundIndex++) {
        const week = weeksForCategory[roundIndex];
        const pairings = rounds[roundIndex];

        pairings.forEach(({ a, b }) => {
          const idx = pickConcreteGameIndexForPair(
            a,
            b,
            unusedIndices,
            games
          );
          if (idx == null) {
            console.error(
              `[weekAllocator] No concrete ${category} game found for pairing ${a} vs ${b} in bucket ${bucketIndex}, round ${roundIndex}`
            );
            return;
          }

          const g = games[idx];

          // Sanity: category cap and week availability.
          if (
            teamWeekUsed[a][week] ||
            teamWeekUsed[b][week] ||
            teamCategoryCount[a][category] >= teamMaxCategory[a][category] ||
            teamCategoryCount[b][category] >= teamMaxCategory[b][category]
          ) {
            console.error(
              `[weekAllocator] Conflict assigning ${category} game ${a} vs ${b} to week ${week}`
            );
            return;
          }

          g.week = week;
          teamWeekUsed[a][week] = true;
          teamWeekUsed[b][week] = true;
          teamCategoryCount[a][category] += 1;
          teamCategoryCount[b][category] += 1;
          unusedIndices.delete(idx);
        });
      }

      if (unusedIndices.size > 0) {
        console.warn(
          `[weekAllocator] ${category} bucket ${bucketIndex} has ${unusedIndices.size} unused games after round-robin`
        );
      }
    });
  });
}

// Try to assign games into the pre-reserved category slots.
// We now:
//  1) deterministically assign INTRA/INTER via round-robin buckets
//  2) greedily fill DIV/SOS/EXTRA per week as before
function assignGamesToWeeks(games, opponentsByTeam) {
  const { teamIds, teamWeekUsed, teamCategoryCount, teamMaxCategory } =
    initTeamState(opponentsByTeam);

  // Index games by category for faster access
  const gamesByCategory = {
    DIV: [],
    INTRA: [],
    INTER: [],
    SOS: [],
    EXTRA: []
  };

  games.forEach((g, idx) => {
    if (!gamesByCategory[g.category]) return;
    gamesByCategory[g.category].push({ ...g, index: idx });
  });

  // Track which games are assigned
  const assigned = new Array(games.length).fill(false);

  // 1) Deterministic round-robin for INTRA and INTER
  assignIntraInterRoundRobin(
    games,
    gamesByCategory,
    teamWeekUsed,
    teamCategoryCount,
    teamMaxCategory
  );

  // Mark INTRA/INTER games that already have a week as assigned
  games.forEach((g, idx) => {
    if (g.week != null && (g.category === "INTRA" || g.category === "INTER")) {
      assigned[idx] = true;
    }
  });

  // 2) For each week, assign games of that week's category (DIV/SOS/EXTRA)
  for (let week = 1; week <= TOTAL_WEEKS; week++) {
    const cat = WEEK_CATEGORY_PATTERN[week];
    if (!cat) {
      // Week reserved for BYE or left empty; we don't schedule here.
      continue;
    }

    // INTRA/INTER are already fully assigned by round-robin; skip them here.
    if (cat === "INTRA" || cat === "INTER") continue;

    const bucket = gamesByCategory[cat];
    if (!bucket || bucket.length === 0) continue;

    // We iterate over games in deterministic order and assign those
    // whose teams are free this week and still need this category.
    for (let i = 0; i < bucket.length; i++) {
      const g = bucket[i];
      if (assigned[g.index]) continue;

      const { home, away } = g;

      // Check if both teams are free this week
      if (teamWeekUsed[home][week] || teamWeekUsed[away][week]) continue;

      // Check category caps
      if (
        teamCategoryCount[home][cat] >= teamMaxCategory[home][cat] ||
        teamCategoryCount[away][cat] >= teamMaxCategory[away][cat]
      ) {
        continue;
      }

      // Assign this game to this week
      games[g.index].week = week;
      assigned[g.index] = true;

      teamWeekUsed[home][week] = true;
      teamWeekUsed[away][week] = true;

      teamCategoryCount[home][cat] += 1;
      teamCategoryCount[away][cat] += 1;
    }
  }

  // Debug: log any unassigned games
  games.forEach((g) => {
    if (g.week == null) {
      console.warn(
        "[weekAllocator] Final unassigned game:",
        g.home,
        "vs",
        g.away,
        "category",
        g.category
      );
    }
  });

  // Debug summary
  console.log("===== WEEK ALLOCATOR SUMMARY =====");
  teamIds.forEach((id) => {
    const used = Object.keys(teamWeekUsed[id])
      .map((w) => parseInt(w, 10))
      .sort((a, b) => a - b);
    console.log(`[WEEKS] ${id}: ${used.join(", ")}`);
  });
  console.log("===== END WEEK ALLOCATOR SUMMARY =====");

  return games;
}

export function allocateWeeks(opponentsByTeam) {
  // Build normalized game list with caps (especially DIV: max 2 vs same rival)
  const games = buildGameList(opponentsByTeam);

  // Assign weeks using slot-reservation pattern
  const scheduledGames = assignGamesToWeeks(games, opponentsByTeam);

  // Build per-team result
  const teamIds = Object.keys(opponentsByTeam).sort();
  const resultByTeam = {};
  teamIds.forEach((id) => {
    resultByTeam[id] = [];
  });

  scheduledGames.forEach((g) => {
    const { home, away, week, category } = g;
    if (week == null) {
      // We already logged this above; skip it here.
      return;
    }

    resultByTeam[home].push({
      opponent: away,
      home: true,
      category,
      week
    });
    resultByTeam[away].push({
      opponent: home,
      home: false,
      category,
      week
    });
  });

  return resultByTeam;
}
