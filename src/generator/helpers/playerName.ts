  // src/generator/helpers/playerName.ts

import { pickOne } from "../utils/random.js";
import { FIRST_NAMES, LAST_NAMES } from "../../config/names.js";

export function generatePlayerName() {
  const firstName = pickOne(FIRST_NAMES);
  const lastName = pickOne(LAST_NAMES);
  return {
    firstName,
    lastName,
    name: `${firstName} ${lastName}`
  };
}