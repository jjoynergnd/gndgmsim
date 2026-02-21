// scripts/generators/ratings.js

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

// ---------- BASE OVR TIER (Gritty Sim Spread) ----------
function pickBaseOverallTier() {
  const r = Math.random();

  if (r < 0.05) return randInt(92, 97);       // Elite
  if (r < 0.15) return randInt(88, 91);       // Star
  if (r < 0.35) return randInt(82, 87);       // Good starter
  if (r < 0.65) return randInt(76, 81);       // Avg starter
  if (r < 0.85) return randInt(70, 75);       // Low starter / high backup
  if (r < 0.95) return randInt(60, 69);       // Backup
  return randInt(50, 59);                     // Depth
}

function getBaseOverallForPosition(position) {
  const base = pickBaseOverallTier();

  if (position === "QB") return clamp(base + 3, 55, 97);
  if (["WR", "CB", "EDGE", "LT"].includes(position)) return clamp(base + 1, 50, 97);

  return base;
}

// ---------- POSITION-SPECIFIC OVR FORMULAS ----------
function computeOvr(position, r) {
  let ovr;

  switch (position) {
    case "QB": {
      const acc =
        r.shortAccuracy * 0.4 +
        r.mediumAccuracy * 0.35 +
        r.deepAccuracy * 0.25;
      ovr =
        acc * 0.35 +
        r.throwPower * 0.25 +
        r.awareness * 0.2 +
        r.throwOnRun * 0.1 +
        r.speed * 0.1;
      break;
    }

    case "RB": {
      const run =
        r.speed * 0.3 +
        r.acceleration * 0.2 +
        r.agility * 0.2 +
        r.breakTackle * 0.3;
      ovr =
        run * 0.6 +
        r.carrying * 0.25 +
        r.awareness * 0.1 +
        r.routeRunningShort * 0.05;
      break;
    }

    case "WR": {
      const rr =
        r.routeRunningShort * 0.3 +
        r.routeRunningMedium * 0.35 +
        r.routeRunningDeep * 0.35;
      ovr =
        rr * 0.4 +
        r.catching * 0.25 +
        r.release * 0.15 +
        r.speed * 0.15 +
        r.awareness * 0.05;
      break;
    }

    case "TE": {
      ovr =
        r.catching * 0.25 +
        r.routeRunningShort * 0.2 +
        r.routeRunningMedium * 0.15 +
        r.runBlock * 0.2 +
        r.passBlock * 0.1 +
        r.strength * 0.1;
      break;
    }

    case "LT":
    case "LG":
    case "C":
    case "RG":
    case "RT": {
      ovr =
        r.passBlock * 0.4 +
        r.runBlock * 0.3 +
        r.strength * 0.15 +
        r.awareness * 0.15;
      break;
    }

    case "LDE":
    case "RDE":
    case "LOLB":
    case "ROLB":
    case "EDGE": {
      const rush =
        r.finesseMoves * 0.5 +
        r.powerMoves * 0.5;
      ovr =
        rush * 0.45 +
        r.blockShedding * 0.25 +
        r.pursuit * 0.15 +
        r.speed * 0.1 +
        r.awareness * 0.05;
      break;
    }

    case "DT": {
      ovr =
        r.powerMoves * 0.3 +
        r.blockShedding * 0.3 +
        r.strength * 0.2 +
        r.awareness * 0.1 +
        r.tackle * 0.1;
      break;
    }

    case "MLB":
    case "ILB":
    case "LB": {
      ovr =
        r.tackle * 0.3 +
        r.blockShedding * 0.2 +
        r.pursuit * 0.2 +
        r.zoneCoverage * 0.15 +
        r.awareness * 0.15;
      break;
    }

    case "CB": {
      ovr =
        r.manCoverage * 0.35 +
        r.zoneCoverage * 0.25 +
        r.speed * 0.2 +
        r.acceleration * 0.1 +
        r.awareness * 0.1;
      break;
    }

    case "FS":
    case "SS":
    case "S": {
      ovr =
        r.zoneCoverage * 0.3 +
        r.manCoverage * 0.2 +
        r.speed * 0.2 +
        r.tackle * 0.15 +
        r.awareness * 0.15;
      break;
    }

    case "K": {
      ovr =
        r.kickPower * 0.5 +
        r.kickAccuracy * 0.5;
      break;
    }

    case "P": {
      ovr =
        r.kickPower * 0.6 +
        r.kickAccuracy * 0.4;
      break;
    }

    default: {
      ovr =
        r.awareness * 0.3 +
        r.speed * 0.2 +
        r.strength * 0.2 +
        r.tackle * 0.3;
      break;
    }
  }

  return Math.round(clamp(ovr, 40, 99));
}

