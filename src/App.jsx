// src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Layout from "./components/Layout";

import TeamSelectScreen from "./screens/TeamSelectScreen";
import TeamPage from "./screens/TeamPage";
import GMpage from "./screens/OwnerGM/GMpage";

/*
|----------------------------------------------------------------------
| App Architecture
|
| Onboarding Routes:
|   - No sidebar
|
| App Routes:
|   - Sidebar enabled
|----------------------------------------------------------------------
*/

function App() {
  return (
    <Routes>

      {/* -------------------------------- */}
      {/* ONBOARDING — TEAM SELECT */}
      {/* -------------------------------- */}
      <Route
        path="/"
        element={
          <Layout variant="onboarding">
            <TeamSelectScreen />
          </Layout>
        }
      />

      {/* -------------------------------- */}
      {/* ONBOARDING — OWNER/GM PAGE */}
      {/* -------------------------------- */}
      <Route
        path="/gm/:teamId"
        element={
          <Layout variant="onboarding">
            <GMpage />
          </Layout>
        }
      />

      {/* -------------------------------- */}
      {/* MAIN APP (WITH SIDEBAR) */}
      {/* -------------------------------- */}
      <Route
        path="/team/:teamId"
        element={
          <div style={{ display: "flex", height: "100vh", width: "100vw" }}>
            <Sidebar />

            <Layout>
              <TeamPage />
            </Layout>
          </div>
        }
      />

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  );
}

export default App;