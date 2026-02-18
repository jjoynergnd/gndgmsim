// src/utils/seasonEngine/offseasonEngine.js

import { OFFSEASON_STEPS } from "./constants";

/* ======================================================
   OFFSEASON
====================================================== */

export function advanceOffseason(season) {
  const idx = OFFSEASON_STEPS.indexOf(season.offseasonStep);

  if (idx < OFFSEASON_STEPS.length - 1) {
    season.offseasonStep = OFFSEASON_STEPS[idx + 1];
    season.lastResult = {
      summary: `${OFFSEASON_STEPS[idx]} complete`,
      details: ""
    };
  } else {
    season.phase = "PRESEASON";
    season.offseasonStep = null;
    season.lastResult = {
      summary: "Offseason complete",
      details: "Preseason begins."
    };
  }
}
