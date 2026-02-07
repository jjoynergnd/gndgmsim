/* eslint-env node */
import { faker } from "@faker-js/faker";

export function generateTraits() {
  return {
    personality: faker.helpers.arrayElement(["Calm", "Fiery", "Quiet", "Leader"]),
    devTrait: faker.helpers.arrayElement(["Normal", "Star", "Superstar"]),
    clutch: faker.helpers.arrayElement(["Low", "Average", "High"]),
    injuryProne: faker.helpers.arrayElement(["Low", "Medium", "High"]),
    workEthic: faker.helpers.arrayElement(["Low", "Average", "High"]),
    leadership: faker.helpers.arrayElement(["Low", "Average", "High"])
  };
}
