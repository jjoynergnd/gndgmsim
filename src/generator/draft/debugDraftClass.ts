import { generateDraftClass } from "./generateDraftClass.js";

const year = 2026;
const prospects = generateDraftClass(year);

console.log(`Generated ${prospects.length} prospects for draft ${year}`);
console.log("Top 10 Big Board:");
prospects
  .slice(0, 10)
  .forEach((p, i) => console.log(`${i + 1}. ${p.name} (${p.position}) — OVR ${p.ratings.ovr}`));