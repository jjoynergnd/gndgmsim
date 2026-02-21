// src/components/offseason/Phase1CapManagement.jsx

import React, { useState } from "react";
import { offseason } from "../../engine/offseason/masterOrchestrator";

import TeamStatusCard from "./Shared/TeamStatusCard";
import PlayerList from "./Shared/PlayerList";

import ExtendPlayerModal from "./Modals/ExtendPlayerModal";
import RestructurePlayerModal from "./Modals/RestructurePlayerModal";
import CutPlayerModal from "./Modals/CutPlayerModal";
import TagPlayerModal from "./Modals/TagPlayerModal";

export default function Phase1CapManagement() {
  // Force re-render when actions mutate orchestrator state
  const [, setRefresh] = useState(0);
  const triggerRefresh = () => setRefresh((r) => r + 1);

  // Always pull fresh state from orchestrator
  const state = offseason.getState();

  const {
    suggestions,
    playersUnderContract,
    year,
    cutOptions,
    restructureOptions,
  } = state;

  const [activeModal, setActiveModal] = useState(null);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [lastActionByPlayerId, setLastActionByPlayerId] = useState({});

  const handleAction = (player, action) => {
    setSelectedPlayer(player);
    setActiveModal(action);
  };

  const closeModal = () => {
    setActiveModal(null);
    setSelectedPlayer(null);
  };

  const markLastAction = (playerId, action) => {
    setLastActionByPlayerId((prev) => ({
      ...prev,
      [playerId]: action,
    }));
  };

  // Build suggestions map for PlayerList
  const suggestionsMap = {};
  suggestions.cutCandidates?.forEach(
    (p) => (suggestionsMap[p.playerId] = "CUT")
  );
  suggestions.restructureCandidates?.forEach(
    (p) => (suggestionsMap[p.playerId] = "RESTRUCTURE")
  );
  suggestions.resignPriority?.forEach(
    (p) => (suggestionsMap[p.playerId] = "EXTEND")
  );

  return (
    <div style={styles.container}>
      <div style={styles.fullWidthRow}>
        <TeamStatusCard state={state} />
      </div>

      <div style={styles.fullWidthRow}>
        <PlayerList
          players={playersUnderContract}
          suggestionsMap={suggestionsMap}
          onAction={handleAction}
          year={year}
          cutOptions={cutOptions}
          restructureOptions={restructureOptions}
          lastActionMap={lastActionByPlayerId}
        />
      </div>

      {/* EXTEND */}
      {activeModal === "EXTEND" && selectedPlayer && (
        <ExtendPlayerModal
          player={selectedPlayer}
          options={state.extensionOptions[selectedPlayer.id]}
          year={year}
          onClose={closeModal}
          onConfirm={(data) => {
            state.applyExtension(selectedPlayer.id, data);
            markLastAction(selectedPlayer.id, "EXTEND");
            triggerRefresh();
            closeModal();
          }}
        />
      )}

      {/* RESTRUCTURE */}
      {activeModal === "RESTRUCTURE" && selectedPlayer && (
        <RestructurePlayerModal
          player={selectedPlayer}
          options={state.restructureOptions[selectedPlayer.id]}
          year={year}
          onClose={closeModal}
          onConfirm={(data) => {
            state.applyRestructure(selectedPlayer.id, data);
            markLastAction(selectedPlayer.id, "RESTRUCTURE");
            triggerRefresh();
            closeModal();
          }}
        />
      )}

      {/* CUT */}
      {activeModal === "CUT" && selectedPlayer && (
        <CutPlayerModal
          player={selectedPlayer}
          options={state.cutOptions[selectedPlayer.id]}
          year={year}
          onClose={closeModal}
          onConfirm={(data) => {
            state.applyCut(selectedPlayer.id, data);
            markLastAction(selectedPlayer.id, "CUT");
            triggerRefresh();
            closeModal();
          }}
        />
      )}

      {/* TAG */}
      {activeModal === "TAG" && selectedPlayer && (
        <TagPlayerModal
          player={selectedPlayer}
          tagInfo={state.tagOptions[selectedPlayer.id]}
          year={year}
          onClose={closeModal}
          onConfirm={() => {
            state.applyTag(selectedPlayer.id);
            markLastAction(selectedPlayer.id, "TAG");
            triggerRefresh();
            closeModal();
          }}
        />
      )}
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: 24,
  },
  fullWidthRow: {
    width: "100%",
  },
};
