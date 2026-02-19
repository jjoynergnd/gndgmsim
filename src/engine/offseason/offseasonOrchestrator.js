// src/engine/offseason/offseasonOrchestrator.js

// In-memory singleton orchestrator for the current user's franchise offseason.
// Long-term: this can be persisted, saved/loaded, or wrapped by Redux if desired.

let _offseasonState = null;

/**
 * PUBLIC API
 * ----------
 * startOffseason(teamId, leagueState)
 * getState()
 * applyExtension(playerId, data)
 * applyRestructure(playerId, data)
 * applyCut(playerId, data)
 * applyTag(playerId)
 * advancePhase()
 */

export function startOffseason(teamId, leagueState) {
  const team = leagueState.teams.find((t) => t.id === teamId);
  if (!team) {
    throw new Error(`Team ${teamId} not found in leagueState`);
  }

  const year = leagueState.currentYear || 2026;

  const players = team.roster.map((p) => ({
    ...p,
    contract: ensureCapHits(p.contract, year),
  }));

  const capSpace = team.meta.capSpace ?? 0;

  _offseasonState = {
    teamId,
    year,
    phase: "CAP_MANAGEMENT", // later: FREE_AGENCY, DRAFT, etc.
    players,
    staff: team.staff || [],
    capSpace,
    suggestions: generateSuggestions(players, capSpace),
    extensionOptions: buildExtensionOptions(players),
    restructureOptions: buildRestructureOptions(players),
    cutOptions: buildCutOptions(players),
    tagOptions: buildTagOptions(players),
  };

  return getState();
}

export function getState() {
  if (!_offseasonState) {
    throw new Error("Offseason not started. Call startOffseason(teamId, leagueState) first.");
  }

  const {
    teamId,
    year,
    phase,
    players,
    staff,
    capSpace,
    suggestions,
    extensionOptions,
    restructureOptions,
    cutOptions,
    tagOptions,
  } = _offseasonState;

  return {
    teamId,
    year,
    phase,
    playersUnderContract: players,
    staff,
    capSummary: {
      capSpace: roundM(capSpace),
      capHealth: capSpace > 0 ? "GREEN" : capSpace > -10000000 ? "YELLOW" : "RED",
    },
    suggestions,
    extensionOptions,
    restructureOptions,
    cutOptions,
    tagOptions,
    applyExtension,
    applyRestructure,
    applyCut,
    applyTag,
    advancePhase,
  };
}

export function applyExtension(playerId, data) {
  ensureState();
  const { players, year } = _offseasonState;
  const idx = players.findIndex((p) => p.id === playerId);
  if (idx === -1) return;

  const player = players[idx];
  const { extendType, yearsToAdd, apy } = data;

  const newContract = extendContract(player.contract, year, yearsToAdd, apy, extendType);
  players[idx] = {
    ...player,
    contract: newContract,
  };

  recomputeAfterChange();
}

export function applyRestructure(playerId, data) {
  ensureState();
  const { players, year } = _offseasonState;
  const idx = players.findIndex((p) => p.id === playerId);
  if (idx === -1) return;

  const player = players[idx];
  const { type } = data; // "STANDARD" or "VOID_YEAR"

  const newContract = restructureContract(player.contract, year, type);
  players[idx] = {
    ...player,
    contract: newContract,
  };

  recomputeAfterChange();
}

export function applyCut(playerId, data) {
  ensureState();
  const { players, year } = _offseasonState;
  const idx = players.findIndex((p) => p.id === playerId);
  if (idx === -1) return;

  const player = players[idx];
  const { cutType } = data; // "PRE_JUNE" or "POST_JUNE"

  const { capSpaceDelta } = computeCutImpact(player.contract, year, cutType);

  _offseasonState.capSpace += capSpaceDelta;
  players.splice(idx, 1);

  recomputeAfterChange();
}

export function applyTag(playerId) {
  ensureState();
  const { players, year, tagOptions } = _offseasonState;
  const idx = players.findIndex((p) => p.id === playerId);
  if (idx === -1) return;

  const player = players[idx];
  const tagInfo = tagOptions[playerId];
  if (!tagInfo) return;

  const tagValue = tagInfo.tagValue;

  const newContract = {
    ...player.contract,
    years: 1,
    totalValue: tagValue,
    capHits: {
      ...player.contract.capHits,
      [year]: tagValue,
    },
    expiresYear: year + 1,
    contractType: "FranchiseTag",
  };

  players[idx] = {
    ...player,
    contract: newContract,
  };

  _offseasonState.capSpace = tagInfo.capSpaceAfterRaw ?? _offseasonState.capSpace - tagValue;

  recomputeAfterChange();
}

export function advancePhase() {
  ensureState();
  const { phase } = _offseasonState;

  if (phase === "CAP_MANAGEMENT") {
    _offseasonState.phase = "FREE_AGENCY";
  } else if (phase === "FREE_AGENCY") {
    _offseasonState.phase = "DRAFT";
  } else if (phase === "DRAFT") {
    _offseasonState.phase = "SEASON";
  } else if (phase === "SEASON") {
    _offseasonState.phase = "COMPLETE";
  }

  return getState();
}

