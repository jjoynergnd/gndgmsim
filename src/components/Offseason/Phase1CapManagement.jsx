// src/components/offseason/Phase1CapManagement.jsx

import React, { useState } from "react";

import TeamStatusCard from "./Shared/TeamStatusCard";
import PlayerList from "./Shared/PlayerList";

import ExtendPlayerModal from "./Modals/ExtendPlayerModal";
import RestructurePlayerModal from "./Modals/RestructurePlayerModal";
import CutPlayerModal from "./Modals/CutPlayerModal";
import TagPlayerModal from "./Modals/TagPlayerModal";

export default function Phase1CapManagement({ state }) {
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

  const suggestionsMap = {};
  suggestions.cutCandidates.forEach((p) => (suggestionsMap[p.playerId] = "CUT"));
  suggestions.restructureCandidates.forEach(
    (p) => (suggestionsMap[p.playerId] = "RESTRUCTURE")
  );
  suggestions.resignPriority.forEach(
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

      {activeModal === "EXTEND" && selectedPlayer && (
        <ExtendPlayerModal
          player={selectedPlayer}
          options={state.extensionOptions[selectedPlayer.id]}
          year={year}
          onClose={closeModal}
          onConfirm={(data) => {
            state.applyExtension(selectedPlayer.id, data);
            markLastAction(selectedPlayer.id, "EXTEND");
            closeModal();
          }}
        />
      )}

      {activeModal === "RESTRUCTURE" && selectedPlayer && (
        <RestructurePlayerModal
          player={selectedPlayer}
          options={state.restructureOptions[selectedPlayer.id]}
          year={year}
          onClose={closeModal}
          onConfirm={(data) => {
            state.applyRestructure(selectedPlayer.id, data);
            markLastAction(selectedPlayer.id, "RESTRUCTURE");
            closeModal();
          }}
        />
      )}

      {activeModal === "CUT" && selectedPlayer && (
        <CutPlayerModal
          player={selectedPlayer}
          options={state.cutOptions[selectedPlayer.id]}
          year={year}
          onClose={closeModal}
          onConfirm={(data) => {
            state.applyCut(selectedPlayer.id, data);
            markLastAction(selectedPlayer.id, "CUT");
            closeModal();
          }}
        />
      )}

      {activeModal === "TAG" && selectedPlayer && (
        <TagPlayerModal
          player={selectedPlayer}
          tagInfo={state.tagOptions[selectedPlayer.id]}
          year={year}
          onClose={closeModal}
          onConfirm={() => {
            state.applyTag(selectedPlayer.id);
            markLastAction(selectedPlayer.id, "TAG");
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
