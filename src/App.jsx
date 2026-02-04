// src/App.jsx
import React from "react";
import Sidebar from "./components/Sidebar";
import Layout from "./components/Layout";
import { useSelector } from "react-redux";

import TeamSelectScreen from "./screens/TeamSelectScreen";
import TeamPage from "./screens/TeamPage";

function App() {
  const selectedTeam = useSelector((state) => state.team.selectedTeam);

  return (
    <div style={{ display: "flex", height: "100vh", width: "100vw" }}>
      <Sidebar />

      <Layout>
        {!selectedTeam ? (
          <TeamSelectScreen />
        ) : (
          <TeamPage />
        )}
      </Layout>
    </div>
  );
}

export default App;
