/* eslint-env node */
import { faker } from "@faker-js/faker";

export function generateStats() {
  return {
    season: {
      games: faker.number.int({ min: 0, max: 17 }),
      statA: faker.number.int({ min: 0, max: 1000 }),
      statB: faker.number.int({ min: 0, max: 1000 })
    },
    career: {
      games: faker.number.int({ min: 0, max: 120 }),
      statA: faker.number.int({ min: 0, max: 5000 }),
      statB: faker.number.int({ min: 0, max: 5000 })
    }
  };
}
