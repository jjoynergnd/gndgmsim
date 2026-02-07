import React, { useState } from "react";

const overlayStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.55)",
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 100,
};

const modalStyle = {
  width: "100%",
  maxWidth: "420px",
  maxHeight: "90vh",
  background: "rgba(15,18,28,0.96)",
  borderRadius: "16px",
  boxShadow: "0 18px 40px rgba(0,0,0,0.6)",
  border: "1px solid rgba(255,255,255,0.08)",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
};

const headerStyle = {
  padding: "14px 16px 10px 16px",
  borderBottom: "1px solid rgba(255,255,255,0.08)",
  display: "flex",
  alignItems: "center",
  gap: "12px",
};

const avatarStyle = {
  width: "56px",
  height: "56px",
  borderRadius: "12px",
  background: "linear-gradient(135deg, #2b3a5f, #151a26)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#fff",
  fontWeight: 700,
  fontSize: "20px",
  flexShrink: 0,
};

const nameBlockStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "2px",
  minWidth: 0,
};

const nameStyle = {
  fontSize: "18px",
  fontWeight: 700,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  color: "#fff"
};

const sublineStyle = {
  fontSize: "12px",
  opacity: 0.8,
  color: "#fff"
};

const ovrPillStyle = {
  marginLeft: "auto",
  padding: "6px 10px",
  borderRadius: "999px",
  background: "rgba(0,200,255,0.12)",
  border: "1px solid rgba(0,200,255,0.6)",
  fontSize: "12px",
  fontWeight: 700,
  color: "#fff"
};

const tabsRowStyle = {
  display: "flex",
  borderBottom: "1px solid rgba(255,255,255,0.08)",
  overflowX: "auto",
};

const tabStyleBase = {
  flex: 1,
  padding: "8px 10px",
  fontSize: "12px",
  textAlign: "center",
  cursor: "pointer",
  whiteSpace: "nowrap",
  borderBottom: "2px solid transparent",
};

const contentWrapperStyle = {
  padding: "10px 14px 14px 14px",
  overflowY: "auto",
  flex: 1,
};

const sectionStyle = {
  marginBottom: "10px",
  padding: "8px 10px",
  borderRadius: "10px",
  background: "rgba(255,255,255,0.02)",
  border: "1px solid rgba(255,255,255,0.06)",
};

const sectionTitleStyle = {
  fontSize: "12px",
  fontWeight: 700,
  marginBottom: "6px",
  display: "flex",
  alignItems: "center",
  gap: "6px",
  color: "#fff"
};

const sectionAccentStyle = (color) => ({
  width: "3px",
  height: "14px",
  borderRadius: "999px",
  background: color,
});

const gridTwoStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: "6px 10px",
};

const labelStyle = {
  fontSize: "11px",
  opacity: 0.7,
  color: "#fff"
};

const valueStyle = {
  fontSize: "12px",
  fontWeight: 600,
  color: "#fff"
};

const footerStyle = {
  padding: "10px 14px 12px 14px",
  borderTop: "1px solid rgba(255,255,255,0.08)",
  display: "flex",
  justifyContent: "flex-end",
};

const closeButtonStyle = {
  padding: "8px 14px",
  borderRadius: "999px",
  border: "none",
  background: "rgba(0,200,255,0.9)",
  color: "#fff",
  fontWeight: 600,
  fontSize: "13px",
  cursor: "pointer",
};

const getInitials = (name) => {
  if (!name) return "?";
  const parts = name.split(" ");
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
};

const safe = (value, fallback = "—") =>
  value === undefined || value === null || value === "" ? fallback : value;

