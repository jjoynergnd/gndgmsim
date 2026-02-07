/* eslint-env node */
import { faker } from "@faker-js/faker";

export function generateVitals() {
  return {
    age: faker.number.int({ min: 21, max: 34 }),
    height: faker.helpers.arrayElement([
      "5'9\"", "5'10\"", "5'11\"", "6'0\"", "6'1\"", "6'2\"", "6'3\"", "6'4\"", "6'5\""
    ]),
    weight: faker.number.int({ min: 185, max: 330 }),
    college: faker.location.city(),
    experience: faker.number.int({ min: 0, max: 12 }),
    archetype: faker.helpers.arrayElement([
      "Power", "Speed", "Balanced", "Technical", "Field General", "Playmaker"
    ]),
    handedness: faker.helpers.arrayElement(["Right", "Left"])
  };
}
