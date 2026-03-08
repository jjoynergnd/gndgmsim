export function saveFranchise(franchise) {
  localStorage.setItem("leagueState", JSON.stringify(franchise));
}