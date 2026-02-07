/* eslint-env node */
import { faker } from "@faker-js/faker";

export function generateContract() {
  const years = faker.number.int({ min: 1, max: 5 });
  const totalValue = faker.number.int({ min: 1_000_000, max: 120_000_000 });

  return {
    years,
    totalValue,
    capHit: faker.number.int({ min: 500_000, max: 25_000_000 }),
    deadCap: faker.number.int({ min: 200_000, max: 10_000_000 }),
    signingBonus: faker.number.int({ min: 200_000, max: 20_000_000 }),
    expiresYear: 2026 + years,
    contractType: faker.helpers.arrayElement(["Standard", "Rookie", "Extension"])
  };
}
