import rosters from "../data/rosters";
import metas from "../data/meta";
import staffs from "../data/staff";

/**
 * Dynamically builds a mock league state from your /data folders.
 * Supports ANY team you have JSON files for.
 */

export const mockLeagueState = {
  meta: {
    currentYear: new Date().getFullYear(),
  },

  teams: {},
  players: [],
};

// Build teams + players dynamically
for (const teamId of Object.keys(rosters)) {
  const roster = rosters[teamId];
  const meta = metas[teamId];
  const staff = staffs[teamId];

  mockLeagueState.teams[teamId] = {
    id: teamId,
    meta,
    staff,
  };

  roster.forEach((p) => {
    mockLeagueState.players.push({
      ...p,
      teamId,
    });
  });
}
