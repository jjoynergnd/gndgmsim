/* eslint-env node */
import { faker } from "@faker-js/faker";

export function generateRatings(position) {
  const base = faker.number.int({ min: 60, max: 85 });

  const ratings = {
    overall: base,
    potential: faker.number.int({ min: base, max: base + 10 }),
    schemeFit: faker.number.int({ min: 70, max: 95 }),

    // Physical
    speed: faker.number.int({ min: 70, max: 95 }),
    acceleration: faker.number.int({ min: 70, max: 95 }),
    agility: faker.number.int({ min: 70, max: 95 }),
    strength: faker.number.int({ min: 60, max: 95 }),

    // Defense
    tackle: faker.number.int({ min: 60, max: 95 }),
    pursuit: faker.number.int({ min: 60, max: 95 }),
    manCoverage: faker.number.int({ min: 50, max: 90 }),
    zoneCoverage: faker.number.int({ min: 50, max: 90 }),

    // Special Teams
    kickPower: faker.number.int({ min: 50, max: 95 }),
    kickAccuracy: faker.number.int({ min: 50, max: 95 }),

    // Receiving
    catching: faker.number.int({ min: 50, max: 95 }),
    routeRunning: faker.number.int({ min: 50, max: 95 }),
    release: faker.number.int({ min: 50, max: 95 })
  };

  // QB-specific ratings
  if (position === "QB") {
    ratings.throwPower = faker.number.int({ min: 70, max: 95 });
    ratings.shortAccuracy = faker.number.int({ min: 60, max: 95 });
    ratings.mediumAccuracy = faker.number.int({ min: 60, max: 95 });
    ratings.deepAccuracy = faker.number.int({ min: 60, max: 95 });
  }

  return ratings;
}
