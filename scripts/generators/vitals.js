// scripts/generators/vitals.js
import { faker } from "@faker-js/faker";

const POSITION_BODY = {
  QB:  { height: [73, 78],  weight: [205, 245] },
  RB:  { height: [68, 73],  weight: [195, 230] },
  WR:  { height: [70, 76],  weight: [180, 215] },
  TE:  { height: [75, 79],  weight: [240, 265] },
  LT:  { height: [76, 80],  weight: [305, 350] },
  LG:  { height: [75, 79],  weight: [305, 340] },
  C:   { height: [74, 78],  weight: [295, 330] },
  RG:  { height: [75, 79],  weight: [305, 340] },
  RT:  { height: [76, 80],  weight: [305, 350] },
  CB:  { height: [70, 74],  weight: [180, 200] },
  FS:  { height: [70, 74],  weight: [185, 205] },
  SS:  { height: [71, 75],  weight: [195, 215] },
  MLB: { height: [72, 76],  weight: [230, 255] },
  OLB: { height: [73, 77],  weight: [235, 260] },
  EDGE:{ height: [75, 79],  weight: [245, 270] },
  DT:  { height: [74, 78],  weight: [300, 330] },
  K:   { height: [70, 74],  weight: [180, 210] },
  P:   { height: [72, 76],  weight: [190, 220] },
};

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateVitals(position) {
  const body = POSITION_BODY[position] || { height: [70, 75], weight: [190, 240] };

  const heightInches = rand(body.height[0], body.height[1]);
  const feet = Math.floor(heightInches / 12);
  const inches = heightInches % 12;

  return {
    age: rand(21, 33),
    height: `${feet}'${inches}"`,
    weight: rand(body.weight[0], body.weight[1]),
    college: faker.location.city(),
    experience: rand(0, 10),
    archetype: null, // assigned later
    handedness: Math.random() < 0.9 ? "Right" : "Left",
  };
}
