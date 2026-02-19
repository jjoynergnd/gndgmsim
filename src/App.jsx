// src/App.jsx
import React from "react";
import Sidebar from "./components/Sidebar";
import Layout from "./components/Layout";

import TeamSelectScreen from "./screens/TeamSelectScreen";
import TeamPage from "./screens/TeamPage";

import OffseasonHub from "./components/Offseason/OffseasonHub";
import {
  getState as getOffseasonState,
  isOffseasonStarted,
} from "./engine/offseason/offseasonOrchestrator";

import { Routes, Route, Navigate } from "react-router-dom";

/*
  IMPORTANT:
  We wrap the offseason guard inside a component instead of
  evaluating it directly inside the Route definition.

  This prevents a render-timing race where navigation occurs
  before the orchestrator singleton is visible to React.
*/
function OffseasonRoute() {
  if (!isOffseasonStarted()) {
    return <Navigate to="/" replace />;
  }

  return <OffseasonHub state={getOffseasonState()} />;
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