// ---------- BASE CORE RATINGS (POSITION) ----------
function baseCoreRatings(position, baseOvr) {
  const spread = 8;
  const core = {};

  function coreStat(mult = 1) {
    const v = baseOvr + randInt(-spread, spread) * mult;
    return clamp(Math.round(v), 40, 99);
  }

  switch (position) {
    case "QB":
      core.throwPower = coreStat(1.0);
      core.shortAccuracy = coreStat(1.0);
      core.mediumAccuracy = coreStat(1.0);
      core.deepAccuracy = coreStat(1.0);
      core.throwOnRun = coreStat(0.9);
      core.playAction = coreStat(0.9);
      core.awareness = coreStat(0.9);
      core.speed = coreStat(0.6);
      core.acceleration = coreStat(0.7);
      core.agility = coreStat(0.7);
      core.strength = coreStat(0.5);
      break;

    case "RB":
      core.speed = coreStat(1.0);
      core.acceleration = coreStat(1.0);
      core.agility = coreStat(1.0);
      core.carrying = coreStat(0.9);
      core.breakTackle = coreStat(0.9);
      core.trucking = coreStat(0.8);
      core.awareness = coreStat(0.8);
      core.routeRunningShort = coreStat(0.6);
      core.routeRunningMedium = coreStat(0.5);
      core.routeRunningDeep = coreStat(0.4);
      core.passBlock = coreStat(0.5);
      core.runBlock = coreStat(0.5);
      core.strength = coreStat(0.7);
      break;

    case "WR":
      core.speed = coreStat(1.0);
      core.acceleration = coreStat(1.0);
      core.agility = coreStat(1.0);
      core.catching = coreStat(0.9);
      core.catchInTraffic = coreStat(0.9);
      core.specCatch = coreStat(0.9);
      core.routeRunningShort = coreStat(0.9);
      core.routeRunningMedium = coreStat(0.9);
      core.routeRunningDeep = coreStat(0.9);
      core.release = coreStat(0.9);
      core.jump = coreStat(0.9);
      core.awareness = coreStat(0.8);
      core.strength = coreStat(0.6);
      core.runBlock = coreStat(0.5);
      break;

    case "TE":
      core.speed = coreStat(0.8);
      core.acceleration = coreStat(0.8);
      core.catching = coreStat(0.9);
      core.catchInTraffic = coreStat(0.9);
      core.routeRunningShort = coreStat(0.8);
      core.routeRunningMedium = coreStat(0.8);
      core.runBlock = coreStat(0.9);
      core.passBlock = coreStat(0.8);
      core.strength = coreStat(0.9);
      core.awareness = coreStat(0.8);
      break;

    case "LT":
    case "LG":
    case "C":
    case "RG":
    case "RT":
      core.strength = coreStat(1.0);
      core.runBlock = coreStat(1.0);
      core.passBlock = coreStat(1.0);
      core.impactBlock = coreStat(0.9);
      core.awareness = coreStat(0.9);
      core.speed = coreStat(0.4);
      core.acceleration = coreStat(0.5);
      break;

    case "LDE":
    case "RDE":
    case "LOLB":
    case "ROLB":
    case "EDGE":
      core.speed = coreStat(0.9);
      core.acceleration = coreStat(0.9);
      core.strength = coreStat(0.9);
      core.finesseMoves = coreStat(1.0);
      core.powerMoves = coreStat(1.0);
      core.blockShedding = coreStat(0.9);
      core.pursuit = coreStat(0.9);
      core.tackle = coreStat(0.9);
      core.awareness = coreStat(0.8);
      break;

    case "DT":
      core.strength = coreStat(1.0);
      core.powerMoves = coreStat(1.0);
      core.blockShedding = coreStat(1.0);
      core.tackle = coreStat(0.9);
      core.pursuit = coreStat(0.8);
      core.awareness = coreStat(0.8);
      core.speed = coreStat(0.4);
      core.acceleration = coreStat(0.5);
      break;

    case "MLB":
    case "ILB":
    case "LB":
      core.speed = coreStat(0.8);
      core.acceleration = coreStat(0.8);
      core.tackle = coreStat(1.0);
      core.blockShedding = coreStat(0.9);
      core.pursuit = coreStat(0.9);
      core.zoneCoverage = coreStat(0.8);
      core.manCoverage = coreStat(0.7);
      core.awareness = coreStat(0.9);
      core.strength = coreStat(0.8);
      break;

    case "CB":
      core.speed = coreStat(1.0);
      core.acceleration = coreStat(1.0);
      core.agility = coreStat(1.0);
      core.manCoverage = coreStat(1.0);
      core.zoneCoverage = coreStat(0.9);
      core.press = coreStat(0.9);
      core.awareness = coreStat(0.9);
      core.jump = coreStat(0.9);
      core.tackle = coreStat(0.7);
      core.hitPower = coreStat(0.7);
      break;

    case "FS":
    case "SS":
    case "S":
      core.speed = coreStat(0.9);
      core.acceleration = coreStat(0.9);
      core.zoneCoverage = coreStat(1.0);
      core.manCoverage = coreStat(0.8);
      core.tackle = coreStat(0.9);
      core.pursuit = coreStat(0.9);
      core.awareness = coreStat(0.9);
      core.hitPower = coreStat(0.9);
      break;

    case "K":
      core.kickPower = coreStat(1.0);
      core.kickAccuracy = coreStat(1.0);
      core.awareness = coreStat(0.8);
      break;

    case "P":
      core.kickPower = coreStat(1.0);
      core.kickAccuracy = coreStat(0.9);
      core.awareness = coreStat(0.8);
      break;

    default:
      core.speed = coreStat(0.8);
      core.acceleration = coreStat(0.8);
      core.strength = coreStat(0.8);
      core.awareness = coreStat(0.8);
      core.tackle = coreStat(0.8);
      break;
  }

  return core;
}

