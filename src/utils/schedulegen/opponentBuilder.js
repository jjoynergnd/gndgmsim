// src/utils/schedulegen/opponentBuilder.js
import { teams } from "../../data/teams";

// Categories: "DIV", "INTRA", "INTER", "SOS", "EXTRA"

function buildDivisionStructure() {
  const divisions = {
    AFC: { North: [], East: [], South: [], West: [] },
    NFC: { North: [], East: [], South: [], West: [] }
  };

  teams.forEach((t) => {
    divisions[t.conference][t.division].push(t.id);
  });

  for (const conf of ["AFC", "NFC"]) {
    for (const div of ["North", "East", "South", "West"]) {
      divisions[conf][div].sort();
    }
  }

  return divisions;
}

function buildDivisionRanks(divisions) {
  const ranks = {};
  for (const conf of ["AFC", "NFC"]) {
    ranks[conf] = {};
    for (const div of ["North", "East", "South", "West"]) {
      const list = divisions[conf][div];
      ranks[conf][div] = {};
      list.forEach((teamId, idx) => {
        ranks[conf][div][teamId] = idx; // 0–3
      });
    }
  }
  return ranks;
}

// Intra-conference rotation (3-year cycle)
const INTRA_ROTATION = {
  AFC: [
    { North: "East", East: "North", South: "West", West: "South" },
    { North: "South", South: "North", East: "West", West: "East" },
    { North: "West", West: "North", East: "South", South: "East" }
  ],
  NFC: [
    { North: "East", East: "North", South: "West", West: "South" },
    { North: "South", South: "North", East: "West", West: "East" },
    { North: "West", West: "North", East: "South", South: "East" }
  ]
};

// Inter-conference rotation (4-year cycle)
const INTER_ROTATION = [
  {
    AFC: { North: "North", East: "East", South: "South", West: "West" },
    NFC: { North: "North", East: "East", South: "South", West: "West" }
  },
  {
    AFC: { North: "East", East: "South", South: "West", West: "North" },
    NFC: { North: "West", East: "North", South: "East", West: "South" }
  },
  {
    AFC: { North: "South", East: "West", South: "North", West: "East" },
    NFC: { North: "South", East: "North", South: "West", West: "East" }
  },
  {
    AFC: { North: "West", East: "North", South: "East", West: "South" },
    NFC: { North: "East", East: "South", South: "North", West: "West" }
  }
];

// 17th game cross-conference division mapping (4-year cycle)
const EXTRA17_ROTATION = [
  {
    AFC: { North: "South", East: "West", South: "North", West: "East" },
    NFC: { North: "South", East: "West", South: "North", West: "East" }
  },
  {
    AFC: { North: "West", East: "North", South: "East", West: "South" },
    NFC: { North: "East", East: "South", South: "North", West: "West" }
  },
  {
    AFC: { North: "East", East: "South", South: "West", West: "North" },
    NFC: { North: "West", East: "North", South: "East", West: "South" }
  },
  {
    AFC: { North: "North", East: "East", South: "South", West: "West" },
    NFC: { North: "North", East: "East", South: "South", West: "West" }
  }
];

function getIntraRotationYearIndex(year) {
  return (year - 2026) % 3;
}

function getInterRotationYearIndex(year) {
  return (year - 2026) % 4;
}

function addDivisionGames(opponentsByTeam, divisions) {
  for (const conf of ["AFC", "NFC"]) {
    for (const div of ["North", "East", "South", "West"]) {
      const list = divisions[conf][div]; // 4 teams

      for (let i = 0; i < list.length; i++) {
        for (let j = i + 1; j < list.length; j++) {
          const t1 = list[i];
          const t2 = list[j];

          // t1 home, t2 away
          opponentsByTeam[t1].push({
            opponent: t2,
            home: true,
            category: "DIV"
          });
          opponentsByTeam[t2].push({
            opponent: t1,
            home: false,
            category: "DIV"
          });

          // t2 home, t1 away
          opponentsByTeam[t2].push({
            opponent: t1,
            home: true,
            category: "DIV"
          });
          opponentsByTeam[t1].push({
            opponent: t2,
            home: false,
            category: "DIV"
          });
        }
      }
    }
  }
}

function addIntraConferenceRotationGames(opponentsByTeam, divisions, year) {
  const idx = getIntraRotationYearIndex(year);

  for (const conf of ["AFC", "NFC"]) {
    const mapping = INTRA_ROTATION[conf][idx];

    for (const div of ["North", "East", "South", "West"]) {
      const partnerDiv = mapping[div];
      if (!partnerDiv) continue;

      const order = ["North", "East", "South", "West"];
      const idxA = order.indexOf(div);
      const idxB = order.indexOf(partnerDiv);
      if (idxA >= idxB) continue; // process pair once

      const divTeams = divisions[conf][div];
      const partnerTeams = divisions[conf][partnerDiv];

      for (let i = 0; i < divTeams.length; i++) {
        for (let j = 0; j < partnerTeams.length; j++) {
          const t1 = divTeams[i];
          const t2 = partnerTeams[j];

          const homeFirst = (i + j + year) % 2 === 0 ? t1 : t2;
          const awayFirst = homeFirst === t1 ? t2 : t1;

          opponentsByTeam[homeFirst].push({
            opponent: awayFirst,
            home: true,
            category: "INTRA"
          });
          opponentsByTeam[awayFirst].push({
            opponent: homeFirst,
            home: false,
            category: "INTRA"
          });
        }
      }
    }
  }
}

