import React from "react";
import { teams } from "../data/teams";
import { useDispatch, useSelector } from "react-redux";
import { setPendingTeam, confirmTeam, clearPendingTeam } from "../state/teamSlice";

import { useNavigate } from "react-router-dom";

// NEW: orchestrator + mock league state
import { offseason } from "../engine/offseason/masterOrchestrator";
import { mockLeagueState } from "../mock/mockLeagueState";

const TeamSelectScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const pendingTeam = useSelector((state) => state.team.pendingTeam);

  const handleSelect = (teamId) => {
    dispatch(setPendingTeam(teamId));
  };

  const renderTeamCard = (team) => {
    const isSelected = pendingTeam === team.id;

    return (
      <div
        key={team.id}
        onClick={() => handleSelect(team.id)}
        style={{
          cursor: "pointer",
          padding: "4px",
          textAlign: "center",
          borderRadius: "6px",
          transition: "0.2s",
          border: isSelected ? "2px solid var(--color-accent)" : "2px solid transparent",
          background: isSelected ? "rgba(0,200,255,0.08)" : "transparent",
        }}
      >
        <img
          src={`/logos/${team.id}.png`}
          alt={team.id}
          onError={(e) => {
            e.target.style.display = "none";
            const fallback = document.createElement("div");
            fallback.style.width = "42px";
            fallback.style.height = "42px";
            fallback.style.borderRadius = "50%";
            fallback.style.background = "#ddd";
            fallback.style.display = "flex";
            fallback.style.alignItems = "center";
            fallback.style.justifyContent = "center";
            fallback.style.margin = "0 auto 4px auto";
            fallback.style.fontWeight = "700";
            fallback.style.fontSize = "14px";
            fallback.innerText = team.id;
            e.target.parentNode.insertBefore(fallback, e.target);
          }}
          style={{
            width: "42px",
            height: "42px",
            borderRadius: "50%",
            objectFit: "cover",
            margin: "0 auto 4px auto",
          }}
        />

        <div style={{ fontWeight: 600, fontSize: "12px", lineHeight: "14px" }}>
          {team.city}
        </div>
        <div style={{ fontSize: "10px", opacity: 0.75, lineHeight: "12px" }}>
          {team.mascot}
        </div>
      </div>
    );
  };

  const afcTeams = teams.filter((t) => t.conference === "AFC");
  const nfcTeams = teams.filter((t) => t.conference === "NFC");

  // SAFELY RESOLVE SELECTED TEAM
  const selectedTeam = pendingTeam
    ? teams.find((t) => t.id === pendingTeam)
    : null;

  return (
    <div style={{ paddingBottom: pendingTeam ? "80px" : "0" }}>
      <h2
        style={{
          color: "#C94A4A",
          fontWeight: 700,
          marginBottom: "8px",
          marginTop: "4px",
        }}
      >
        AFC
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(6, 1fr)",
          gap: "6px",
          marginBottom: "16px",
        }}
      >
        {afcTeams.map(renderTeamCard)}
      </div>

      <h2
        style={{
          color: "#3A6FF7",
          fontWeight: 700,
          marginBottom: "8px",
          marginTop: "4px",
        }}
      >
        NFC
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(6, 1fr)",
          gap: "6px",
        }}
      >
        {nfcTeams.map(renderTeamCard)}
      </div>

      {/* SAFE BOTTOM BAR */}
      {selectedTeam && (
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: "240px",
            right: 0,
            background: "white",
            boxShadow: "0 -2px 6px rgba(0,0,0,0.15)",
            padding: "16px 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            zIndex: 20,
          }}
        >
          <div style={{ fontSize: "16px", fontWeight: 600 }}>
            You selected the {selectedTeam.city} {selectedTeam.mascot}
          </div>

          <div style={{ display: "flex", gap: "12px" }}>
            <button
              onClick={() => dispatch(clearPendingTeam())}
              style={{
                padding: "10px 16px",
                borderRadius: "6px",
                border: "1px solid #ccc",
                background: "#f5f5f5",
                cursor: "pointer",
              }}
            >
              Change Team
            </button>

            {/* UPDATED CONTINUE BUTTON */}
            <button
              onClick={() => {
                console.log("CONTINUE CLICKED", selectedTeam);
                dispatch(confirmTeam());
                offseason.start(selectedTeam.id, mockLeagueState);
                console.log("OFFSEASON STARTED");
                navigate("/offseason");
              }}


              style={{
                padding: "10px 16px",
                borderRadius: "6px",
                background: "var(--color-accent)",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamSelectScreen;
