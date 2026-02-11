// src/utils/playoffEngine.js
import { teams } from "../data/teams";

// Helper: sort by wins, then point differential
function sortStandings(a, b) {
  if (b.wins !== a.wins) return b.wins - a.wins;
  const diffA = a.pointsFor - a.pointsAgainst;
  const diffB = b.pointsFor - b.pointsAgainst;
  return diffB - diffA;
}

export function initializePlayoffs(season) {
  const standings = Object.entries(season.teams).map(([id, rec]) => ({
    id,
    ...rec
  }));

  const byConf = { AFC: [], NFC: [] };
  standings.forEach((t) => {
    const meta = teams.find((x) => x.id === t.id);
    if (meta) byConf[meta.conference].push(t);
  });

  byConf.AFC.sort(sortStandings);
  byConf.NFC.sort(sortStandings);

  const seedsAFC = byConf.AFC.slice(0, 7).map((t, i) => ({
    id: t.id,
    seed: i + 1
  }));
  const seedsNFC = byConf.NFC.slice(0, 7).map((t, i) => ({
    id: t.id,
    seed: i + 1
  }));

  season.playoffs = {
    initialized: true,
    seedsByConference: {
      AFC: seedsAFC,
      NFC: seedsNFC
    },
    bracket: {
      WILDCARD: buildWildcard(seedsAFC, seedsNFC),
      DIVISIONAL: [],
      CONFERENCE: [],
      SUPER_BOWL: []
    }
  };
}

function buildWildcard(afc, nfc) {
  const make = (conf, high, low) => ({
    id: `${conf}-WC-${high.seed}-${low.seed}`,
    round: "WILDCARD",
    conference: conf,
    home: high.id,
    away: low.id,
    homeSeed: high.seed,
    awaySeed: low.seed,
    played: false,
    homeScore: null,
    awayScore: null,
    winner: null,
    nextGameId: `${conf}-DIV-${high.seed}`,
    nextSlot: "home"
  });

  return [
    make("AFC", afc[1], afc[6]),
    make("AFC", afc[2], afc[5]),
    make("AFC", afc[3], afc[4]),
    make("NFC", nfc[1], nfc[6]),
    make("NFC", nfc[2], nfc[5]),
    make("NFC", nfc[3], nfc[4])
  ];
}

export function simulatePlayoffRound(season) {
  const round = season.playoffRound;
  const games = season.playoffs.bracket[round];

  games.forEach((g) => {
    if (g.played) return;

    const homeScore = rand(17, 38);
    const awayScore = rand(14, 34);

    g.played = true;
    g.homeScore = homeScore;
    g.awayScore = awayScore;
    g.winner = homeScore > awayScore ? g.home : g.away;
  });

  return true;
}

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
