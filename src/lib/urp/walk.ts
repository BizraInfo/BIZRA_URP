import { RESOURCES, type ResourceId } from "./canon.ts";

export type StageId =
  | "intent"
  | "contract"
  | "discovery"
  | "admission"
  | "effect"
  | "observation"
  | "receipt"
  | "learning";

export type ActionId = "lease_local" | "send_cloud" | "mint_impact" | "open_federation";

export type Fate = "GO" | "BLOCK" | "REQUIRE_NEW_AUTHORITY";

export type Usefulness = "UNASKED" | "USEFUL" | "NEEDS_CORRECTION" | "NOT_USEFUL";

export type Rail = "PASS" | "NOT_RUN" | "NOT_APPLICABLE" | "FAIL";

export interface Decision {
  action: ActionId;
  fate: Fate;
  code: string;
  reason: string;
}

export interface DesignReceipt {
  schema: "bizra.urp.usage_receipt.design_walk.v1";
  mission_id: "mission-private-reproduction";
  operation_id: "op-local-summary-1";
  resource_id: ResourceId;
  effect: "write one local summary artifact";
  effect_count: 1;
  duplicate_attempts: number;
  authority_delta: 0;
  impact_claimed: false;
  result: "VERIFIED_INSIDE_DESIGN_WALK";
  truth_label: "DESIGN_WALK";
  rails: { formal: Rail; cryptographic: Rail; empirical: Rail; economic: Rail };
  ceiling: string;
  usefulness: Usefulness;
}

export interface WalkState {
  stage: StageId;
  selected: ResourceId | null;
  decision: Decision | null;
  effectCommitted: boolean;
  observed: boolean;
  duplicateAttempts: number;
  receipt: DesignReceipt | null;
  learning: boolean;
  usefulness: Usefulness;
}

export type WalkEvent =
  | { type: "TO"; stage: StageId }
  | { type: "SELECT"; id: ResourceId }
  | { type: "ACTION"; action: ActionId }
  | { type: "EXECUTE" }
  | { type: "OBSERVE" }
  | { type: "SEAL" }
  | { type: "REPLAY" }
  | { type: "USEFULNESS"; value: Exclude<Usefulness, "UNASKED"> }
  | { type: "LEARN" }
  | { type: "RESET" };

export const STAGES: { id: StageId; label: string }[] = [
  { id: "intent", label: "Intent" },
  { id: "contract", label: "Contract" },
  { id: "discovery", label: "Discovery" },
  { id: "admission", label: "FATE" },
  { id: "effect", label: "Effect" },
  { id: "observation", label: "Witness" },
  { id: "receipt", label: "Receipt" },
  { id: "learning", label: "Learning" },
];

export const CEILING =
  "Design walk only. Formal shape and a separate readback passed inside this preview. No signature was made. No economic value was claimed. This is not a live node, an independent origin, or Proof-of-Impact.";

export function createWalk(): WalkState {
  return {
    stage: "intent",
    selected: null,
    decision: null,
    effectCommitted: false,
    observed: false,
    duplicateAttempts: 0,
    receipt: null,
    learning: false,
    usefulness: "UNASKED",
  };
}

export function decide(action: ActionId, selected: ResourceId | null): Decision {
  if (action === "send_cloud") {
    return {
      action,
      fate: "BLOCK",
      code: "PRIVACY_MISMATCH",
      reason: "The mission is LOCAL_ONLY. Sending sources to a retaining external model is outside the grant. A stronger model does not override the boundary.",
    };
  }
  if (action === "mint_impact") {
    return {
      action,
      fate: "BLOCK",
      code: "VALUE_NOT_PROVEN",
      reason: "Compute that might be consumed is not impact. This preview has no economic rail, and simulation cannot mint one.",
    };
  }
  if (action === "open_federation") {
    return {
      action,
      fate: "REQUIRE_NEW_AUTHORITY",
      code: "AUTHORITY_REQUIRED",
      reason: "Node1 is not connected. Federation, publication, and sharing the raw lake sit outside this lease. A signature would not create the missing grant.",
    };
  }
  if (selected !== "local-rtx") {
    const card = RESOURCES.find((r) => r.id === selected);
    return {
      action,
      fate: "BLOCK",
      code: selected === "cloud-model" ? "PRIVACY_MISMATCH" : "QUALIFICATION_REQUIRED",
      reason: card
        ? card.refusal
        : "Select a resource before asking for a lease. Discovery has not chosen for you.",
    };
  }
  return {
    action,
    fate: "GO",
    code: "ADMITTED",
    reason: "The workstation lease fits the standing grant: one local reversible write, network off, no economy, no second node. FATE admits this effect and nothing wider.",
  };
}