// ---------- ARCHETYPE MODIFIERS ----------
function applyArchetypeModifiers(position, archetype, r) {
  switch (position) {
    case "QB": {
      if (archetype === "Field General") {
        r.shortAccuracy += 6;
        r.mediumAccuracy += 4;
        r.awareness += 4;
        r.speed -= 3;
      } else if (archetype === "Strong Arm") {
        r.throwPower += 8;
        r.deepAccuracy += 4;
        r.agility -= 3;
      } else if (archetype === "Improviser") {
        r.throwOnRun += 6;
        r.speed += 4;
        r.mediumAccuracy -= 3;
      }
      break;
    }

    case "RB": {
      if (archetype === "Power") {
        r.trucking += 8;
        r.strength += 5;
        r.agility -= 3;
      } else if (archetype === "Elusive") {
        r.agility += 7;
        r.speed += 3;
        r.trucking -= 3;
      } else if (archetype === "Receiving") {
        r.catching += 6;
        r.routeRunningShort += 5;
        r.passBlock += 3;
        r.trucking -= 3;
      }
      break;
    }

    case "WR": {
      if (archetype === "Deep Threat") {
        r.speed += 4;
        r.routeRunningDeep += 6;
        r.release -= 2;
      } else if (archetype === "Slot") {
        r.routeRunningShort += 6;
        r.agility += 4;
        r.routeRunningDeep -= 3;
      } else if (archetype === "Possession") {
        r.catching += 6;
        r.catchInTraffic += 5;
        r.release += 3;
        r.speed -= 2;
      }
      break;
    }

    case "TE": {
      if (archetype === "Vertical") {
        r.catching += 5;
        r.routeRunningMedium += 5;
        r.speed += 3;
        r.runBlock -= 3;
      } else if (archetype === "Blocking") {
        r.runBlock += 7;
        r.passBlock += 5;
        r.strength += 3;
        r.speed -= 3;
      } else if (archetype === "Hybrid") {
        r.catching += 3;
        r.runBlock += 3;
      }
      break;
    }

    case "EDGE": {
      if (archetype === "Speed Rusher") {
        r.speed += 4;
        r.finesseMoves += 6;
        r.powerMoves -= 3;
      } else if (archetype === "Power Rusher") {
        r.powerMoves += 6;
        r.strength += 4;
        r.speed -= 2;
      }
      break;
    }

    case "DT": {
      if (archetype === "Run Stopper") {
        r.blockShedding += 6;
        r.tackle += 4;
      } else if (archetype === "Power") {
        r.powerMoves += 6;
        r.strength += 4;
      }
      break;
    }

    case "LB": {
      if (archetype === "Field General") {
        r.awareness += 6;
        r.zoneCoverage += 4;
      } else if (archetype === "Pass Coverage") {
        r.zoneCoverage += 6;
        r.manCoverage += 4;
        r.tackle -= 2;
      } else if (archetype === "Run Stopper") {
        r.tackle += 6;
        r.blockShedding += 4;
        r.zoneCoverage -= 2;
      }
      break;
    }

    case "CB": {
      if (archetype === "Man") {
        r.manCoverage += 6;
        r.press += 4;
        r.zoneCoverage -= 2;
      } else if (archetype === "Zone") {
        r.zoneCoverage += 6;
        r.awareness += 4;
        r.manCoverage -= 2;
      } else if (archetype === "Hybrid") {
        r.manCoverage += 3;
        r.zoneCoverage += 3;
      }
      break;
    }

    case "FS":
    case "SS": {
      if (archetype === "Zone") {
        r.zoneCoverage += 6;
        r.awareness += 4;
      } else if (archetype === "Run Support") {
        r.tackle += 6;
        r.hitPower += 5;
        r.zoneCoverage -= 2;
      } else if (archetype === "Hybrid") {
        r.zoneCoverage += 3;
        r.tackle += 3;
      }
      break;
    }

    case "OL": {
      if (archetype === "Pass Protector") {
        r.passBlock += 6;
        r.awareness += 3;
        r.runBlock -= 2;
      } else if (archetype === "Run Blocker") {
        r.runBlock += 6;
        r.strength += 3;
        r.passBlock -= 2;
      }
      break;
    }

    case "K": {
      if (archetype === "Power") {
        r.kickPower += 5;
        r.kickAccuracy -= 2;
      } else if (archetype === "Accurate") {
        r.kickAccuracy += 5;
        r.kickPower -= 2;
      }
      break;
    }

    case "P": {
      if (archetype === "Power") {
        r.kickPower += 5;
      } else if (archetype === "Directional") {
        r.kickAccuracy += 5;
      }
      break;
    }

    default:
      break;
  }

  return r;
}

