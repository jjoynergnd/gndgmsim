// src/generator/teamStateGenerator.ts

import { teams } from "../data/teams.js";
import type { TeamMeta } from "../data/teams.js";

import type { PlayerState } from "../state/player.js";
import type { TeamState, CapEntry } from "../state/team.js";

import { getLeagueCap } from "./cap/leagueCap.js";
import { getTeamTotalSalary, getTeamCapSpace } from "./cap/teamCapCalculator.js";

/**
 * Build a simple depth chart by grouping players by position
 * and sorting by overall rating.
 */
function buildDepthChart(players: PlayerState[]): Record<string, string[]> {
  const chart: Record<string, string[]> = {};

  for (const p of players) {
    if (!chart[p.position]) chart[p.position] = [];
    chart[p.position].push(p.id);
  }

  // Sort each position group by overall rating (desc)
  for (const pos of Object.keys(chart)) {
    chart[pos] = chart[pos].sort((a, b) => {
      const pa = players.find(p => p.id === a)!;
      const pb = players.find(p => p.id === b)!;
      return (pb.ratings.overall ?? 0) - (pa.ratings.overall ?? 0);
    });
  }

  return chart;
}

/**
 * Build injury report from player states.
 */
function buildInjuryReport(players: PlayerState[]) {
  return {
    out: players.filter(p => p.injuryStatus === "Out").map(p => p.id),
    questionable: players.filter(p => p.injuryStatus === "Questionable").map(p => p.id),
    ir: players.filter(p => p.injuryStatus === "IR").map(p => p.id)
  };
}

/**
 * Build salary summary + cap table.
 */
function buildCapTable(players: PlayerState[], year: number) {
  const leagueCap = getLeagueCap(year);
  const totalCapHit = getTeamTotalSalary(players, year);
  const capSpace = getTeamCapSpace(totalCapHit, leagueCap);

  const entries: CapEntry[] = players.map(p => {
    const breakdown = p.contract.yearBreakdown.find(y => y.year === year);
    return {
      playerId: p.id,
      capHit: breakdown?.capHit ?? 0,
      deadMoney: p.contract.deadMoney.find(d => d.year === year)?.total ?? 0,
      savings: breakdown?.capSavings ?? 0
    };
  });

  return {
    year,
    capLimit: leagueCap,
    totalCapHit,
    totalDeadMoney: entries.reduce((s, e) => s + e.deadMoney, 0),
    capSpace,
    entries
  };
}

/**
 * Main TeamState generator.
 */
export function generateTeamState(
  teamId: string,
  players: PlayerState[],
  year: number
): TeamState {
  const meta = teams.find(t => t.id === teamId) as TeamMeta;

  const teamName = `${meta.city} ${meta.mascot}`;

  return {
    // Identity
    teamId,
    teamName,
    city: meta.city,
    conference: meta.conference,
    division: meta.division,

    // Roster & staff
    players,
    staff: [],

    // Cap
    cap: buildCapTable(players, year),

    // Scheme (placeholder)
    scheme: {
      offense: "balanced",
      defense: "multiple",
      style: "default"
    },

    // Depth chart
    depthChart: buildDepthChart(players),

    // Performance
    record: { wins: 0, losses: 0, ties: 0 },

    stats: {
      seasonToDate: {},
      lastSeason: {}
    },

    // Draft capital
    draftPicks: [],

    // Transactions
    transactions: [],

    // Team needs (placeholder)
    teamNeeds: [],

    // Salary summary
    salarySummary: {
      totalCapHit: 0, // derived in cap table
      totalDeadMoney: 0,
      capSpace: 0
    },

    // Injury summary
    injuryReport: buildInjuryReport(players),

    // Coaching modifiers
    coachingModifiers: {
      offense: 0,
      defense: 0,
      development: 0
    },

    // Owner profile (placeholder)
    owner: {
      name: `${meta.city} Owner`,
      personality: "neutral",

      // numeric sliders
      patience: 50,
      involvement: 50,

      // expectations is a STRING
      expectations: "normal"
    },

    // Media
    media: {
      sentimentScore: 0
    }
  };
}