const PlayerModal = ({ player, onClose }) => {
  const [activeTab, setActiveTab] = useState("Overview");

  if (!player) return null;

  const {
    name,
    position,
    teamName,
    jerseyNumber,
    vitals = {},
    contract = {},
    ratings = {},
    stats = {},
    traits = {},
  } = player;

  // Pull overall from ratings
  const overall = ratings?.overall;

  // Compute display value
  const displayOvr = typeof overall === "number" ? overall : "—";


  const hasRatings = Object.keys(ratings).length > 0;
  const hasStats =
    stats && (stats.season || stats.career || Object.keys(stats).length > 0);
  const hasContract = Object.keys(contract).length > 0;
  const hasTraits = Object.keys(traits).length > 0;

  const tabs = ["Overview", "Ratings", "Stats", "Contract", "Traits"];

  const renderOverview = () => (
    <>
      <div style={sectionStyle}>
        <div style={sectionTitleStyle}>
          <div style={sectionAccentStyle("rgba(0,200,255,0.9)")} />
          <span>Vitals</span>
        </div>
        <div style={gridTwoStyle}>
          <div>
            <div style={labelStyle}>Age</div>
            <div style={valueStyle}>{safe(vitals.age)}</div>
          </div>
          <div>
            <div style={labelStyle}>Experience</div>
            <div style={valueStyle}>{safe(vitals.experience)}</div>
          </div>
          <div>
            <div style={labelStyle}>Height</div>
            <div style={valueStyle}>{safe(vitals.height)}</div>
          </div>
          <div>
            <div style={labelStyle}>Weight</div>
            <div style={valueStyle}>{safe(vitals.weight)}</div>
          </div>
          <div>
            <div style={labelStyle}>College</div>
            <div style={valueStyle}>{safe(vitals.college)}</div>
          </div>
        </div>
      </div>

      <div style={sectionStyle}>
        <div style={sectionTitleStyle}>
          <div style={sectionAccentStyle("rgba(120,255,160,0.9)")} />
          <span>Snapshot</span>
        </div>
        <div style={gridTwoStyle}>
          <div>
            <div style={labelStyle}>Position</div>
            <div style={valueStyle}>{safe(position)}</div>
          </div>
          <div>
            <div style={labelStyle}>Overall</div>
            <div style={valueStyle}>{displayOvr}</div>
          </div>
          <div>
            <div style={labelStyle}>Team</div>
            <div style={valueStyle}>{safe(teamName, "—")}</div>
          </div>
          <div>
            <div style={labelStyle}>Jersey</div>
            <div style={valueStyle}>
              {jerseyNumber ? `#${jerseyNumber}` : "—"}
            </div>
          </div>
        </div>
      </div>
    </>
  );

  const renderRatings = () => {
    if (!hasRatings) {
      return (
        <div style={sectionStyle}>
          <div style={sectionTitleStyle}>
            <div style={sectionAccentStyle("rgba(255,210,120,0.9)")} />
            <span>Ratings</span>
          </div>
          <div style={{ fontSize: "12px", opacity: 0.8 }}>
            Ratings data not available yet.
          </div>
        </div>
      );
    }

    const {
      speed,
      acceleration,
      agility,
      strength,
      throwPower,
      shortAccuracy,
      mediumAccuracy,
      deepAccuracy,
      catching,
      routeRunning,
      release,
      tackle,
      pursuit,
      manCoverage,
      zoneCoverage,
      kickPower,
      kickAccuracy,
    } = ratings;

    const ratingRow = (label, value) => (
      <div
        key={label}
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: "12px",
        }}
      >
        <span style={{ opacity: 0.8, color: "#fff" }}>{label}</span>
        <span style={{ fontWeight: 600, color: "#fff" }}>{safe(value)}</span>
      </div>
    );

    return (
      <>
        <div style={sectionStyle}>
          <div style={sectionTitleStyle}>
            <div style={sectionAccentStyle("rgba(0,200,255,0.9)")} />
            <span>Physical</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {ratingRow("Speed", speed)}
            {ratingRow("Acceleration", acceleration)}
            {ratingRow("Agility", agility)}
            {ratingRow("Strength", strength)}
          </div>
        </div>

        <div style={sectionStyle}>
          <div style={sectionTitleStyle}>
            <div style={sectionAccentStyle("rgba(255,160,120,0.9)")} />
            <span>Offense</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {ratingRow("Throw Power", throwPower)}
            {ratingRow("Short Accuracy", shortAccuracy)}
            {ratingRow("Medium Accuracy", mediumAccuracy)}
            {ratingRow("Deep Accuracy", deepAccuracy)}
            {ratingRow("Catching", catching)}
            {ratingRow("Route Running", routeRunning)}
            {ratingRow("Release", release)}
          </div>
        </div>

        <div style={sectionStyle}>
          <div style={sectionTitleStyle}>
            <div style={sectionAccentStyle("rgba(120,170,255,0.9)")} />
            <span>Defense & Special Teams</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {ratingRow("Tackle", tackle)}
            {ratingRow("Pursuit", pursuit)}
            {ratingRow("Man Coverage", manCoverage)}
            {ratingRow("Zone Coverage", zoneCoverage)}
            {ratingRow("Kick Power", kickPower)}
            {ratingRow("Kick Accuracy", kickAccuracy)}
          </div>
        </div>
      </>
    );
  };

  const renderStats = () => {
    if (!hasStats) {
      return (
        <div style={sectionStyle}>
          <div style={sectionTitleStyle}>
            <div style={sectionAccentStyle("rgba(160,120,255,0.9)")} />
            <span>Stats</span>
          </div>
          <div style={{ fontSize: "12px", opacity: 0.8 }}>
            No stats available yet. Sim a season to generate stats.
          </div>
        </div>
      );
    }

    const { season = {}, career = {} } = stats;

    const statBlock = (title, data) => (
      <div key={title} style={sectionStyle}>
        <div style={sectionTitleStyle}>
          <div style={sectionAccentStyle("rgba(160,120,255,0.9)")} />
          <span>{title}</span>
        </div>
        {Object.keys(data).length === 0 ? (
          <div style={{ fontSize: "12px", opacity: 0.8 }}>No data.</div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "4px",
              fontSize: "12px",
            }}
          >
            {Object.entries(data).map(([key, value]) => (
              <div
                key={key}
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <span style={{ opacity: 0.8, color: "#fff" }}>{key}</span>
                <span style={{ fontWeight: 600, color: "#fff" }}>{value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );

    return (
      <>
        {statBlock("Season Stats", season)}
        {statBlock("Career Stats", career)}
      </>
    );
  };

  const renderContract = () => {
    if (!hasContract) {
      return (
        <div style={sectionStyle}>
          <div style={sectionTitleStyle}>
            <div style={sectionAccentStyle("rgba(120,255,160,0.9)")} />
            <span>Contract</span>
          </div>
          <div style={{ fontSize: "12px", opacity: 0.8 }}>
            No contract data.
          </div>
        </div>
      );
    }

    const {
      years,
      totalValue,
      capHit,
      deadCap,
      contractType,
      signingBonus,
      expiresYear,
    } = contract;

    return (
      <div style={sectionStyle}>
        <div style={sectionTitleStyle}>
          <div style={sectionAccentStyle("rgba(120,255,160,0.9)")} />
          <span>Contract</span>
        </div>
        <div style={gridTwoStyle}>
          <div>
            <div style={labelStyle}>Years</div>
            <div style={valueStyle}>{safe(years)}</div>
          </div>
          <div>
            <div style={labelStyle}>Total Value</div>
            <div style={valueStyle}>{safe(totalValue)}</div>
          </div>
          <div>
            <div style={labelStyle}>Cap Hit</div>
            <div style={valueStyle}>{safe(capHit)}</div>
          </div>
          <div>
            <div style={labelStyle}>Dead Cap</div>
            <div style={valueStyle}>{safe(deadCap)}</div>
          </div>
          <div>
            <div style={labelStyle}>Signing Bonus</div>
            <div style={valueStyle}>{safe(signingBonus)}</div>
          </div>
          <div>
            <div style={labelStyle}>Expires</div>
            <div style={valueStyle}>{safe(expiresYear)}</div>
          </div>
          <div>
            <div style={labelStyle}>Type</div>
            <div style={valueStyle}>{safe(contractType)}</div>
          </div>
        </div>
      </div>
    );
  };

  const renderTraits = () => {
    if (!hasTraits) {
      return (
        <div style={sectionStyle}>
          <div style={sectionTitleStyle}>
            <div style={sectionAccentStyle("rgba(255,210,160,0.9)")} />
            <span>Traits</span>
          </div>
          <div style={{ fontSize: "12px", opacity: 0.8, color: "#fff" }}>
            No traits data yet.
          </div>
        </div>
      );
    }

    const {
      personality,
      devTrait,
      clutch,
      injuryProne,
      workEthic,
      leadership,
      ...rest
    } = traits;

    const traitRow = (label, value) => (
      <div
        key={label}
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: "12px",
        }}
      >
        <span style={{ opacity: 0.8, color: "#fff" }}>{label}</span>
        <span style={{ fontWeight: 600, color: "#fff" }}>{safe(value)}</span>
      </div>
    );

    return (
      <div style={sectionStyle}>
        <div style={sectionTitleStyle}>
          <div style={sectionAccentStyle("rgba(255,210,160,0.9)")} />
          <span>Traits</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          {traitRow("Personality", personality)}
          {traitRow("Development", devTrait)}
          {traitRow("Clutch", clutch)}
          {traitRow("Injury", injuryProne)}
          {traitRow("Work Ethic", workEthic)}
          {traitRow("Leadership", leadership)}
          {Object.entries(rest).map(([key, value]) =>
            traitRow(key, value)
          )}
        </div>
      </div>
    );
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case "Overview":
        return renderOverview();
      case "Ratings":
        return renderRatings();
      case "Stats":
        return renderStats();
      case "Contract":
        return renderContract();
      case "Traits":
        return renderTraits();
      default:
        return renderOverview();
    }
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div
        style={modalStyle}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div style={headerStyle}>
          <div style={avatarStyle}>{getInitials(name)}</div>
          <div style={nameBlockStyle}>
            <div style={nameStyle}>{name}</div>
            <div style={sublineStyle}>
              {position || "—"} • OVR {displayOvr}
            </div>
          </div>
          <div style={ovrPillStyle}>OVR {displayOvr}</div>
        </div>

        <div style={tabsRowStyle}>
          {tabs.map((tab) => {
            const isActive = tab === activeTab;
            return (
              <div
                key={tab}
                style={{
                  ...tabStyleBase,
                  borderBottomColor: isActive
                    ? "rgba(0,200,255,0.9)"
                    : "transparent",
                  color: isActive ? "#fff" : "rgba(255,255,255,0.7)",
                  fontWeight: isActive ? 600 : 500,
                }}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </div>
            );
          })}
        </div>

        <div style={contentWrapperStyle}>{renderActiveTab()}</div>

        <div style={footerStyle}>
          <button style={closeButtonStyle} onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlayerModal;
