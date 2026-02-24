// src/engine/transactions/applyTeamUpdate.ts
// Centralized mutation pipeline for team-level updates

import fs from "fs";
import path from "path";

import { getLeagueCap } from "../../generator/cap/leagueCap.js";
import { getTeamTotalSalary, getTeamCapSpace } from "../../generator/cap/teamCapCalculator.js";

const ROSTER_DIR = path.join(process.cwd(), "src/data/rosters");
const META_DIR = path.join(process.cwd(), "src/data/meta");

function readJSON(filePath: string) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJSON(filePath: string, data: any) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
}

/**
 * applyTeamUpdate
 * ----------------
 * @param teamId - string (e.g. "CLE")
 * @param year - number (default 2026)
 * @param updateFn - function(roster) => { updatedRoster, ... }
 *
 * Loads roster → applies update → recalculates cap → writes updated files.
 */
export function applyTeamUpdate(
  teamId: string,
  year: number = 2026,
  updateFn: (roster: any[]) => { updatedRoster: any[]; [key: string]: any }
) {
  const rosterPath = path.join(ROSTER_DIR, `${teamId}.json`);
  const metaPath = path.join(META_DIR, `${teamId}.json`);

  const roster = readJSON(rosterPath);

  const result = updateFn(roster);

  if (result.error) {
    return { error: result.error };
  }

  const updatedRoster = result.updatedRoster;

  // Recompute cap using YEAR-AWARE multi-year contract logic
  const totalSalary = getTeamTotalSalary(updatedRoster, year);
  const leagueCap = getLeagueCap(year);
  const capSpace = getTeamCapSpace(totalSalary, leagueCap);

  // Write updated roster
  writeJSON(rosterPath, updatedRoster);

  // Write updated meta
  const updatedMeta = {
    teamId,
    year,
    totalSalary,
    leagueCap,
    capSpace
  };

  writeJSON(metaPath, updatedMeta);

  return {
    roster: updatedRoster,
    meta: updatedMeta,
    ...result
  };
}
