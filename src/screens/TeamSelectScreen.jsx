import React from "react";
import { teams } from "../data/teams";
import { useDispatch, useSelector } from "react-redux";
import { setPendingTeam, confirmTeam, clearPendingTeam } from "../state/teamSlice";

const TeamSelectScreen = () => {
  const dispatch = useDispatch();
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
          padding: "6px",
          textAlign: "center",
          borderRadius: "8px",
          transition: "0.2s",
          border: isSelected ? "2px solid var(--color-accent)" : "2px solid transparent",
          background: isSelected ? "rgba(0,200,255,0.08)" : "transparent",
        }}
      >
        {/* LOGO OR INITIALS */}
        <img
          src={`/logos/${team.id}.png`}
          alt={team.id}
          onError={(e) => {
            e.target.style.display = "none";
            const fallback = document.createElement("div");
            fallback.style.width = "50px";
            fallback.style.height = "50px";
            fallback.style.borderRadius = "50%";
            fallback.style.background = "#ddd";
            fallback.style.display = "flex";
            fallback.style.alignItems = "center";
            fallback.style.justifyContent = "center";
            fallback.style.margin = "0 auto 6px auto";
            fallback.style.fontWeight = "700";
            fallback.style.fontSize = "18px";
            fallback.innerText = team.id;
            e.target.parentNode.insertBefore(fallback, e.target);
          }}
          style={{
            width: "50px",
            height: "50px",
            borderRadius: "50%",
            objectFit: "cover",
            margin: "0 auto 6px auto",
          }}
        />

        <div style={{ fontWeight: 600, fontSize: "13px" }}>{team.city}</div>
        <div style={{ fontSize: "11px", opacity: 0.8 }}>{team.mascot}</div>
      </div>
    );
  };

  const afcTeams = teams.filter((t) => t.conference === "AFC");
  const nfcTeams = teams.filter((t) => t.conference === "NFC");

  return (
    <div style={{ paddingBottom: pendingTeam ? "80px" : "0" }}>
      <h2 style={{ color: "#C94A4A", fontWeight: 700 }}>AFC</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: "10px",
          marginBottom: "20px",
        }}
      >
        {afcTeams.map(renderTeamCard)}
      </div>

      <h2 style={{ color: "#3A6FF7", fontWeight: 700 }}>NFC</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: "10px",
        }}
      >
        {nfcTeams.map(renderTeamCard)}
      </div>

      {pendingTeam && (
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
            You selected the{" "}
            {teams.find((t) => t.id === pendingTeam).city}{" "}
            {teams.find((t) => t.id === pendingTeam).mascot}
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

            <button
              onClick={() => dispatch(confirmTeam())}
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
