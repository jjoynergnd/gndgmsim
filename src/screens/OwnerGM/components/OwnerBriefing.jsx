import React from "react";
import styles from "./OwnerBriefing.module.css";

function generateOwnerMessage(owner, team) {
  const parts = [];

  // Record
  if (team.lastSeasonRecord) {
    parts.push(`Last season we finished ${team.lastSeasonRecord}.`);
  }

  // Cap
  if (team.capSpace < 0) {
    parts.push(`Our cap situation is tight, so we expect discipline.`);
  } else if (team.capSpace > 20000000) {
    parts.push(`We have financial flexibility to improve the roster.`);
  }

  // Owner personality
  if (owner.type === "impatient") {
    parts.push(`I expect results quickly.`);
  } else if (owner.type === "patient") {
    parts.push(`I believe in long-term team building.`);
  }

  // Expectations
  if (owner.priorities.wins > 7) {
    parts.push(`Winning is our top priority.`);
  } else if (owner.priorities.playerDevelopment > 7) {
    parts.push(`Developing young talent is essential.`);
  }

  return parts.join(" ");
}

export default function OwnerBriefing({ owner, team }) {
  const message = generateOwnerMessage(owner, team);

  return (
    <div className={styles.card}>
      <h2 className={styles.header}>Owner Briefing</h2>
      <p className={styles.text}>{message}</p>
    </div>
  );
}