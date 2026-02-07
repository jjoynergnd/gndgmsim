/* eslint-env node */
import { execSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

import { teams } from "../src/data/teams.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function run(cmd) {
  console.log(`\n▶ ${cmd}`);
  execSync(cmd, { stdio: "inherit", cwd: path.join(__dirname, "..") });
}

function generateAllTeams() {
  const ids = teams.map((t) => t.id);

  ids.forEach((id) => {
    run(`node scripts/generateRoster.js ${id}`);
    run(`node scripts/generateStaff.js ${id}`);
  });

  console.log("\n✅ Finished generating rosters + staff for all teams.");
}

generateAllTeams();