/* ----------------- INTERNAL HELPERS ----------------- */

function ensureState() {
  if (!_offseasonState) {
    throw new Error("Offseason not started. Call startOffseason(teamId, leagueState) first.");
  }
}

function recomputeAfterChange() {
  const { players } = _offseasonState;
  _offseasonState.capSpace = computeTeamCapSpace(players);
  _offseasonState.suggestions = generateSuggestions(players, _offseasonState.capSpace);
  _offseasonState.extensionOptions = buildExtensionOptions(players);
  _offseasonState.restructureOptions = buildRestructureOptions(players);
  _offseasonState.cutOptions = buildCutOptions(players);
  _offseasonState.tagOptions = buildTagOptions(players);
}

/* ---------- CONTRACT / CAP MATH (SIMPLIFIED FOR NOW) ---------- */

function ensureCapHits(contract, currentYear) {
  if (contract.capHits && Object.keys(contract.capHits).length > 0) {
    return contract;
  }

  const years = contract.years || 1;
  const totalValue = contract.totalValue || contract.capHit || 0;
  const signingBonus = contract.signingBonus || 0;

  const baseTotal = totalValue - signingBonus;
  const basePerYear = baseTotal / years;
  const bonusPerYear = signingBonus / years;

  const capHits = {};
  for (let i = 0; i < years; i++) {
    const year = currentYear + i;
    capHits[year] = Math.round(basePerYear + bonusPerYear);
  }

  return {
    ...contract,
    capHits,
    expiresYear: contract.expiresYear || currentYear + years,
  };
}

function computeTeamCapSpace(players) {
  const CAP_LIMIT = 250_000_000; // placeholder
  const currentYear = getCurrentYearFromPlayers(players);

  const totalCap = players.reduce((sum, p) => {
    const hit = p.contract?.capHits?.[currentYear] || 0;
    return sum + hit;
  }, 0);

  return CAP_LIMIT - totalCap;
}

function getCurrentYearFromPlayers(players) {
  if (!players.length) return 2026;
  const years = players
    .map((p) => Object.keys(p.contract?.capHits || {}))
    .flat()
    .map((y) => parseInt(y, 10))
    .filter((y) => !Number.isNaN(y));

  if (!years.length) return 2026;
  return Math.min(...years);
}

function extendContract(contract, currentYear, yearsToAdd, apy, extendType) {
  const existingCapHits = contract.capHits || {};
  const lastYear = Math.max(...Object.keys(existingCapHits).map((y) => parseInt(y, 10))) || currentYear;

  const newCapHits = { ...existingCapHits };
  for (let i = 1; i <= yearsToAdd; i++) {
    const year = lastYear + i;
    newCapHits[year] = Math.round(apy);
  }

  const totalValue =
    Object.values(newCapHits).reduce((sum, v) => sum + v, 0);

  return {
    ...contract,
    years: Object.keys(newCapHits).length,
    totalValue,
    capHits: newCapHits,
    expiresYear: lastYear + yearsToAdd,
    contractType: extendType === "EXTEND_RESTRUCTURE" ? "ExtensionRestructure" : "Extension",
  };
}

function restructureContract(contract, currentYear, type) {
  const capHits = { ...(contract.capHits || {}) };
  const remainingYears = Object.keys(capHits)
    .map((y) => parseInt(y, 10))
    .filter((y) => y >= currentYear)
    .sort((a, b) => a - b);

  if (!remainingYears.length) return contract;

  const totalRemaining = remainingYears.reduce((sum, y) => sum + capHits[y], 0);

  let yearsToSpread = remainingYears.length;
  if (type === "VOID_YEAR") {
    const lastYear = remainingYears[remainingYears.length - 1];
    const voidYear = lastYear + 1;
    remainingYears.push(voidYear);
    yearsToSpread += 1;
  }

  const newPerYear = Math.round(totalRemaining / yearsToSpread);
  const newCapHits = { ...capHits };
  remainingYears.forEach((y) => {
    newCapHits[y] = newPerYear;
  });

  const totalValue =
    Object.values(newCapHits).reduce((sum, v) => sum + v, 0);

  return {
    ...contract,
    capHits: newCapHits,
    years: Object.keys(newCapHits).length,
    totalValue,
  };
}

function computeCutImpact(contract, currentYear, cutType) {
  const capHits = contract.capHits || {};
  const remainingYears = Object.keys(capHits)
    .map((y) => parseInt(y, 10))
    .filter((y) => y >= currentYear)
    .sort((a, b) => a - b);

  if (!remainingYears.length) {
    return { deadMoney: 0, savings: 0, capSpaceDelta: 0 };
  }

  const thisYearHit = capHits[currentYear] || 0;
  const futureHits = remainingYears
    .filter((y) => y !== currentYear)
    .reduce((sum, y) => sum + capHits[y], 0);

  let deadMoney = 0;
  let savings = 0;

  if (cutType === "PRE_JUNE") {
    deadMoney = thisYearHit + futureHits;
    savings = 0;
  } else {
    deadMoney = thisYearHit;
    savings = futureHits;
  }

  const capSpaceDelta = savings - thisYearHit;

  return { deadMoney, savings, capSpaceDelta };
}

