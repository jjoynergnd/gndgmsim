// src/components/Offseason/OffseasonHub.jsx

import React from "react";
import { offseason } from "../../engine/offseason/masterOrchestrator";

import OffseasonLayout from "./OffseasonLayout";
import Phase1CapManagement from "./Phase1CapManagement";
import Phase2FreeAgency from "./Phase2FreeAgency";
import Phase3Draft from "./Phase3Draft";

export default function OffseasonHub() {
  // Pull fresh state directly from orchestrator
  const state = offseason.getState();

  if (!state || !state.phase) {
    return <div style={{ padding: 20 }}>Offseason not initialized.</div>;
  }

  const { phase, teamMeta, capSummary, year } = state;

  const renderPhase = () => {
    switch (phase) {
      case "PHASE_1":
        return <Phase1CapManagement />;

      case "PHASE_2":
        return <Phase2FreeAgency />;

      case "PHASE_3":
        return <Phase3Draft />;

      default:
        return (
          <div style={{ padding: 20 }}>
            Unknown offseason phase: {phase}
          </div>
        );
    }
  };

  return (
    <OffseasonLayout
      teamMeta={teamMeta}
      capSummary={capSummary}
      phase={phase}
      year={year}
    >
      {renderPhase()}
    </OffseasonLayout>
  );
}
