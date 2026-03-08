export function loadFranchise() {
  const raw = localStorage.getItem("leagueState");
  return raw ? JSON.parse(raw) : null;
}