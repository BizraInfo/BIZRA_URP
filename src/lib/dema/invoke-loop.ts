/**
 * Ultra-micro invoke() loop — preview only.
 * Embodies Third Fact Protocol sequencing without claiming autopoiesis,
 * RSI, singularity, or mintable impact.
 */
import {
  canonicalize,
  fnv1a,
  previewFaceTurn,
  scoreSnr,
  type FaceInput,
  type FaceTurn,
  type Snr,
} from "./face.ts";
import { retrieve, type RetrieveResult } from "../urp/micro-hgraph.ts";

export const INVOKE_SCHEMA = "bizra.dema.invoke_loop.v0.1";
export const INVOKE_TRUTH = "PREVIEW_ONLY_INVOKE";

export type TfpStage = "mind" | "memory" | "logic" | "crypto" | "receipts" | "human";
export type StageVerdict = "pass" | "block" | "skip" | "withhold";
export type HhmmHidden = "idle" | "propose" | "gate" | "withhold" | "refuse" | "held";
export type FdeClass = "INWARD" | "OUTWARD" | "CONSENT_STOP" | "NONE";
export type PotRail = "PASS" | "NOT_RUN" | "NOT_APPLICABLE" | "FAIL";

export interface PotRails {
  formal: PotRail;
  cryptographic: PotRail;
  empirical: PotRail;
  economic: PotRail;
}

export interface ProcessEvent {
  seq: number;
  stage: TfpStage | "emit" | "fde";
  verdict: StageVerdict | "note";
  note: string;
}

export interface InvokeCycle {
  schema: typeof INVOKE_SCHEMA;
  truth_label: typeof INVOKE_TRUTH;
  turn: FaceTurn;
  protocol: Record<TfpStage, StageVerdict>;
  snr: Snr;
  pot: PotRails;
  /** Observable emission → inferred hidden state (hypothesis, not a trained HMM). */
  hhmm: { hidden: HhmmHidden; emission: string; note: string };
  /** Concept index for this cycle only. */
  hashtable: Record<string, string>;
  /** Adjacent checks diffused from the strongest finding. */
  diffusion: string[];
  /** Tiny thought graph: nodes + directed edges. */
  graph: { nodes: string[]; edges: Array<[string, string]> };
  process: ProcessEvent[];
  seal: string;
  authority_delta: 0;
  effect_ran: false;
  minted: false;
  fde: { class: FdeClass; note: string };
  spearpoint_next: string;
  /** Local canon hypergraph retrieve — not hosted RAG. */
  retrieve: RetrieveResult;
}

const ROOT_HASHES = {
  themassage: "e05b73b933df31964b96255dca673300b01caea3bce8bd283e7f6440a876d3ce",
  bizra_seed: "f95bc6f76acdc9339e005411a17810c50624784f18b55811d8339fcef6601538",
  third_fact: "1deacd63f42315d7ae5ac426eb33149fae5d37e99c67b3949421b2c5c80cd02d",
} as const;

function push(
  process: ProcessEvent[],
  stage: ProcessEvent["stage"],
  verdict: ProcessEvent["verdict"],
  note: string,
) {
  process.push({ seq: process.length + 1, stage, verdict, note });
}

function hhmmOf(turn: FaceTurn): InvokeCycle["hhmm"] {
  if (turn.refusal === "empty_subject") {
    return { hidden: "idle", emission: "empty", note: "No intention — no transition." };
  }
  if (turn.gate === "refuse") {
    return { hidden: "refuse", emission: turn.refusal ?? "refuse", note: "Emission refused; hidden state stays non-effect." };
  }
  if (turn.gate === "withhold" || turn.checkpoint.held) {
    return { hidden: "withhold", emission: turn.checkpoint.verb, note: "Dangerous verb or hold — effect withheld." };
  }
  if (turn.promoted) {
    return { hidden: "propose", emission: "answer_preview", note: "Preview promoted; still not observed as live execution." };
  }
  return { hidden: "gate", emission: turn.gate, note: "At the gate; no substrate effect." };
}

function fdeOf(turn: FaceTurn): InvokeCycle["fde"] {
  if (turn.exact_grant_required && !turn.grant_matched) {
    return { class: "CONSENT_STOP", note: "Missing exact grant — action stopped before effect." };
  }
  if (turn.refusal === "child_gate" || turn.refusal === "foreign_contract") {
    return { class: "INWARD", note: "Boundary logic inside the face kernel refused the turn." };
  }
  if (turn.refusal === "too_wide") {
    return { class: "INWARD", note: "Input width exceeded preview envelope." };
  }
  return { class: "NONE", note: "No failure to launder; preview completed or withheld cleanly." };
}

