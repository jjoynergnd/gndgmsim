import React, { useMemo } from "react";
import styles from "./DivisionStandings.module.css";

const deriveRecord = (schedule = []) => {
  let wins = 0;
  let losses = 0;

  schedule.forEach((game) => {
    if (!game.played) return;
    if (game.result === "W") wins++;
    if (game.result === "L") losses++;
  });

  return `${wins}-${losses}`;
};

const DivisionStandings = ({
  teams = [],
  userTeam,
  season
}) => {
  // 🔍 DEBUG: confirm what data is actually arriving
  console.log("STANDINGS teams prop:", teams);

  const userRecord = useMemo(() => {
    return deriveRecord(season?.schedule);
  }, [season]);

  const divisions = useMemo(() => {
    const map = {};

    teams.forEach((team) => {
      if (!team.conference || !team.division) {
        console.warn("Team missing conference/division:", team);
        return;
      }

      const key = `${team.conference} ${team.division}`;
      if (!map[key]) map[key] = [];
      map[key].push(team);
    });

    console.log("STANDINGS divisions map:", map);

    return map;
  }, [teams]);

  return (
    <div className={styles.container}>
      {Object.keys(divisions).length === 0 && (
        <div style={{ opacity: 0.6, padding: "20px" }}>
          No standings data available.
        </div>
      )}

      {Object.entries(divisions).map(([divisionName, divisionTeams]) => (
        <div key={divisionName} className={styles.card}>
          <div className={styles.header}>{divisionName}</div>

          <div className={styles.table}>
            {divisionTeams.map((team) => {
              const isUser = team.id === userTeam?.id;

              return (
                <div
                  key={team.id}
                  className={`${styles.row} ${
                    isUser ? styles.userRow : styles.cpuRow
                  }`}
                >
                  <div className={styles.team}>
                    <span className={styles.abbr}>{team.id}</span>
                    <span className={styles.name}>
                      {team.city} {team.mascot}
                    </span>
                  </div>

                  <div className={styles.record}>
                    {isUser ? userRecord : "—"}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DivisionStandings;
