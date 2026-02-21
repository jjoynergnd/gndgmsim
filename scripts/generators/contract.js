// scripts/generators/contract.js

import { getMarketApy } from "./marketCurves.js";

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateContract(position, ratings, vitals, currentYear) {
  const ovr = ratings.overall ?? 70;
  const age = vitals.age ?? 25;
  const devTrait = vitals.devTrait || "Normal"; // or pull from traits if you prefer

  const isRookie = (vitals.experience ?? 0) <= 1;
  const isOlderVet = age >= 30;

  // Years
  let years;
  if (isRookie) years = randomInt(3, 4);
  else if (isOlderVet) years = randomInt(1, 3);
  else years = randomInt(2, 5);

  // APY in millions
  const apyM = getMarketApy(position, ovr, age, devTrait);
  const totalValueM = apyM * years;

  // Signing bonus: 20–35% of total
  const signingBonusM = totalValueM * (0.2 + Math.random() * 0.15);

  // Base salary is the rest
  const baseTotalM = totalValueM - signingBonusM;

  // Spread base salary across years (slightly backloaded)
  const baseSalary = {};
  let remainingBase = baseTotalM;
  for (let i = 0; i < years; i++) {
    const year = currentYear + i;
    const weight = 1 + i * 0.15; // backload a bit
    const share = weight / (years + (years - 1) * 0.15);
    const yearBase = baseTotalM * share;
    baseSalary[year] = yearBase;
    remainingBase -= yearBase;
  }

  // Prorate signing bonus evenly
  const bonusPerYearM = signingBonusM / years;
  const proratedBonus = {};
  for (let i = 0; i < years; i++) {
    const year = currentYear + i;
    proratedBonus[year] = bonusPerYearM;
  }

  // Cap hits and dead money
  const capHits = {};
  const deadMoney = {};
  for (let i = 0; i < years; i++) {
    const year = currentYear + i;
    capHits[year] = baseSalary[year] + proratedBonus[year];

    // If cut in that year, remaining bonus accelerates
    let remainingBonus = 0;
    for (let j = i; j < years; j++) {
      const y2 = currentYear + j;
      remainingBonus += proratedBonus[y2];
    }
    deadMoney[year] = remainingBonus;
  }

  const expiresYear = currentYear + years - 1;

  return {
    years,
    totalValue: Math.round(totalValueM * 1_000_000),
    apy: Math.round(apyM * 1_000_000),
    signingBonus: Math.round(signingBonusM * 1_000_000),
    baseSalary: Object.fromEntries(
      Object.entries(baseSalary).map(([y, v]) => [y, Math.round(v * 1_000_000)])
    ),
    proratedBonus: Object.fromEntries(
      Object.entries(proratedBonus).map(([y, v]) => [y, Math.round(v * 1_000_000)])
    ),
    capHits: Object.fromEntries(
      Object.entries(capHits).map(([y, v]) => [y, Math.round(v * 1_000_000)])
    ),
    deadMoney: Object.fromEntries(
      Object.entries(deadMoney).map(([y, v]) => [y, Math.round(v * 1_000_000)])
    ),
    expiresYear,
    contractType: isRookie ? "Rookie" : "Veteran",
  };
}
