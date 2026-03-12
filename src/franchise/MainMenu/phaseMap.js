// src/franchise/MainMenu/phaseMap.js

export const phaseMap = {
  OFFSEASON_STAFF: "Staff Hiring",
  OFFSEASON_CAP: "Cap Management",
  OFFSEASON_RESTRUCTURE: "Contract Adjustments",
  OFFSEASON_FREE_AGENCY: "Free Agency",
  OFFSEASON_DRAFT: "Draft",
  REGULAR_SEASON: "Regular Season",
  PLAYOFFS: "Playoffs",
  SUPER_BOWL: "Championship",
};

export function getPhaseLabel(code) {
  return phaseMap[code] || code;
}