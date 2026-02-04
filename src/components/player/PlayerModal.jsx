import React from "react";

const PlayerModal = ({ player, onClose }) => {
  if (!player) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        backdropFilter: "blur(12px)",
        background: "rgba(255,255,255,0.55)",
        zIndex: 9999,
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        paddingTop: "40px",
        overflowY: "auto"
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "90%",
          maxWidth: "480px",
          background: "rgba(255,255,255,0.85)",
          borderRadius: "16px",
          padding: "20px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)"
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <img
            src={player.photo || "/player_faces/placeholder.png"}
            alt={player.name}
            style={{
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              objectFit: "cover",
              marginBottom: "12px"
            }}
          />
          <h2 style={{ margin: 0 }}>{player.name}</h2>
          <div style={{ fontSize: "18px", opacity: 0.7 }}>
            {player.position} • OVR {player.overall}
          </div>
        </div>

        {/* Vitals */}
        <div style={{ marginBottom: "20px" }}>
          <h3>Vitals</h3>
          <div style={{ opacity: 0.7 }}>Age: {player.age || "—"}</div>
          <div style={{ opacity: 0.7 }}>Experience: {player.exp || "—"}</div>
        </div>

        {/* Contract */}
        <div style={{ marginBottom: "20px" }}>
          <h3>Contract</h3>
          <div style={{ opacity: 0.7 }}>
            {player.contract || "No contract data"}
          </div>
        </div>

        {/* Ratings */}
        <div style={{ marginBottom: "20px" }}>
          <h3>Ratings</h3>
          <div style={{ opacity: 0.7 }}>Ratings coming soon</div>
        </div>

        {/* Stats */}
        <div style={{ marginBottom: "20px" }}>
          <h3>Stats</h3>
          <div style={{ opacity: 0.7 }}>Stats coming soon</div>
        </div>

        <button
          onClick={onClose}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "8px",
            border: "none",
            background: "var(--color-accent)",
            color: "#fff",
            fontSize: "16px",
            marginTop: "10px",
            cursor: "pointer"
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default PlayerModal;
