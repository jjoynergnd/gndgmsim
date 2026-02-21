// src/App.jsx
import React from "react";
import Sidebar from "./components/Sidebar";
import Layout from "./components/Layout";

import TeamSelectScreen from "./screens/TeamSelectScreen";
import TeamPage from "./screens/TeamPage";

import OffseasonHub from "./components/Offseason/OffseasonHub";

// NEW: import the new orchestrator
import { offseason } from "./engine/offseason/masterOrchestrator";

import { Routes, Route, Navigate } from "react-router-dom";

/*
  Updated OffseasonRoute:
  Uses the NEW orchestrator instead of the old one.
*/
function OffseasonRoute() {
  const state = offseason.getState();

  // If no phase is set, offseason hasn't started
  if (!state || !state.phase) {
    return <Navigate to="/" replace />;
  }

  return <OffseasonHub />;
}


function App() {
  console.log("APP RENDER START");

  return (
    <div style={{ display: "flex", height: "100vh", width: "100vw" }}>
      <Sidebar />

      <Layout>
        <Routes>
          {/* TEAM SELECT */}
          <Route path="/" element={<TeamSelectScreen />} />

          {/* TEAM PAGE */}
          <Route path="/team" element={<TeamPage />} />

          {/* OFFSEASON HUB */}
          <Route path="/offseason" element={<OffseasonRoute />} />

          {/* FALLBACK */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </div>
  );
}

export default App;
