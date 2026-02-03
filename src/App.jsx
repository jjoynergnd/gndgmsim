// -----------------------------------------------------------------------------
// File: src/App.jsx
// Purpose:
//   This is the global application shell. It defines the main layout structure,
//   including the sidebar and the main content area. It also sets up the routing
//   placeholders for all major screens.
//
// Notes:
//   - The Sidebar component is always visible.
//   - The <main> area changes based on navigation.
//   - Actual routing logic will be added later (React Router or custom).
// -----------------------------------------------------------------------------

import React from "react";
import Sidebar from "./components/Sidebar";
import Layout from "./components/Layout";

function App() {
  return (
    <div style={{ display: "flex", height: "100vh", width: "100vw" }}>
      <Sidebar />

      <Layout>
        {/* 
          Placeholder for routed screens.
          Later we will replace this with <Routes> and <Route> components.
        */}
        <div style={{ padding: "20px" }}>
          <h1>Welcome to GND GM Simulator</h1>
          <p>Select an option from the sidebar to begin.</p>
        </div>
      </Layout>
    </div>
  );
}

export default App;