function receiptFor(state: WalkState): DesignReceipt {
  return {
    schema: "bizra.urp.usage_receipt.design_walk.v1",
    mission_id: "mission-private-reproduction",
    operation_id: "op-local-summary-1",
    resource_id: "local-rtx",
    effect: "write one local summary artifact",
    effect_count: 1,
    duplicate_attempts: state.duplicateAttempts,
    authority_delta: 0,
    impact_claimed: false,
    result: "VERIFIED_INSIDE_DESIGN_WALK",
    truth_label: "DESIGN_WALK",
    rails: {
      formal: "PASS",
      cryptographic: "NOT_RUN",
      empirical: "PASS",
      economic: "NOT_APPLICABLE",
    },
    ceiling: CEILING,
    usefulness: state.usefulness,
  };
}

const ORDER: StageId[] = [
  "intent",
  "contract",
  "discovery",
  "admission",
  "effect",
  "observation",
  "receipt",
  "learning",
];

function indexOf(stage: StageId) {
  return ORDER.indexOf(stage);
}

export function reduce(state: WalkState, event: WalkEvent): WalkState {
  switch (event.type) {
    case "RESET":
      return createWalk();
    case "TO": {
      if (indexOf(event.stage) > indexOf(state.stage)) return state;
      return { ...state, stage: event.stage };
    }
    case "SELECT": {
      if (state.effectCommitted) return state;
      return { ...state, selected: event.id, decision: null, stage: "discovery" };
    }
    case "ACTION": {
      if (state.effectCommitted) return state;
      const decision = decide(event.action, state.selected);
      return {
        ...state,
        stage: "admission",
        decision,
      };
    }
    case "EXECUTE": {
      if (state.decision?.fate !== "GO" || state.effectCommitted) return state;
      return { ...state, stage: "effect", effectCommitted: true };
    }
    case "OBSERVE": {
      if (!state.effectCommitted) return state;
      return { ...state, stage: "observation", observed: true };
    }
    case "SEAL": {
      if (!state.observed) return state;
      const next = { ...state, stage: "receipt" as const };
      return { ...next, receipt: receiptFor(next) };
    }
    case "REPLAY": {
      if (!state.receipt) return state;
      const duplicateAttempts = state.duplicateAttempts + 1;
      const next = { ...state, duplicateAttempts };
      return { ...next, receipt: { ...receiptFor(next), usefulness: state.usefulness } };
    }
    case "USEFULNESS": {
      if (!state.receipt) return state;
      return {
        ...state,
        usefulness: event.value,
        receipt: { ...state.receipt, usefulness: event.value },
      };
    }
    case "LEARN": {
      if (!state.receipt || state.usefulness === "UNASKED") return state;
      return { ...state, stage: "learning", learning: true };
    }
    default:
      return state;
  }
}

export function advance(state: WalkState): WalkState {
  if (state.stage === "intent") return { ...state, stage: "contract" };
  if (state.stage === "contract") return { ...state, stage: "discovery" };
  if (state.stage === "discovery" && state.selected) return { ...state, stage: "admission", decision: null };
  if (state.stage === "effect" && state.effectCommitted) return { ...state, stage: "observation" };
  if (state.stage === "admission" && state.decision?.fate === "GO") return { ...state, stage: "effect" };
  return state;
}