function potOf(turn: FaceTurn): PotRails {
  return {
    formal: turn.promoted || turn.gate === "withhold" || turn.gate === "refuse" ? "PASS" : "FAIL",
    cryptographic: "NOT_RUN",
    empirical: "NOT_RUN",
    economic: "NOT_APPLICABLE",
  };
}

function diffuse(turn: FaceTurn, snr: Snr): string[] {
  const out = [
    "Re-check authority_ceiling stays 0.",
    "Re-check effect_ran stays false.",
    "Re-check Third Fact ladder: URP_LOCAL_ACTIVE only.",
  ];
  if (snr.noise > 0) out.push("Noise words present — do not promote lifecycle.");
  if (turn.checkpoint.verb !== "none") out.push("Dangerous verb path — require exact phrase; still withhold.");
  if (turn.child_gate === "refused") out.push("Child cannot widen parent envelope.");
  return out;
}

function graphOf(turn: FaceTurn): InvokeCycle["graph"] {
  const nodes = ["intention", "tfp", "face", "fate", "receipt", "human"];
  const edges: Array<[string, string]> = [
    ["intention", "tfp"],
    ["tfp", "face"],
    ["face", "fate"],
    ["fate", "receipt"],
    ["receipt", "human"],
  ];
  if (turn.checkpoint.verb !== "none") {
    nodes.push("grant");
    edges.push(["fate", "grant"], ["grant", "human"]);
  }
  return { nodes, edges };
}

function spearpoint(turn: FaceTurn): string {
  if (!turn.promoted && turn.refusal) {
    return `Repair inward face refusal '${turn.refusal}' or supply exact grant — still no effect.`;
  }
  if (turn.gate === "withhold") {
    return "Leave effect withheld. Do not invent an executor. Next: one local walk lease only.";
  }
  return "Read six lines. Hold, continue, or hand the contract. Do not claim network URP.";
}

/**
 * One closed preview cycle: Mind→Memory→Logic→Crypto→Receipts→Human.
 * Crypto seals a content hash only — it does not sign with Node0 keys.
 */
export function invoke(input: FaceInput): InvokeCycle {
  const process: ProcessEvent[] = [];
  push(process, "mind", "pass", "Intention admitted as a proposal only.");

  const prior = input.prior_lessons ?? [];
  const turn = previewFaceTurn(input);
  const snr = scoreSnr(input.sentence ?? "");
  const canon = retrieve(input.sentence ?? "", 4);
  push(
    process,
    "memory",
    prior.length > 0 || canon.hits.length > 0 ? "pass" : "skip",
    `Lessons=${prior.length} (consult only). Hgraph hits=${canon.hits.length} (${canon.truth_label}).`,
  );
  push(
    process,
    "logic",
    turn.gate === "refuse" && turn.refusal === "empty_subject" ? "block" : "pass",
    `Face kernel gate=${turn.gate}; refusal=${turn.refusal ?? "none"}.`,
  );

  const body = {
    schema: INVOKE_SCHEMA,
    truth_label: INVOKE_TRUTH,
    turn_id: turn.checkpoint.id,
    gate: turn.gate,
    verb: turn.checkpoint.verb,
    snr,
    roots: ROOT_HASHES,
  };
  const seal = fnv1a(canonicalize(body));
  push(process, "crypto", "pass", `Content seal ${seal} (preview hash, not a Node0 signature).`);

  push(
    process,
    "receipts",
    turn.promoted ? "pass" : "withhold",
    turn.promoted ? "Preview receipt fields filled; not mintable." : "No promoted receipt head.",
  );

  const humanVerdict: StageVerdict =
    turn.exact_grant_required && !turn.grant_matched
      ? "block"
      : turn.gate === "withhold"
        ? "withhold"
        : turn.gate === "refuse"
          ? "block"
          : "pass";
  push(
    process,
    "human",
    humanVerdict,
    humanVerdict === "block"
      ? "Consent incomplete or refusal — stop."
      : humanVerdict === "withhold"
        ? "Phrase matched or hold — effect still withheld."
        : "Envelope path — human may read; no external effect.",
  );

  const fde = fdeOf(turn);
  push(process, "fde", "note", `${fde.class}: ${fde.note}`);

  const protocol: Record<TfpStage, StageVerdict> = {
    mind: "pass",
    memory: prior.length > 0 || canon.hits.length > 0 ? "pass" : "skip",
    logic: turn.refusal === "empty_subject" ? "block" : "pass",
    crypto: "pass",
    receipts: turn.promoted ? "pass" : "withhold",
    human: humanVerdict,
  };

  const cycle: InvokeCycle = {
    schema: INVOKE_SCHEMA,
    truth_label: INVOKE_TRUTH,
    turn,
    protocol,
    snr,
    pot: potOf(turn),
    hhmm: hhmmOf(turn),
    hashtable: {
      schema: INVOKE_SCHEMA,
      face_schema: turn.schema,
      truth: INVOKE_TRUTH,
      gate: turn.gate,
      verb: turn.checkpoint.verb,
      fde: fde.class,
      root_third_fact: ROOT_HASHES.third_fact.slice(0, 12),
      urp_ladder: "URP_LOCAL_ACTIVE",
    },
    diffusion: diffuse(turn, snr),
    graph: graphOf(turn),
    process,
    seal,
    authority_delta: 0,
    effect_ran: false,
    minted: false,
    fde,
    spearpoint_next: spearpoint(turn),
    retrieve: canon,
  };

  push(process, "emit", "note", `Cycle sealed ${seal}; spearpoint recorded.`);
  return cycle;
}

