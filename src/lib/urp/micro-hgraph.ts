/**
 * Ultra-micro local hypergraph + retrieve + hierarchical reason steps.
 * Not a hosted RAG service. Not an LLM. Not trainable HHMM weights.
 * Retrieval is keyword overlap over pinned canon nodes only.
 */

export const HGRAPH_SCHEMA = "bizra.urp.micro_hgraph.v0.1";
export const HGRAPH_TRUTH = "LOCAL_CANON_RETRIEVE_ONLY";

export type NodeKind = "root" | "law" | "protocol" | "ladder" | "fde" | "surface";

export interface HNode {
  id: string;
  kind: NodeKind;
  title: string;
  body: string;
  tokens: string[];
}

export interface HEdge {
  from: string;
  to: string;
  rel: "grounds" | "constrains" | "implements" | "forbids" | "next";
}

export interface RetrieveHit {
  id: string;
  score: number;
  title: string;
  body: string;
  kind: NodeKind;
}

export interface HrmStep {
  level: number;
  id: string;
  title: string;
  why: string;
}

export interface RetrieveResult {
  schema: typeof HGRAPH_SCHEMA;
  truth_label: typeof HGRAPH_TRUTH;
  query: string;
  hits: RetrieveHit[];
  hrm: HrmStep[];
  graph_slice: { nodes: string[]; edges: Array<[string, string, string]> };
  effect_ran: false;
  minted: false;
}

const NODES: HNode[] = [
  {
    id: "root.themassage",
    kind: "root",
    title: "The Message — niyyah",
    body: "After the financial seed the road is not for pure profit; ihsan, peace, and human equality bind the work.",
    tokens: ["message", "niyyah", "ihsan", "mercy", "peace", "profit", "vow", "human"],
  },
  {
    id: "root.bizra_seed",
    kind: "root",
    title: "البذرة — seed journey",
    body: "Heart measures the mind. Seed may stay seed. No riba. Solidarity and discipline before guarantees.",
    tokens: ["seed", "bizra", "heart", "riba", "finance", "solidity", "discipline", "ihsan"],
  },
  {
    id: "root.third_fact",
    kind: "root",
    title: "Third Fact",
    body: "Humanity is the infrastructure. Claim discipline active. Proof before forest.",
    tokens: ["third", "fact", "humanity", "infrastructure", "proof", "claim", "node", "seed", "forest"],
  },
  {
    id: "protocol.tfp",
    kind: "protocol",
    title: "Third Fact Protocol",
    body: "Mind may propose; memory retrieve; logic test; crypto seal; receipts preserve; human must consent.",
    tokens: ["mind", "memory", "logic", "crypto", "receipt", "consent", "protocol", "proof"],
  },
  {
    id: "ladder.local",
    kind: "ladder",
    title: "URP_LOCAL_ACTIVE",
    body: "Current proven stage: Node0 alone. Private pilot and network URP are direction only.",
    tokens: ["urp", "local", "active", "ladder", "federation", "network", "node0", "pilot"],
  },
  {
    id: "fde.law",
    kind: "fde",
    title: "DEMA-FDE",
    body: "Inward repair; outward diagnose; consent stops; simulation cannot mint; cost is not value.",
    tokens: ["fde", "inward", "outward", "consent", "mint", "cost", "value", "failure"],
  },
  {
    id: "law.discovery",
    kind: "law",
    title: "I2 — discovery creates no authority",
    body: "Finding a resource does not grant a lease or an effect.",
    tokens: ["discovery", "authority", "lease", "resource", "grant"],
  },
  {
    id: "law.execution",
    kind: "law",
    title: "I6 — execution cannot self-verify",
    body: "The actor who produced an outcome is not its independent witness.",
    tokens: ["execution", "verify", "witness", "receipt", "self"],
  },
  {
    id: "law.sim",
    kind: "law",
    title: "I10 — simulation cannot mint impact",
    body: "Preview and design walks do not create reward eligibility.",
    tokens: ["simulation", "mint", "impact", "preview", "reward", "poi"],
  },
  {
    id: "surface.invoke",
    kind: "surface",
    title: "invoke() preview loop",
    body: "Minimal agent cycle that seals a preview turn and never runs the effect.",
    tokens: ["invoke", "loop", "agent", "preview", "seal", "face", "gate"],
  },
  {
    id: "surface.walk",
    kind: "surface",
    title: "Mission design walk",
    body: "Local lease admitted; cloud, mint, and federation fail closed.",
    tokens: ["walk", "mission", "lease", "cloud", "mint", "federation", "fate"],
  },
];

