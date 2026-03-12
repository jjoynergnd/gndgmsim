// src/App.jsx
import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Layout from "./components/Layout";

import TeamSelectScreen from "./screens/TeamSelectScreen";
import TeamPage from "./screens/TeamPage";
import GMpage from "./screens/OwnerGM/GMpage";
import OffseasonHub from "./screens/Offseason/OffseasonHub";

// ⭐ NEW — Main Menu system
import MainMenu from "./franchise/MainMenu/MainMenu";
import LoadGame from "./franchise/MainMenu/LoadGame";

// ⭐ NEW — Settings Page
import Settings from "./franchise/MainMenu/Settings";

// ⭐ NEW — Settings Hook
import useSettings from "./hooks/useSettings";

/*
|----------------------------------------------------------------------
| App Architecture
|
| Meta Routes (Main Menu):
|   - No sidebar
|
| Onboarding Routes:
|   - No sidebar
|
| In‑Franchise Routes:
|   - Sidebar enabled
|----------------------------------------------------------------------
*/

function App() {
  const { settings } = useSettings();

  // Apply theme globally (React 19 safe)
  useEffect(() => {
    Promise.resolve().then(() => {
      document.body.dataset.theme = settings.theme;
    });
  }, [settings.theme]);

  return (
    <Routes>

      {/* -------------------------------- */}
      {/* MAIN MENU (NEW LANDING PAGE)     */}
      {/* -------------------------------- */}
      <Route
        path="/main-menu"
        element={
          <Layout variant="onboarding">
            <MainMenu />
          </Layout>
        }
      />

      {/* -------------------------------- */}
      {/* SETTINGS PAGE (NEW)              */}
      {/* -------------------------------- */}
      <Route
        path="/settings"
        element={
          <Layout variant="onboarding">
            <Settings />
          </Layout>
        }
      />

      {/* -------------------------------- */}
      {/* LOAD GAME SCREEN                 */}
      {/* -------------------------------- */}
      <Route
        path="/load-game"
        element={
          <Layout variant="onboarding">
            <LoadGame />
          </Layout>
        }
      />

      {/* -------------------------------- */}
      {/* TEAM SELECT (NEW FRANCHISE)      */}
      {/* -------------------------------- */}
      <Route
        path="/team-select"
        element={
          <Layout variant="onboarding">
            <TeamSelectScreen />
          </Layout>
        }
      />

      {/* -------------------------------- */}
      {/* OWNER/GM ONBOARDING              */}
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
      {/* OFFSEASON HUB                    */}
      {/* -------------------------------- */}
      <Route
        path="/offseason"
        element={
          <div style={{ display: "flex", height: "100vh", width: "100vw" }}>
            <Sidebar />
            <Layout>
              <OffseasonHub />
            </Layout>
          </div>
        }
      />

      {/* -------------------------------- */}
      {/* TEAM PAGE (IN‑FRANCHISE)         */}
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

      {/* -------------------------------- */}
      {/* FALLBACK → MAIN MENU             */}
      {/* -------------------------------- */}
      <Route path="/" element={<Navigate to="/main-menu" replace />} />
      <Route path="*" element={<Navigate to="/main-menu" replace />} />
    </Routes>
  );
}

export default App;