export interface InvokeHarnessReport {
  ok: boolean;
  schema: typeof INVOKE_SCHEMA;
  truth_label: typeof INVOKE_TRUTH;
  cases: Array<{ name: string; ok: boolean; detail: string }>;
  self_critique: string[];
  compliance: string[];
  consent: string[];
}

/** Fail-closed self-harness: critique · compliance · consent. */
export function runInvokeLoopCheck(): InvokeHarnessReport {
  const cases: InvokeHarnessReport["cases"] = [];
  const self_critique: string[] = [];
  const compliance: string[] = [];
  const consent: string[] = [];

  const empty = invoke({ sentence: "", mode: "root" });
  cases.push({
    name: "empty_blocks",
    ok: empty.protocol.logic === "block" && !empty.minted && !empty.effect_ran,
    detail: `logic=${empty.protocol.logic}`,
  });

  const envelope = invoke({
    sentence: "Draft the local summary and keep the sources here.",
    mode: "root",
  });
  cases.push({
    name: "envelope_preview",
    ok:
      envelope.turn.promoted &&
      !envelope.effect_ran &&
      !envelope.minted &&
      envelope.pot.economic === "NOT_APPLICABLE" &&
      envelope.retrieve.truth_label === "LOCAL_CANON_RETRIEVE_ONLY",
    detail: `promoted=${envelope.turn.promoted}; hits=${envelope.retrieve.hits.length}`,
  });

  const noGrant = invoke({ sentence: "Send the sources to the cloud model.", mode: "root" });
  cases.push({
    name: "consent_stop_send",
    ok: noGrant.fde.class === "CONSENT_STOP" && !noGrant.effect_ran && !noGrant.minted,
    detail: `fde=${noGrant.fde.class}`,
  });
  consent.push(
    noGrant.fde.class === "CONSENT_STOP"
      ? "PASS: missing grant stops send."
      : "FAIL: send without grant did not CONSENT_STOP.",
  );

  const granted = invoke({
    sentence: "Send the sources to the cloud model.",
    mode: "root",
    grant_phrase: "GO: withhold send",
  });
  cases.push({
    name: "grant_still_withholds",
    ok: granted.turn.grant_matched && !granted.effect_ran && !granted.minted,
    detail: `matched=${granted.turn.grant_matched}`,
  });
  compliance.push(
    !granted.minted && granted.pot.economic === "NOT_APPLICABLE"
      ? "PASS: grant cannot mint economic rail."
      : "FAIL: economic rail leaked.",
  );
  compliance.push(
    envelope.hashtable.urp_ladder === "URP_LOCAL_ACTIVE"
      ? "PASS: ladder pinned to URP_LOCAL_ACTIVE."
      : "FAIL: ladder drift.",
  );

  self_critique.push(
    cases.every((c) => c.ok)
      ? "Harness green: no false mint, no effect, consent path exercised."
      : "Harness red: one or more invariant cases failed.",
  );
  self_critique.push(
    "OUTWARD not claimed: no Dema activation, no federation, no hosted RAG.",
  );

  const ok = cases.every((c) => c.ok) && consent.every((line) => line.startsWith("PASS"));
  return {
    ok,
    schema: INVOKE_SCHEMA,
    truth_label: INVOKE_TRUTH,
    cases,
    self_critique,
    compliance,
    consent,
  };
}
