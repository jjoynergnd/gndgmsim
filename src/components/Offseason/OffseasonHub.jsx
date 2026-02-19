import React from "react";
import OffseasonLayout from "./OffseasonLayout";
import Phase1CapManagement from "./Phase1CapManagement";
import Phase2FreeAgency from "./Phase2FreeAgency";
import Phase3Draft from "./Phase3Draft";

export default function OffseasonHub({ state }) {
  const { phase, teamMeta, capSummary, year } = state;

  const renderPhase = () => {
    switch (phase) {
      case "CAP_MANAGEMENT":
        return <Phase1CapManagement state={state} />;
      case "FREE_AGENCY":
        return <Phase2FreeAgency state={state} />;
      case "DRAFT":
        return <Phase3Draft state={state} />;
      default:
        return null;
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
