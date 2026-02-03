// -----------------------------------------------------------------------------
// File: src/state/store.js
// Purpose:
//   Creates the global Redux store using Redux Toolkit's configureStore.
//   Combines all feature slices so the entire app can access shared state.
//
// Notes:
//   - Every slice must be imported and added to the reducer object.
//   - This file MUST export a default store or React will fail to mount.
// -----------------------------------------------------------------------------

import { configureStore } from "@reduxjs/toolkit";

import teamReducer from "./teamSlice";
import rosterReducer from "./rosterSlice";
import staffReducer from "./staffSlice";
import seasonReducer from "./seasonSlice";
import freeAgencyReducer from "./freeAgencySlice";
import tradeReducer from "./tradeSlice";
import draftReducer from "./draftSlice";

const store = configureStore({
  reducer: {
    team: teamReducer,
    roster: rosterReducer,
    staff: staffReducer,
    season: seasonReducer,
    freeAgency: freeAgencyReducer,
    trade: tradeReducer,
    draft: draftReducer,
  },
});

export default store;