function addInterConferenceRotationGames(opponentsByTeam, divisions, year) {
  const idx = getInterRotationYearIndex(year);
  const mapping = INTER_ROTATION[idx];

  for (const afcDiv of ["North", "East", "South", "West"]) {
    const nfcDiv = mapping.AFC[afcDiv];
    const afcTeams = divisions.AFC[afcDiv];
    const nfcTeams = divisions.NFC[nfcDiv];

    for (let i = 0; i < afcTeams.length; i++) {
      for (let j = 0; j < nfcTeams.length; j++) {
        const afcTeam = afcTeams[i];
        const nfcTeam = nfcTeams[j];

        const homeFirst = (i + j + year) % 2 === 0 ? afcTeam : nfcTeam;
        const awayFirst = homeFirst === afcTeam ? nfcTeam : afcTeam;

        opponentsByTeam[homeFirst].push({
          opponent: awayFirst,
          home: true,
          category: "INTER"
        });
        opponentsByTeam[awayFirst].push({
          opponent: homeFirst,
          home: false,
          category: "INTER"
        });
      }
    }
  }
}

function addStrengthOfScheduleGames(opponentsByTeam, divisions, ranks, year) {
  const intraIdx = getIntraRotationYearIndex(year);

  for (const conf of ["AFC", "NFC"]) {
    const intraMap = INTRA_ROTATION[conf][intraIdx];
    const allDivs = ["North", "East", "South", "West"];

    for (const div of allDivs) {
      const intraPartner = intraMap[div];
      const otherDivs = allDivs.filter((d) => d !== div && d !== intraPartner);

      const baseTeams = divisions[conf][div];

      baseTeams.forEach((teamId) => {
        const rank = ranks[conf][div][teamId];

        otherDivs.forEach((otherDiv, idx) => {
          const otherTeams = divisions[conf][otherDiv];
          const opponentId = otherTeams[rank];

          if (teamId < opponentId) {
            const homeFirst =
              (rank + idx + year) % 2 === 0 ? teamId : opponentId;
            const awayFirst =
              homeFirst === teamId ? opponentId : teamId;

            opponentsByTeam[homeFirst].push({
              opponent: awayFirst,
              home: true,
              category: "SOS"
            });
            opponentsByTeam[awayFirst].push({
              opponent: homeFirst,
              home: false,
              category: "SOS"
            });
          }
        });
      });
    }
  }
}

function addSeventeenthGame(opponentsByTeam, divisions, ranks, year) {
  const idx = getInterRotationYearIndex(year);
  const mapping = EXTRA17_ROTATION[idx];

  for (const afcDiv of ["North", "East", "South", "West"]) {
    const nfcDiv = mapping.AFC[afcDiv];
    const afcTeams = divisions.AFC[afcDiv];
    const nfcTeams = divisions.NFC[nfcDiv];

    afcTeams.forEach((afcTeamId) => {
      const rank = ranks.AFC[afcDiv][afcTeamId];
      const nfcTeamId = nfcTeams[rank];

      const afcHosts = year % 2 === 0;
      const homeFirst = afcHosts ? afcTeamId : nfcTeamId;
      const awayFirst = afcHosts ? nfcTeamId : afcTeamId;

      const keyA = `A-${afcTeamId}`;
      const keyB = `N-${nfcTeamId}`;
      if (keyA < keyB) {
        opponentsByTeam[homeFirst].push({
          opponent: awayFirst,
          home: true,
          category: "EXTRA"
        });
        opponentsByTeam[awayFirst].push({
          opponent: homeFirst,
          home: false,
          category: "EXTRA"
        });
      }
    });
  }
}

export function buildOpponents(year) {
  const divisions = buildDivisionStructure();
  const ranks = buildDivisionRanks(divisions);

  const opponentsByTeam = {};
  teams.forEach((t) => {
    opponentsByTeam[t.id] = [];
  });

  addDivisionGames(opponentsByTeam, divisions);
  addIntraConferenceRotationGames(opponentsByTeam, divisions, year);
  addInterConferenceRotationGames(opponentsByTeam, divisions, year);
  addStrengthOfScheduleGames(opponentsByTeam, divisions, ranks, year);
  addSeventeenthGame(opponentsByTeam, divisions, ranks, year);

  return { opponentsByTeam, divisions };
}
