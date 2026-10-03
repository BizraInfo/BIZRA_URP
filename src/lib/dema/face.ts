export const SCHEMA = "bizra.dema.face_turn.v0.1";
export const TRUTH_LABEL = "PREVIEW_ONLY";

const VERBS = ["transfer", "publish", "deploy", "delete", "send", "mint", "pay"] as const;
export type DangerousVerb = (typeof VERBS)[number];
export type Verb = DangerousVerb | "none";

export const GRANT_PHRASE: Record<DangerousVerb, string> = {
  send: "GO: withhold send",
  publish: "GO: withhold publish",
  mint: "GO: withhold mint",
  pay: "GO: withhold pay",
  deploy: "GO: withhold deploy",
  delete: "GO: withhold delete",
  transfer: "GO: withhold transfer",
};

const SIGNAL = [
  "evidence",
  "measured",
  "receipt",
  "checkpoint",
  "witness",
  "grant",
  "observed",
  "preview",
  "proof",
  "local",
];

const NOISE = [
  "live",
  "singularity",
  "autopoietic",
  "shipped",
  "proven",
  "network",
  "minted",
  "done",
  "federation",
  "reward",
  "invoke",
];

export type Gate = "pass" | "withhold" | "refuse";
export type SkillId = "consent" | "branch" | "lesson" | "witness";

export interface SkillCard {
  id: SkillId;
  body: string;
}

export type Ratio = number | "not_supplied";

export interface Snr {
  signal: number;
  noise: number;
  ratio: Ratio;
}

export interface Checkpoint {
  schema: typeof SCHEMA;
  id: string;
  parent_id: string | null;
  branch: string;
  contract_id: string;
  sentence: string;
  goal: string;
  current_state: string;
  next_step: string;
  will_change: string;
  will_not_change: string;
  unknown: string;
  result: string;
  lesson: string | null;
  signal: number;
  noise: number;
  ratio: Ratio;
  verb: Verb;
  envelope: boolean;
  held: boolean;
  authority_ceiling: 0;
}

export interface FaceTurn {
  schema: typeof SCHEMA;
  truth_label: typeof TRUTH_LABEL;
  reading: "answer_preview" | "refusal";
  promoted: boolean;
  refusal: string | null;
  goal: string;
  current_state: string;
  next_step: string;
  will_change: string;
  will_not_change: string;
  unknown: string;
  result: string;
  authority_delta: 0;
  effect_ran: false;
  minted: false;
  successful_completion: false;
  preview_only_hold: true;
  exact_grant_required: boolean;
  grant_matched: boolean;
  lifecycle: "not_observed";
  child_gate: "held" | "refused";
  private_history_shared: false;
  lesson: string | null;
  snr: Snr;
  checkpoint: Checkpoint;
  gate: Gate;
  skills_loaded: SkillCard[];
  skills_left_out: SkillId[];
  consulted_lesson: string | null;
}

export interface FaceInput {
  sentence: string;
  mode: "root" | "continue";
  parent?: Checkpoint | null;
  contract_id?: string | null;
  grant_phrase?: string;
  branch?: string | null;
  prior_lessons?: string[];
}

export interface PublicContract {
  schema: "bizra.dema.public_contract.v0.1";
  contract_id: string;
  goal: string;
  will_change: string;
  will_not_change: string;
  authority_ceiling: 0;
  effect: "none";
  private_history_shared: false;
}

const WILL_CHANGE = "This screen, and a checkpoint kept in this browser.";
const WILL_NOT =
  "Authority, files, the network, wallets, and any effect outside this page.";
const UNKNOWN_IDLE =
  "Whether a later independent witness would agree. This page cannot supply that witness.";
export const PURPOSE_NOT_SEPARATED =
  "Purpose not separated. The words stay on this face as evidence. They are not a mission spec.";

export function activePath<T extends { id: string; parent_id: string | null }>(
  nodes: T[],
  fromId: string,
): T[] {
  const byId = new Map(nodes.map((node) => [node.id, node]));
  const path: T[] = [];
  const seen = new Set<string>();
  let cursor: string | null = fromId;
  while (cursor && !seen.has(cursor)) {
    const node = byId.get(cursor);
    if (!node) break;
    seen.add(cursor);
    path.push(node);
    cursor = node.parent_id;
  }
  return path.reverse();
}

