// src/data/rosters/index.js

/**
 * Auto-exports all roster JSON files in this folder.
 * 
 * IMPORTANT:
 *   - Each file must be named TEAMID.json (e.g., ATL.json, BUF.json)
 *   - The export key will match the filename (ATL, BUF, DAL, etc.)
 */

const context = import.meta.glob("./*.json", { eager: true });

const rosters = {};

for (const path in context) {
  const fileName = path.split("/").pop().replace(".json", "");
  rosters[fileName] = context[path].default;
}

export default rosters;