/* ---------- SUGGESTIONS & MODAL OPTIONS (SIMPLE HEURISTICS) ---------- */

function generateSuggestions(players) {
  const currentYear = getCurrentYearFromPlayers(players);

  const cutCandidates = players
    .filter((p) => {
      const hit = p.contract?.capHits?.[currentYear] || 0;
      return hit > 10_000_000;
    })
    .map((p) => {
      const { deadMoney, savings } = computeCutImpact(p.contract, currentYear, "PRE_JUNE");
      return {
        playerId: p.id,
        name: p.name,
        position: p.position,
        age: p.vitals?.age,
        capHit: roundM(p.contract?.capHits?.[currentYear] || 0),
        deadMoney: roundM(deadMoney),
        savings: roundM(savings),
        reason: "High cap hit vs role",
      };
    });

  const restructureCandidates = players
    .filter((p) => {
      const hit = p.contract?.capHits?.[currentYear] || 0;
      return hit > 15_000_000;
    })
    .map((p) => ({
      playerId: p.id,
      name: p.name,
      position: p.position,
      age: p.vitals?.age,
      capHit: roundM(p.contract?.capHits?.[currentYear] || 0),
      deadMoney: roundM(p.contract?.deadCap || 0),
      savings: 5.0,
      reason: "High base salary",
    }));

  const resignPriority = []; // to be filled when we wire expiring contracts

  return {
    cutCandidates,
    restructureCandidates,
    resignPriority,
  };
}

function buildExtensionOptions(players) {
  const currentYear = getCurrentYearFromPlayers(players);
  const map = {};

  players.forEach((p) => {
    const hit = p.contract?.capHits?.[currentYear] || 0;
    const marketApy = Math.max(5_000_000, hit * 1.1);
    const min = marketApy * 0.9;
    const max = marketApy * 1.3;

    map[p.id] = {
      marketApy: roundM(marketApy),
      marketRange: {
        min: roundM(min),
        max: roundM(max),
      },
      existingValue: roundM(
        Object.values(p.contract?.capHits || {}).reduce((sum, v) => sum + v, 0)
      ),
      existingYears: Object.keys(p.contract?.capHits || {}).length,
      restructureSavings: 3.0,
      guarantees: {
        atSigning: roundM(marketApy * 2),
        total: roundM(marketApy * 3),
      },
    };
  });

  return map;
}

function buildRestructureOptions(players) {
  const currentYear = getCurrentYearFromPlayers(players);
  const map = {};

  players.forEach((p) => {
    const hit = p.contract?.capHits?.[currentYear] || 0;
    if (!hit) return;

    const standardNewHit = hit * 0.7;
    const voidNewHit = hit * 0.65;

    map[p.id] = {
      standard: {
        years: 2,
        newCapHit: roundM(standardNewHit),
        capSavings: roundM(hit - standardNewHit),
        futureDeadMoney: roundM(hit * 0.5),
      },
      voidYear: {
        addedYears: 1,
        newCapHit: roundM(voidNewHit),
        capSavings: roundM(hit - voidNewHit),
        futureDeadMoney: roundM(hit * 0.7),
      },
    };
  });

  return map;
}

function buildCutOptions(players) {
  const currentYear = getCurrentYearFromPlayers(players);
  const map = {};

  players.forEach((p) => {
    const pre = computeCutImpact(p.contract, currentYear, "PRE_JUNE");
    const post = computeCutImpact(p.contract, currentYear, "POST_JUNE");

    map[p.id] = {
      preJune: {
        deadMoney: roundM(pre.deadMoney),
        savings: roundM(pre.savings),
      },
      postJune: {
        deadMoney: roundM(post.deadMoney),
        savings: roundM(post.savings),
      },
    };
  });

  return map;
}

function buildTagOptions(players) {
  const currentYear = getCurrentYearFromPlayers(players);
  const map = {};

  players.forEach((p) => {
    const hit = p.contract?.capHits?.[currentYear] || 0;
    const tagValue = Math.max(10_000_000, hit * 1.2);

    map[p.id] = {
      tagValue: roundM(tagValue),
      capSpaceAfter: roundM((_offseasonState?.capSpace || 0) - tagValue),
      capSpaceAfterRaw: (_offseasonState?.capSpace || 0) - tagValue,
    };
  });

  return map;
}

/* ---------- UTIL ---------- */

function roundM(value) {
  return Math.round((value / 1_000_000) * 10) / 10;
}
export function isOffseasonStarted() {
  return _offseasonState !== null;
}
