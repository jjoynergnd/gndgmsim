// src/utils/playoffEngine.js
import { teams } from "../data/teams";

// ---------- helpers ----------

function sortStandings(a, b) {
  if (b.wins !== a.wins) return b.wins - a.wins;
  const diffA = a.pointsFor - a.pointsAgainst;
  const diffB = b.pointsFor - b.pointsAgainst;
  return diffB - diffA;
}

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function simulateGame(home, away) {
  const homeScore = rand(17, 38);
  const awayScore = rand(14, 34);
  return { home, away, homeScore, awayScore };
}

function getConference(teamId) {
  const t = teams.find((x) => x.id === teamId);
  return t?.conference || null;
}

// ---------- initialization ----------

export function initializePlayoffs(season) {
  const standings = Object.entries(season.teams).map(([id, rec]) => ({
    id,
    ...rec
  }));

  const byConf = { AFC: [], NFC: [] };
  standings.forEach((t) => {
    const meta = teams.find((x) => x.id === t.id);
    if (!meta) return;
    byConf[meta.conference].push(t);
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
      WILDCARD: {
        AFC: buildWildcardRound(seedsAFC, "AFC"),
        NFC: buildWildcardRound(seedsNFC, "NFC")
      },
      DIVISIONAL: {
        AFC: [],
        NFC: []
      },
      CONFERENCE: {
        AFC: [],
        NFC: []
      },
      SUPER_BOWL: {
        GAME: null
      }
    }
  };
}

function buildWildcardRound(seeds, conf) {
  // seeds[0] is #1 (bye)
  const s2 = seeds[1];
  const s3 = seeds[2];
  const s4 = seeds[3];
  const s5 = seeds[4];
  const s6 = seeds[5];
  const s7 = seeds[6];

  const makeGame = (high, low, idx) => ({
    id: `${conf}-WC-${idx}`,
    round: "WILDCARD",
    conference: conf,
    home: high.id,
    away: low.id,
    homeSeed: high.seed,
    awaySeed: low.seed,
    played: false,
    homeScore: null,
    awayScore: null,
    winner: null
  });

  return [
    makeGame(s2, s7, 1),
    makeGame(s3, s6, 2),
    makeGame(s4, s5, 3)
  ];
}

// ---------- round simulation ----------