const EDGES: HEdge[] = [
  { from: "root.themassage", to: "root.bizra_seed", rel: "grounds" },
  { from: "root.bizra_seed", to: "root.third_fact", rel: "grounds" },
  { from: "root.third_fact", to: "protocol.tfp", rel: "implements" },
  { from: "root.third_fact", to: "ladder.local", rel: "constrains" },
  { from: "protocol.tfp", to: "surface.invoke", rel: "implements" },
  { from: "ladder.local", to: "surface.walk", rel: "implements" },
  { from: "fde.law", to: "law.sim", rel: "constrains" },
  { from: "fde.law", to: "surface.invoke", rel: "constrains" },
  { from: "law.discovery", to: "surface.walk", rel: "constrains" },
  { from: "law.execution", to: "surface.walk", rel: "constrains" },
  { from: "law.sim", to: "surface.invoke", rel: "forbids" },
  { from: "surface.invoke", to: "surface.walk", rel: "next" },
];

function tokenize(text: string): string[] {
  return (text.toLowerCase().match(/[a-z0-9_]+/g) ?? []).filter((t) => t.length > 2);
}

function scoreNode(queryTokens: string[], node: HNode): number {
  if (queryTokens.length === 0) return 0;
  let hit = 0;
  const bag = new Set(node.tokens);
  for (const token of queryTokens) {
    if (bag.has(token)) hit += 2;
    else if (node.body.toLowerCase().includes(token) || node.title.toLowerCase().includes(token)) hit += 1;
  }
  return hit;
}

/** Keyword retrieve over the pinned canon hypergraph. */
export function retrieve(query: string, limit = 4): RetrieveResult {
  const q = query.trim().replace(/\s+/g, " ");
  const queryTokens = tokenize(q);
  const ranked = NODES.map((node) => ({
    node,
    score: scoreNode(queryTokens, node),
  }))
    .filter((row) => row.score > 0)
    .sort((a, b) => b.score - a.score || a.node.id.localeCompare(b.node.id))
    .slice(0, Math.max(1, limit));

  const fallback =
    ranked.length > 0
      ? ranked
      : [{ node: NODES.find((n) => n.id === "ladder.local")!, score: 0 }];

  const hits: RetrieveHit[] = fallback.map((row) => ({
    id: row.node.id,
    score: row.score,
    title: row.node.title,
    body: row.node.body,
    kind: row.node.kind,
  }));

  const hitIds = new Set(hits.map((h) => h.id));
  const hrm = hierarchicalReason(hits);
  for (const step of hrm) hitIds.add(step.id);

  const edges = EDGES.filter((e) => hitIds.has(e.from) || hitIds.has(e.to))
    .filter((e) => hitIds.has(e.from) && hitIds.has(e.to))
    .map((e) => [e.from, e.to, e.rel] as [string, string, string]);

  return {
    schema: HGRAPH_SCHEMA,
    truth_label: HGRAPH_TRUTH,
    query: q,
    hits,
    hrm,
    graph_slice: { nodes: [...hitIds], edges },
    effect_ran: false,
    minted: false,
  };
}

/** Climb from surface hits toward roots (hierarchical reason — static edges only). */
export function hierarchicalReason(hits: RetrieveHit[]): HrmStep[] {
  const byId = new Map(NODES.map((n) => [n.id, n]));
  const steps: HrmStep[] = [];
  const seen = new Set<string>();
  let frontier = hits.map((h) => h.id);

  for (let level = 0; level < 3 && frontier.length > 0; level += 1) {
    const next: string[] = [];
    for (const id of frontier) {
      if (seen.has(id)) continue;
      seen.add(id);
      const node = byId.get(id);
      if (!node) continue;
      steps.push({
        level,
        id,
        title: node.title,
        why: level === 0 ? "Matched query tokens." : "Parent constraint via hypergraph edge.",
      });
      for (const edge of EDGES) {
        if (edge.to === id && (edge.rel === "grounds" || edge.rel === "constrains" || edge.rel === "implements")) {
          next.push(edge.from);
        }
      }
    }
    frontier = next;
  }
  return steps;
}

export function hgraphStats() {
  return { nodes: NODES.length, edges: EDGES.length, schema: HGRAPH_SCHEMA, truth_label: HGRAPH_TRUTH };
}