export function compactPath<T>(path: T[], keep = 3): { shown: T[]; earlier: number } {
  if (keep < 1) return { shown: [], earlier: path.length };
  if (path.length <= keep) return { shown: path, earlier: 0 };
  return { shown: path.slice(path.length - keep), earlier: path.length - keep };
}

export const CONTEXT_KEEP = 4;

export function contextLessons<T extends { lesson: string | null }>(
  path: T[],
  keep = CONTEXT_KEEP,
): string[] {
  return compactPath(path, keep)
    .shown.map((node) => (node.lesson ?? "").trim())
    .filter((lesson) => lesson.length > 0);
}

function skillView(args: {
  sentence: string;
  verb: Verb;
  hasParent: boolean;
  priorLessons: string[];
}): { skills_loaded: SkillCard[]; skills_left_out: SkillId[]; consulted_lesson: string | null } {
  const consulted = args.priorLessons.length > 0 ? args.priorLessons[args.priorLessons.length - 1] : null;
  const catalog: { id: SkillId; load: boolean; body: string }[] = [
    {
      id: "consent",
      load: args.verb !== "none",
      body: "PreToolUse. The phrase marks the boundary. The effect is not executed.",
    },
    {
      id: "branch",
      load: args.hasParent,
      body: "The active path is the history. Older entries stay stored and are not the next context.",
    },
    {
      id: "lesson",
      load: consulted !== null,
      body: consulted ? `Consulted, not obeyed. ${consulted}` : "",
    },
    {
      id: "witness",
      load: /\b(witness|evidence|proof)\b/i.test(args.sentence),
      body: "A witness word does not make this page the witness. Lifecycle stays not_observed.",
    },
  ];
  return {
    skills_loaded: catalog.filter((item) => item.load).map((item) => ({ id: item.id, body: item.body })),
    skills_left_out: catalog.filter((item) => !item.load).map((item) => item.id),
    consulted_lesson: consulted,
  };
}