export function simulatePlayoffRound(season) {
  const round = season.playoffRound;
  const { bracket, seedsByConference } = season.playoffs;

  if (round === "WILDCARD") {
    const results = [];

    ["AFC", "NFC"].forEach((conf) => {
      const games = bracket.WILDCARD[conf];
      games.forEach((g) => {
        if (g.played) return;
        const res = simulateGame(g.home, g.away);
        g.played = true;
        g.homeScore = res.homeScore;
        g.awayScore = res.awayScore;
        g.winner = res.homeScore > res.awayScore ? g.home : g.away;
        results.push(formatResultLine(g));
      });

      // build divisional for this conference
      const seed1 = seedsByConference[conf].find((s) => s.seed === 1);
      const winners = games.map((g) => {
        const seed = seedsByConference[conf].find((s) => s.id === g.winner);
        return seed;
      });

      const divisionalGames = buildDivisionalRound(seed1, winners, conf);
      bracket.DIVISIONAL[conf] = divisionalGames;
    });

    return results.join("  ");
  }

  if (round === "DIVISIONAL") {
    const results = [];

    ["AFC", "NFC"].forEach((conf) => {
      const games = bracket.DIVISIONAL[conf];
      const winners = [];

      games.forEach((g) => {
        if (g.played) return;
        const res = simulateGame(g.home, g.away);
        g.played = true;
        g.homeScore = res.homeScore;
        g.awayScore = res.awayScore;
        g.winner = res.homeScore > res.awayScore ? g.home : g.away;
        winners.push(g.winner);
        results.push(formatResultLine(g));
      });

      // build conference championship for this conference
      if (winners.length === 2) {
        const [t1, t2] = winners;
        const s1 = season.playoffs.seedsByConference[conf].find(
          (s) => s.id === t1
        );
        const s2 = season.playoffs.seedsByConference[conf].find(
          (s) => s.id === t2
        );

        bracket.CONFERENCE[conf] = [
          {
            id: `${conf}-CONF-1`,
            round: "CONFERENCE",
            conference: conf,
            home: s1.seed < s2.seed ? t1 : t2,
            away: s1.seed < s2.seed ? t2 : t1,
            homeSeed: s1.seed < s2.seed ? s1.seed : s2.seed,
            awaySeed: s1.seed < s2.seed ? s2.seed : s1.seed,
            played: false,
            homeScore: null,
            awayScore: null,
            winner: null
          }
        ];
      }
    });

    return results.join("  ");
  }

  if (round === "CONFERENCE") {
    const results = [];
    const confWinners = {};

    ["AFC", "NFC"].forEach((conf) => {
      const games = bracket.CONFERENCE[conf];
      games.forEach((g) => {
        if (g.played) return;
        const res = simulateGame(g.home, g.away);
        g.played = true;
        g.homeScore = res.homeScore;
        g.awayScore = res.awayScore;
        g.winner = res.homeScore > res.awayScore ? g.home : g.away;
        confWinners[conf] = g.winner;
        results.push(formatResultLine(g));
      });
    });

    // build Super Bowl
    if (confWinners.AFC && confWinners.NFC) {
      const afcSeed = season.playoffs.seedsByConference.AFC.find(
        (s) => s.id === confWinners.AFC
      );
      const nfcSeed = season.playoffs.seedsByConference.NFC.find(
        (s) => s.id === confWinners.NFC
      );

      season.playoffs.bracket.SUPER_BOWL.GAME = {
        id: "SB-1",
        round: "SUPER_BOWL",
        conference: "CROSS",
        home: afcSeed.seed <= nfcSeed.seed ? confWinners.AFC : confWinners.NFC,
        away: afcSeed.seed <= nfcSeed.seed ? confWinners.NFC : confWinners.AFC,
        homeSeed: afcSeed.seed <= nfcSeed.seed ? afcSeed.seed : nfcSeed.seed,
        awaySeed: afcSeed.seed <= nfcSeed.seed ? nfcSeed.seed : afcSeed.seed,
        played: false,
        homeScore: null,
        awayScore: null,
        winner: null
      };
    }

    return results.join("  ");
  }

  if (round === "SUPER_BOWL") {
    const g = season.playoffs.bracket.SUPER_BOWL.GAME;
    if (!g || g.played) return "";

    const res = simulateGame(g.home, g.away);
    g.played = true;
    g.homeScore = res.homeScore;
    g.awayScore = res.awayScore;
    g.winner = res.homeScore > res.awayScore ? g.home : g.away;

    season.playoffs.champion = g.winner;

    return formatResultLine(g);
  }

  return "";
}

function buildDivisionalRound(seed1, wildcardWinners, conf) {
  // wildcardWinners: array of { id, seed }
  const seeds = wildcardWinners.map((s) => s.seed).sort((a, b) => a - b);
  // lowest remaining seed plays #1
  const lowestSeed = seeds[0];
  const otherSeeds = seeds.slice(1);

  const lowestTeam = wildcardWinners.find((s) => s.seed === lowestSeed);
  const [sA, sB] = otherSeeds;
  const teamA = wildcardWinners.find((s) => s.seed === sA);
  const teamB = wildcardWinners.find((s) => s.seed === sB);

  const games = [];

  // Game 1: #1 vs lowest remaining
  games.push({
    id: `${conf}-DIV-1`,
    round: "DIVISIONAL",
    conference: conf,
    home: seed1.id,
    away: lowestTeam.id,
    homeSeed: seed1.seed,
    awaySeed: lowestTeam.seed,
    played: false,
    homeScore: null,
    awayScore: null,
    winner: null
  });

  // Game 2: other two winners
  games.push({
    id: `${conf}-DIV-2`,
    round: "DIVISIONAL",
    conference: conf,
    home: teamA.seed < teamB.seed ? teamA.id : teamB.id,
    away: teamA.seed < teamB.seed ? teamB.id : teamA.id,
    homeSeed: teamA.seed < teamB.seed ? teamA.seed : teamB.seed,
    awaySeed: teamA.seed < teamB.seed ? teamB.seed : teamA.seed,
    played: false,
    homeScore: null,
    awayScore: null,
    winner: null
  });

  return games;
}

function formatResultLine(game) {
  const homeConf = getConference(game.home);
  
  const homeTeam = teams.find((t) => t.id === game.home);
  const awayTeam = teams.find((t) => t.id === game.away);

  const homeName = homeTeam
    ? `${homeTeam.city} ${homeTeam.mascot}`
    : game.home;
  const awayName = awayTeam
    ? `${awayTeam.city} ${awayTeam.mascot}`
    : game.away;

  return `${homeConf || ""} ${game.round}: ${homeName} ${game.homeScore} - ${awayName} ${game.awayScore}`;
}
