import ATL_ROSTER from "../data/rosters/ATL.json";
import ATL_META from "../data/meta/ATL.json";
import ATL_STAFF from "../data/staff/ATL.json";

export const mockLeagueState = {
  currentYear: 2026,
  teams: [
    {
      id: "ATL",
      roster: ATL_ROSTER,
      meta: ATL_META,
      staff: ATL_STAFF,
    },
  ],
};