export function fnv1a(text: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

export function canonicalize(value: unknown): string {
  return JSON.stringify(order(value));
}

function order(value: unknown): unknown {
  if (value === null) return null;
  if (typeof value === "string" || typeof value === "boolean") return value;
  if (typeof value === "number") {
    if (!Number.isFinite(value)) throw new Error("number_not_finite");
    return value;
  }
  if (Array.isArray(value)) return value.map(order);
  if (typeof value === "object") {
    if (Object.getPrototypeOf(value) !== Object.prototype) throw new Error("not_plain");
    const source = value as Record<string, unknown>;
    const sorted: Record<string, unknown> = {};
    for (const key of Object.keys(source).sort()) {
      if (source[key] === undefined) continue;
      sorted[key] = order(source[key]);
    }
    return sorted;
  }
  throw new Error("not_json");
}

export function detectVerb(sentence: string): Verb {
  for (const verb of VERBS) {
    if (new RegExp(`\\b${verb}\\b`, "i").test(sentence)) return verb;
  }
  return "none";
}

export function scoreSnr(sentence: string): Snr {
  const tokens = sentence.toLowerCase().match(/[a-z0-9_]+/g) ?? [];
  const signalWords = new Set(SIGNAL);
  const noiseWords = new Set(NOISE);
  let signal = 0;
  let noise = 0;
  for (const token of tokens) {
    if (signalWords.has(token)) signal += 1;
    if (noiseWords.has(token)) noise += 1;
  }
  if (signal === 0 && noise === 0) return { signal, noise, ratio: "not_supplied" };
  return { signal, noise, ratio: signal / (signal + noise) };
}

function lessonFor(snr: Snr): string | null {
  if (snr.ratio === "not_supplied") return null;
  if (snr.signal > 0 && snr.noise === 0) {
    return "Evidence words stay a claim until a witness reads them back.";
  }
  if (snr.noise > 0 && snr.signal === 0) {
    return "Loud words were counted as noise. They did not move the lifecycle.";
  }
  return "Evidence words and noise words were both counted. The ratio is not a verdict.";
}

function blankCheckpoint(): Checkpoint {
  return {
    schema: SCHEMA,
    id: "",
    parent_id: null,
    branch: "",
    contract_id: "",
    sentence: "",
    goal: "",
    current_state: "No turn was taken.",
    next_step: "Write one intention.",
    will_change: "Nothing.",
    will_not_change: WILL_NOT,
    unknown: UNKNOWN_IDLE,
    result: "",
    lesson: null,
    signal: 0,
    noise: 0,
    ratio: "not_supplied",
    verb: "none",
    envelope: true,
    held: false,
    authority_ceiling: 0,
  };
}

function screen(
  checkpoint: Checkpoint,
  extra: {
    reading: FaceTurn["reading"];
    promoted: boolean;
    refusal: string | null;
    exact_grant_required: boolean;
    grant_matched: boolean;
    child_gate: FaceTurn["child_gate"];
  },
  context?: { sentence?: string; hasParent?: boolean; priorLessons?: string[] },
): FaceTurn {
  const sentence = context?.sentence ?? checkpoint.sentence;
  const hasParent = context?.hasParent ?? Boolean(checkpoint.parent_id);
  const priorLessons = context?.priorLessons ?? [];
  const gate: Gate = extra.refusal ? "refuse" : checkpoint.held || extra.grant_matched ? "withhold" : "pass";
  const skills = skillView({ sentence, verb: checkpoint.verb, hasParent, priorLessons });
  return {
    schema: SCHEMA,
    truth_label: TRUTH_LABEL,
    reading: extra.reading,
    promoted: extra.promoted,
    refusal: extra.refusal,
    goal: checkpoint.goal,
    current_state: checkpoint.current_state,
    next_step: checkpoint.next_step,
    will_change: checkpoint.will_change,
    will_not_change: checkpoint.will_not_change,
    unknown: checkpoint.unknown,
    result: checkpoint.result,
    authority_delta: 0,
    effect_ran: false,
    minted: false,
    successful_completion: false,
    preview_only_hold: true,
    exact_grant_required: extra.exact_grant_required,
    grant_matched: extra.grant_matched,
    lifecycle: "not_observed",
    child_gate: extra.child_gate,
    private_history_shared: false,
    lesson: checkpoint.lesson,
    snr: { signal: checkpoint.signal, noise: checkpoint.noise, ratio: checkpoint.ratio },
    checkpoint,
    gate,
    skills_loaded: skills.skills_loaded,
    skills_left_out: skills.skills_left_out,
    consulted_lesson: skills.consulted_lesson,
  };
}

function clip(sentence: string): string {
  if (sentence.length <= 180) return sentence;
  return `${sentence.slice(0, 179).trimEnd()}…`;
}

function childBranch(parent: Checkpoint, requested: string | null | undefined): string {
  if (!requested || requested === parent.branch) return parent.branch;
  const prefix = `${parent.branch}/`;
  if (requested.startsWith(prefix) && requested.length < 80 && /^[a-z0-9/_-]+$/i.test(requested)) {
    return requested;
  }
  return parent.branch;
}

function judgeGrant(verb: Verb, phrase: string | undefined) {
  if (verb === "none") return { required: false, matched: false, refusal: null as string | null };
  const exact = GRANT_PHRASE[verb];
  const given = (phrase ?? "").trim();
  if (given.length === 0) return { required: true, matched: false, refusal: "grant_required" };
  if (given === exact) return { required: true, matched: true, refusal: null };
  if (given.toLowerCase() === exact.toLowerCase()) {
    return { required: true, matched: false, refusal: "near_phrase" };
  }
  return { required: true, matched: false, refusal: "grant_mismatch" };
}

export function previewFaceTurn(input: FaceInput): FaceTurn {
  const sentence = input.sentence.trim().replace(/\s+/g, " ");
  const parent = input.parent ?? null;
  const prior = (input.prior_lessons ?? []).map((item) => item.trim()).filter((item) => item.length > 0).slice(-8);

  if (sentence.length === 0) {
    const checkpoint = blankCheckpoint();
    checkpoint.result = "Nothing was read. An empty intention is not a turn.";
    return screen(checkpoint, {
      reading: "refusal",
      promoted: false,
      refusal: "empty_subject",
      exact_grant_required: false,
      grant_matched: false,
      child_gate: "held",
    });
  }

  if (sentence.length > 2000) {
    const checkpoint = blankCheckpoint();
    checkpoint.sentence = sentence.slice(0, 80);
    checkpoint.result = "The intention is wider than this face. It was not taken.";
    return screen(checkpoint, {
      reading: "refusal",
      promoted: false,
      refusal: "too_wide",
      exact_grant_required: false,
      grant_matched: false,
      child_gate: "held",
    });
  }

  if (input.mode === "continue" && !parent) {
    const checkpoint = blankCheckpoint();
    checkpoint.sentence = sentence;
    checkpoint.goal = clip(sentence);
    checkpoint.result = "There is no checkpoint to resume.";
    return screen(checkpoint, {
      reading: "refusal",
      promoted: false,
      refusal: "nothing_to_resume",
      exact_grant_required: false,
      grant_matched: false,
      child_gate: "held",
    });
  }

  if (
    input.mode === "continue" &&
    parent &&
    input.contract_id &&
    input.contract_id !== parent.contract_id
  ) {
    const checkpoint = blankCheckpoint();
    checkpoint.sentence = sentence;
    checkpoint.goal = clip(sentence);
    checkpoint.current_state = "A different contract is on the desk. This face will not switch it.";
    checkpoint.next_step = "Continue the open contract, or start a separate one on purpose.";
    checkpoint.result = "Refused. A foreign contract does not inherit this checkpoint.";
    return screen(checkpoint, {
      reading: "refusal",
      promoted: false,
      refusal: "foreign_contract",
      exact_grant_required: false,
      grant_matched: false,
      child_gate: "held",
    });
  }

  if (input.mode === "continue" && parent?.held) {
    const checkpoint: Checkpoint = {
      ...parent,
      held: true,
      current_state: "Held. The previous turn was interrupted. Nothing in flight was confirmed.",
      next_step: "Do not retry. Resume shows this same checkpoint, or start a separate contract.",
      unknown: "Whether an earlier effect landed. It is not treated as success, and it is not retried.",
      result: "Not retried.",
    };
    return screen(checkpoint, {
      reading: "answer_preview",
      promoted: true,
      refusal: null,
      exact_grant_required: false,
      grant_matched: false,
      child_gate: "held",
    }, { sentence: parent.sentence, hasParent: Boolean(parent.parent_id), priorLessons: prior });
  }

  const verb = detectVerb(sentence);
  const envelope = verb === "none";
  const widens =
    input.mode === "continue" &&
    parent &&
    !parent.held &&
    !envelope &&
    (parent.envelope || parent.verb !== verb);

  if (widens && parent) {
    const snr = scoreSnr(sentence);
    const checkpoint = blankCheckpoint();
    checkpoint.parent_id = parent.id;
    checkpoint.branch = parent.branch;
    checkpoint.contract_id = parent.contract_id;
    checkpoint.sentence = sentence;
    checkpoint.goal = clip(sentence);
    checkpoint.current_state = `Child of ${parent.id} on ${parent.branch}. The parent did not admit this verb.`;
    checkpoint.next_step = "Stay inside the parent envelope, or start a separate contract.";
    checkpoint.will_change = "Nothing. The child was not promoted.";
    checkpoint.unknown = UNKNOWN_IDLE;
    checkpoint.result = "Child gate refused. A child cannot open an effect the parent did not admit.";
    checkpoint.lesson = lessonFor(snr);
    checkpoint.signal = snr.signal;
    checkpoint.noise = snr.noise;
    checkpoint.ratio = snr.ratio;
    checkpoint.verb = verb;
    checkpoint.envelope = false;
    return screen(checkpoint, {
      reading: "refusal",
      promoted: false,
      refusal: "child_gate",
      exact_grant_required: false,
      grant_matched: false,
      child_gate: "refused",
    }, { sentence, hasParent: true, priorLessons: prior });
  }

  const grant = judgeGrant(verb, input.grant_phrase);
  const snr = scoreSnr(sentence);
  const lesson = lessonFor(snr);
  const branch = parent && input.mode === "continue" ? childBranch(parent, input.branch) : "main";
  const contractId =
    parent && input.mode === "continue"
      ? parent.contract_id
      : fnv1a(canonicalize({ schema: SCHEMA, kind: "contract", sentence: sentence.toLowerCase() }));
  const parentId = parent && input.mode === "continue" ? parent.id : null;

  const granted = !grant.required || grant.matched;
  let result = "Preview held. No effect ran. Nothing was minted.";
  let next = "Read the six lines. Then hold, continue, or hand the contract outward.";
  let state = parent
    ? `Continuing ${contractId} on ${branch}. Parent ${parent.id}.`
    : "No prior turn on this face.";

  if (grant.required && !grant.matched) {
    result = "Stopped before the effect. Authority did not grow.";
    next = "Type the exact phrase, or stay inside the envelope. Matching it still will not run the effect.";
    state = `The verb “${verb}” is outside the envelope.`;
  } else if (grant.matched) {
    result = "Phrase recognized. Effect still withheld. Authority did not grow.";
    next = "Leave the effect withheld. This preview has no executor.";
    state = `The verb “${verb}” was named. The phrase matched. Nothing was sent.`;
  }

  const goal = clip(sentence);
  const id = granted
    ? fnv1a(
        canonicalize({
          schema: SCHEMA,
          parent_id: parentId,
          branch,
          contract_id: contractId,
          sentence,
          verb,
        }),
      )
    : "";

  const checkpoint: Checkpoint = {
    schema: SCHEMA,
    id,
    parent_id: parentId,
    branch: granted ? branch : "",
    contract_id: granted ? contractId : "",
    sentence,
    goal,
    current_state: state,
    next_step: next,
    will_change: granted ? WILL_CHANGE : "Nothing. The turn was not promoted.",
    will_not_change: WILL_NOT,
    unknown: UNKNOWN_IDLE,
    result,
    lesson,
    signal: snr.signal,
    noise: snr.noise,
    ratio: snr.ratio,
    verb,
    envelope,
    held: false,
    authority_ceiling: 0,
  };

  return screen(checkpoint, {
    reading: granted ? "answer_preview" : "refusal",
    promoted: granted,
    refusal: grant.refusal,
    exact_grant_required: grant.required,
    grant_matched: grant.matched,
    child_gate: "held",
  }, { sentence, hasParent: Boolean(parent && input.mode === "continue"), priorLessons: prior });
}

export function holdTurn(turn: FaceTurn): FaceTurn {
  if (!turn.promoted || !turn.checkpoint.id || turn.checkpoint.held) return turn;
  const checkpoint: Checkpoint = {
    ...turn.checkpoint,
    held: true,
    current_state: "Held. The turn is interrupted.",
    next_step: "Resume shows this same checkpoint. A new intention needs a separate contract.",
    unknown: "Whether an earlier effect landed. It is not treated as success, and it is not retried.",
    result: "Not retried.",
  };
  const next = screen(checkpoint, {
    reading: "answer_preview",
    promoted: true,
    refusal: null,
    exact_grant_required: false,
    grant_matched: false,
    child_gate: "held",
  });
  return {
    ...next,
    skills_loaded: turn.skills_loaded,
    skills_left_out: turn.skills_left_out,
    consulted_lesson: turn.consulted_lesson,
  };
}

export function publicContract(turn: FaceTurn): PublicContract | null {
  if (!turn.promoted || !turn.checkpoint.contract_id) return null;
  return {
    schema: "bizra.dema.public_contract.v0.1",
    contract_id: turn.checkpoint.contract_id,
    goal: PURPOSE_NOT_SEPARATED,
    will_change: turn.will_change,
    will_not_change: turn.will_not_change,
    authority_ceiling: 0,
    effect: "none",
    private_history_shared: false,
  };
}
