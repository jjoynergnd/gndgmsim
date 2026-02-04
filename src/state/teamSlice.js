import { createSlice } from "@reduxjs/toolkit";

const teamSlice = createSlice({
  name: "team",
  initialState: {
    selectedTeam: null,       // confirmed team
    pendingTeam: null,        // user clicked but not confirmed
  },
  reducers: {
    setPendingTeam: (state, action) => {
      state.pendingTeam = action.payload;
    },
    confirmTeam: (state) => {
      state.selectedTeam = state.pendingTeam;
    },
    clearPendingTeam: (state) => {
      state.pendingTeam = null;
    },
  },
});

export const { setPendingTeam, confirmTeam, clearPendingTeam } = teamSlice.actions;
export default teamSlice.reducer;
