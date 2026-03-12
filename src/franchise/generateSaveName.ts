export function generateSaveName(teamName: string): string {
  const base = teamName.replace(/\s+/g, "");
  let index = 1;

  while (localStorage.getItem(`leagueState_${base}_${index}`)) {
    index++;
  }

  return `${base}_${index}`;
}