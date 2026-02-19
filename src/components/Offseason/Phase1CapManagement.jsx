// src/components/offseason/Phase1CapManagement.jsx

import React, { useState } from "react";

import TeamStatusCard from "./Shared/TeamStatusCard";
import SuggestionSection from "./Shared/SuggestionSection";
import PlayerList from "./Shared/PlayerList";

import ExtendPlayerModal from "./Modals/ExtendPlayerModal";
import RestructurePlayerModal from "./Modals/RestructurePlayerModal";
import CutPlayerModal from "./Modals/CutPlayerModal";
import TagPlayerModal from "./Modals/TagPlayerModal";

export default function Phase1CapManagement({ state }) {
  const { suggestions, playersUnderContract } = state;

  const [activeModal, setActiveModal] = useState(null); // "EXTEND", "RESTRUCTURE", "CUT", "TAG"
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  const handleAction = (player, action) => {
    setSelectedPlayer(player);
    setActiveModal(action);
  };

  const closeModal = () => {
    setActiveModal(null);
    setSelectedPlayer(null);
  };

  return (
    <div style={styles.container}>

      {/* Full-width Team Status */}
      <div style={styles.fullWidthRow}>
        <TeamStatusCard state={state} />
      </div>

      {/* Suggestions row (will become collapsible in Step 4) */}
      <div style={styles.fullWidthRow}>
        <SuggestionSection suggestions={suggestions} />
      </div>

      {/* Player list */}
      <div style={styles.fullWidthRow}>
        <PlayerList players={playersUnderContract} onAction={handleAction} />
      </div>

      {/* MODALS */}
      {activeModal === "EXTEND" && selectedPlayer && (
        <ExtendPlayerModal
          player={selectedPlayer}
          options={state.extensionOptions[selectedPlayer.id]}
          onClose={closeModal}
          onConfirm={(data) => {
            state.applyExtension(selectedPlayer.id, data);
            closeModal();
          }}
        />
      )}

      {activeModal === "RESTRUCTURE" && selectedPlayer && (
        <RestructurePlayerModal
          player={selectedPlayer}
          options={state.restructureOptions[selectedPlayer.id]}
          onClose={closeModal}
          onConfirm={(data) => {
            state.applyRestructure(selectedPlayer.id, data);
            closeModal();
          }}
        />
      )}

      {activeModal === "CUT" && selectedPlayer && (
        <CutPlayerModal
          player={selectedPlayer}
          options={state.cutOptions[selectedPlayer.id]}
          onClose={closeModal}
          onConfirm={(data) => {
            state.applyCut(selectedPlayer.id, data);
            closeModal();
          }}
        />
      )}

      {activeModal === "TAG" && selectedPlayer && (
        <TagPlayerModal
          player={selectedPlayer}
          tagInfo={state.tagOptions[selectedPlayer.id]}
          onClose={closeModal}
          onConfirm={() => {
            state.applyTag(selectedPlayer.id);
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
