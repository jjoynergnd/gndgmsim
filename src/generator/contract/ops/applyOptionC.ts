// src/generator/contract/ops/applyOptionC.ts

import type {
  Contract,
  OptionCPlan,
  OptionCMetadata
} from "../contractBase.js";

import { extendContract } from "./extendContract.js";
import { applyRestructure } from "./applyRestructure.js";
import { buildPlayerModalContractMetadata } from "./modalMetadata.js";

/**
 * Option C orchestrator:
 * - Applies extension first (if provided)
 * - Applies restructure second (if provided)
 * - Produces OptionCMetadata
 * - Produces PlayerModalContractMetadata for UI
 */
export function applyOptionC(
  base: Contract,
  plan: OptionCPlan
): Contract & {
  optionCMetadata: OptionCMetadata;
  modalMetadata?: ReturnType<typeof buildPlayerModalContractMetadata>;
} {
  let working: Contract = base;

  const didExtend = !!plan.extension;
  const didRestructure = !!plan.restructure;

  let extensionMetadata: any = null;
  let restructureMetadata: any = null;

  // -----------------------------
  // 1. Apply extension (if any)
  // -----------------------------
  if (plan.extension) {
    const extended = extendContract(working, plan.extension);
    working = extended;
    extensionMetadata = extended.extensionMetadata;
  }

  // -----------------------------
  // 2. Apply restructure (if any)
  // -----------------------------
  if (plan.restructure) {
    const restructured = applyRestructure(working, plan.restructure);
    working = restructured;
    restructureMetadata = restructured.restructureMetadata;
  }

  // -----------------------------
  // 3. Build Option C metadata
  // -----------------------------
  const optionCMetadata: OptionCMetadata = {
    didExtend,
    didRestructure,
    extensionMetadata: didExtend ? extensionMetadata : undefined,
    restructureMetadata: didRestructure ? restructureMetadata : undefined,
  };

  // -----------------------------
  // 4. Build modal metadata (UI)
  // -----------------------------
  const modalMetadata = buildPlayerModalContractMetadata(base, working);

  // -----------------------------
  // 5. Return final contract
  // -----------------------------
  return {
    ...working,
    optionCMetadata,
    modalMetadata,
  };
}
