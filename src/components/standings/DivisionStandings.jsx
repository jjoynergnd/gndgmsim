import React from "react";
import styles from "./DivisionStandings.module.css";

function getRecord(season, teamId) {
  return season.teams?.[teamId] || {
    wins: 0,
    losses: 0,
    ties: 0,
    pointsFor: 0,
    pointsAgainst: 0
  };
}

function sortDivisionTeams(season, teamsInDivision) {
  return [...teamsInDivision].sort((a, b) => {
    const ra = getRecord(season, a.id);
    const rb = getRecord(season, b.id);

    if (rb.wins !== ra.wins) return rb.wins - ra.wins;
    if (rb.ties !== ra.ties) return rb.ties - ra.ties;

    const diffA = ra.pointsFor - ra.pointsAgainst;
    const diffB = rb.pointsFor - rb.pointsAgainst;

    return diffB - diffA;
  });
}

function renderConferenceColumn(conferenceName, teams, season, userTeam) {
  const divisions = ["North", "East", "South", "West"];

  return (
    <div className={styles.conferenceColumn}>
      <div className={styles.conferenceTitle}>{conferenceName}</div>

      {divisions.map((division) => {
        const divisionTeams = teams.filter(
          (t) => t.conference === conferenceName && t.division === division
        );

        if (divisionTeams.length === 0) return null;

        const sorted = sortDivisionTeams(season, divisionTeams);

        return (
          <div key={division} className={styles.divisionBlock}>
            <div className={styles.divisionTitle}>{division}</div>

            <div className={styles.headerRow}>
              <div>Team</div>
              <div className={styles.center}>W</div>
              <div className={styles.center}>L</div>
              <div className={styles.center}>T</div>
            </div>

            {sorted.map((team) => {
              const rec = getRecord(season, team.id);
              const highlight = userTeam && userTeam.id === team.id;

              return (
                <div
                  key={team.id}
                  className={`${styles.row} ${
                    highlight ? styles.rowHighlight : ""
                  }`}
                >
                  <div>{team.city} {team.mascot}</div>
                  <div className={styles.center}>{rec.wins}</div>
                  <div className={styles.center}>{rec.losses}</div>
                  <div className={styles.center}>{rec.ties}</div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

export default function DivisionStandings({ teams, userTeam, season }) {
  if (!season || !season.teams) {
    return <div>Standings unavailable.</div>;
  }

  return (
    <div className={styles.container}>
      {renderConferenceColumn("AFC", teams, season, userTeam)}
      {renderConferenceColumn("NFC", teams, season, userTeam)}
    </div>
  );
}