// ---------- POSITION CAPS (HARD + SOFT) ----------
function applyPositionCaps(position, r) {
  // Global clamps first
  Object.keys(r).forEach((k) => {
    r[k] = clamp(r[k], 40, 99);
  });

  switch (position) {
    case "QB": {
      r.speed = clamp(r.speed, 50, 88);
      r.acceleration = clamp(r.acceleration, 50, 90);
      r.agility = clamp(r.agility, 50, 90);
      r.tackle = clamp(r.tackle, 25, 40);
      r.press = clamp(r.press, 25, 35);
      r.blockShedding = clamp(r.blockShedding, 25, 35);
      r.powerMoves = clamp(r.powerMoves, 25, 35);
      r.finesseMoves = clamp(r.finesseMoves, 25, 35);
      r.catching = clamp(r.catching, 30, 55);
      r.routeRunningShort = clamp(r.routeRunningShort, 30, 50);
      r.routeRunningMedium = clamp(r.routeRunningMedium, 30, 50);
      r.routeRunningDeep = clamp(r.routeRunningDeep, 30, 50);
      r.kickPower = clamp(r.kickPower, 25, 40);
      r.kickAccuracy = clamp(r.kickAccuracy, 25, 40);
      break;
    }

    case "RB": {
      r.passBlock = clamp(r.passBlock, 40, 70); // some can be good
      r.routeRunningShort = clamp(r.routeRunningShort, 40, 70);
      r.routeRunningMedium = clamp(r.routeRunningMedium, 35, 65);
      r.routeRunningDeep = clamp(r.routeRunningDeep, 30, 60);
      break;
    }

    case "WR": {
      r.runBlock = clamp(r.runBlock, 40, 75); // rare great blockers
      r.passBlock = clamp(r.passBlock, 35, 65);
      r.powerMoves = clamp(r.powerMoves, 25, 40);
      r.finesseMoves = clamp(r.finesseMoves, 25, 40);
      r.blockShedding = clamp(r.blockShedding, 25, 45);
      break;
    }

    case "LT":
    case "LG":
    case "C":
    case "RG":
    case "RT": {
      r.speed = clamp(r.speed, 45, 70); // some athletic OL
      r.acceleration = clamp(r.acceleration, 50, 75);
      r.catching = clamp(r.catching, 30, 45);
      r.manCoverage = clamp(r.manCoverage, 25, 40);
      r.zoneCoverage = clamp(r.zoneCoverage, 25, 40);
      break;
    }

    case "LDE":
    case "RDE":
    case "LOLB":
    case "ROLB":
    case "EDGE": {
      r.speed = clamp(r.speed, 60, 85); // rare freaks
      r.acceleration = clamp(r.acceleration, 65, 88);
      break;
    }

    case "DT": {
      r.speed = clamp(r.speed, 45, 80); // rare quick DTs
      r.acceleration = clamp(r.acceleration, 50, 85);
      break;
    }

    case "CB": {
      r.tackle = clamp(r.tackle, 45, 75); // some can hit
      r.hitPower = clamp(r.hitPower, 40, 80);
      r.blockShedding = clamp(r.blockShedding, 30, 60);
      break;
    }

    case "FS":
    case "SS":
    case "S": {
      r.blockShedding = clamp(r.blockShedding, 35, 65);
      break;
    }

    case "K":
    case "P": {
      r.speed = clamp(r.speed, 40, 70);
      r.tackle = clamp(r.tackle, 25, 50);
      r.hitPower = clamp(r.hitPower, 25, 55);
      break;
    }

    default:
      break;
  }

  return r;
}

