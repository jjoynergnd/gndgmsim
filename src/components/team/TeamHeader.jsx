import React from "react";
import styles from "./TeamHeader.module.css";

const TeamHeader = ({ team, season, meta }) => {
  if (!team || !season) return null;

  const record = season.teams?.[team.id] || {
    wins: 0,
    losses: 0,
    ties: 0
  };

  const year = season.year ?? 2026;

  console.log("[TeamHeader] meta for team:", team.id, meta);

  const logoSrc = meta?.logo || meta?.logoUrl || null;
  const capSpace = meta?.capSpace ?? meta?.capRoom ?? null;

  return (
    <div className={styles.container}>
      {/* LEFT: LOGO + NAME */}
      <div className={styles.left}>
        <div className={styles.logoWrapper}>
          {logoSrc ? (
            <img
              src={logoSrc}
              alt={`${team.city} ${team.mascot}`}
              className={styles.logo}
            />
          ) : (
            <div
              className={styles.logoFallback}
              style={{ backgroundColor: team.color }}
            >
              {team.id}
            </div>
          )}
        </div>
        <div className={styles.teamInfo}>
          <div className={styles.teamName}>
            {team.city} {team.mascot}
          </div>
          <div className={styles.subline}>
            {team.conference} • {team.division}
          </div>
        </div>
      </div>

      {/* MIDDLE: RECORD + YEAR */}
      <div className={styles.middle}>
        <div className={styles.record}>
          {record.wins}-{record.losses}
          {record.ties ? `-${record.ties}` : ""}
        </div>
        <div className={styles.year}>Year {year}</div>
      </div>

      {/* RIGHT: CAP INFO */}
      <div className={styles.right}>
        {capSpace !== null && (
          <div className={styles.capBlock}>
            <div className={styles.capLabel}>Cap Space</div>
            <div className={styles.capValue}>
              ${Number(capSpace).toLocaleString()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamHeader;
