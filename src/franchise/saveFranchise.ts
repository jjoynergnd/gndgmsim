// src/franchise/saveFranchise.ts
import type { FranchiseState } from "../state/franchise.js";

export function saveFranchise(franchise: FranchiseState) {
  franchise.meta.lastSavedAt = Date.now();   // ⭐ update timestamp
  localStorage.setItem("leagueState", JSON.stringify(franchise));
}