// ---------- PUBLIC API ----------
export function generateRatings(position, archetype) {
  const baseOvr = getBaseOverallForPosition(position);

  // 1) Base cluster by position
  let r = baseCoreRatings(position, baseOvr);

  // 2) Fill missing attributes with generic values around baseOvr
  const allKeys = [
    "speed", "acceleration", "agility", "strength", "awareness",
    "tackle", "pursuit", "hitPower",
    "manCoverage", "zoneCoverage", "press",
    "blockShedding", "finesseMoves", "powerMoves",
    "passBlock", "runBlock", "impactBlock",
    "catching", "catchInTraffic", "specCatch",
    "routeRunningShort", "routeRunningMedium", "routeRunningDeep",
    "release", "jump",
    "throwPower", "shortAccuracy", "mediumAccuracy", "deepAccuracy",
    "throwOnRun", "playAction",
    "kickPower", "kickAccuracy",
    "breakTackle", "trucking",
  ];

  allKeys.forEach((key) => {
    if (r[key] == null) {
      const v = baseOvr + randInt(-10, 10);
      r[key] = clamp(Math.round(v), 40, 99);
    }
  });

  // 3) Apply archetype modifiers
  r = applyArchetypeModifiers(position, archetype, r);

  // 4) Apply position caps (hard + soft)
  r = applyPositionCaps(position, r);

  // 5) Compute OVR after all adjustments
  const overall = computeOvr(position, r);

  // 6) Potential & scheme fit
  const potential = clamp(
    overall + randInt(-3, 10),
    Math.max(overall, 60),
    99
  );

  const schemeFit = clamp(
    overall + randInt(-5, 5),
    50,
    99
  );

  return {
    overall,
    potential,
    schemeFit,

    // Core athletic
    speed: r.speed,
    acceleration: r.acceleration,
    agility: r.agility,
    strength: r.strength,
    awareness: r.awareness,

    // Defense
    tackle: r.tackle,
    pursuit: r.pursuit,
    hitPower: r.hitPower,
    manCoverage: r.manCoverage,
    zoneCoverage: r.zoneCoverage,
    press: r.press,
    blockShedding: r.blockShedding,
    finesseMoves: r.finesseMoves,
    powerMoves: r.powerMoves,

    // Blocking
    passBlock: r.passBlock,
    runBlock: r.runBlock,
    impactBlock: r.impactBlock,

    // Receiving
    catching: r.catching,
    catchInTraffic: r.catchInTraffic,
    specCatch: r.specCatch,
    routeRunningShort: r.routeRunningShort,
    routeRunningMedium: r.routeRunningMedium,
    routeRunningDeep: r.routeRunningDeep,
    release: r.release,
    jump: r.jump,

    // QB
    throwPower: r.throwPower,
    shortAccuracy: r.shortAccuracy,
    mediumAccuracy: r.mediumAccuracy,
    deepAccuracy: r.deepAccuracy,
    throwOnRun: r.throwOnRun,
    playAction: r.playAction,

    // RB extras
    breakTackle: r.breakTackle,
    trucking: r.trucking,

    // K/P
    kickPower: r.kickPower,
    kickAccuracy: r.kickAccuracy,
  };
}
