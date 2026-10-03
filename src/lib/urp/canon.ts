export type AxisId = "resource" | "capability" | "qualification" | "availability" | "authority";

export const AXES: { id: AxisId; word: string; means: string }[] = [
  {
    id: "resource",
    word: "Resource",
    means: "Something that exists and has an owner. Existence is not an offer.",
  },
  {
    id: "capability",
    word: "Capability",
    means: "What that thing can actually do, for which inputs, with which side effects.",
  },
  {
    id: "qualification",
    word: "Qualification",
    means: "Evidence that it may be a candidate for this class of work. Not permission.",
  },
  {
    id: "availability",
    word: "Availability",
    means: "It can be leased now. A stale listing is not a reservation.",
  },
  {
    id: "authority",
    word: "Authority",
    means: "A human grant, narrowed by FATE, for this exact effect. Nothing else creates it.",
  },
];

export type ResourceId = "local-rtx" | "cloud-model" | "unqualified-agent";

export interface ResourceCard {
  id: ResourceId;
  name: string;
  family: string;
  owner: string;
  locality: string;
  privacy: string;
  qualification: string;
  availability: string;
  authority: string;
  freshness: string;
  lifecycle: string;
  admissible: boolean;
  axes: Record<AxisId, string>;
  refusal: string;
}

export const RESOURCES: ResourceCard[] = [
  {
    id: "local-rtx",
    name: "Workstation GPU",
    family: "COMPUTE",
    owner: "This sovereign node",
    locality: "PRIVATE_NODE",
    privacy: "Accepts LOCAL_ONLY",
    qualification: "Qualified for local inference",
    availability: "Available in this walk",
    authority: "Not yet granted",
    freshness: "Current for the design walk",
    lifecycle: "Available — not yet leased",
    admissible: true,
    axes: {
      resource: "A GPU sits on the workstation. It is still private.",
      capability: "It can run the experiment offline, inside a bounded sandbox.",
      qualification: "Qualified for this local, network-off task class.",
      availability: "Idle enough to lease for one mission window.",
      authority: "Not granted until you ask, and FATE admits the exact write.",
    },
    refusal: "None for this mission’s hard constraints.",
  },
  {
    id: "cloud-model",
    name: "External specialist model",
    family: "MODEL",
    owner: "Another provider",
    locality: "PUBLIC_REMOTE",
    privacy: "Retains prompts for 30 days",
    qualification: "Qualified somewhere else",
    availability: "Listed as available",
    authority: "Not granted",
    freshness: "Provider claim, not re-measured here",
    lifecycle: "Listed — blocked by privacy",
    admissible: false,
    axes: {
      resource: "A stronger model exists outside the node.",
      capability: "Better at the comparison stage, if it may see the sources.",
      qualification: "Qualified for a different privacy class, not this one.",
      availability: "Reachable. Reachable is not allowed.",
      authority: "A faster answer cannot mint a data-egress grant.",
    },
    refusal: "PRIVACY_MISMATCH — LOCAL_ONLY sources cannot leave.",
  },
  {
    id: "unqualified-agent",
    name: "Unqualified community agent",
    family: "AGENT",
    owner: "Unstated",
    locality: "Unknown",
    privacy: "Unspecified retention",
    qualification: "Unqualified",
    availability: "Stale listing",
    authority: "Not granted",
    freshness: "Stale",
    lifecycle: "Discovered — not a candidate",
    admissible: false,
    axes: {
      resource: "An agent process advertised itself.",
      capability: "Claims it can reproduce experiments. Untested here.",
      qualification: "No evidence for this protected task class.",
      availability: "The listing is stale. Stale is not a lease.",
      authority: "Participation is not trust, and trust is not a grant.",
    },
    refusal: "Unqualified resources stay out of protected candidates.",
  },
];

export const LAWS: { id: string; text: string }[] = [
  { id: "I1", text: "Private resources are not pooled by discovery alone." },
  { id: "I2", text: "Resource discovery creates no authority." },
  { id: "I3", text: "Qualification creates no authority." },
  { id: "I4", text: "A mission lease cannot exceed its parent authority." },
  { id: "I5", text: "A worker cannot widen its lease." },
  { id: "I6", text: "Execution cannot self-verify." },
  { id: "I7", text: "Unknown effects cannot be blindly retried." },
  { id: "I8", text: "External use respects data-egress classification." },
  { id: "I9", text: "Reward requires verified impact, which this preview does not mint." },
  { id: "I10", text: "Simulation cannot create mintable impact." },
  { id: "I11", text: "Revocation blocks future leases. It does not prove historical deletion." },
  { id: "I12", text: "Historical evidence remains after supersession." },
  { id: "I13", text: "Learning cannot self-authorize." },
  { id: "I14", text: "A provider failure cannot destroy mission continuity." },
  { id: "I15", text: "Membership does not create peer trust. Nodes do not inherit authority from each other." },
];

export const CROSSES = [
  { name: "Admitted receipt", detail: "Minimal fields, schema version, subject hash, authority ref, proof ceiling." },
  { name: "Verification challenge", detail: "Subject hash, nonce, proof class, time scope. Not the raw files." },
  { name: "Bounded verdict", detail: "Verifier identity, rails, blockers, ceiling. A pass cannot outrun the rails." },
  { name: "Learning reference", detail: "Pointers to receipts. Never an expansion of authority." },
];

export const NEVER_CROSSES = [
  "Operator identity, device id, raw address",
  "Private mission history and the data lake",
  "PAT memory and unadmitted working context",
  "Local keys and signing material",
  "Unverified claims dressed as canon",
];

export const DOD_GROUPS: { title: string; items: { id: string; title: string; text: string }[] }[] = [
  {
    title: "Identity and contribution",
    items: [
      { id: "01", title: "Logical unity", text: "Many physical resources, one capability protocol. DEMA does not hard-code providers." },
      { id: "02", title: "Sovereign contribution", text: "A private resource stays private until an explicit, scoped, revocable contribution." },
      { id: "03", title: "Resource identity", text: "Stable id, owner domain, capability contract, evidence vector, version." },
      { id: "04", title: "Qualification", text: "Unqualified resources cannot silently become protected-task candidates." },
      { id: "05", title: "Discovery", text: "Hard constraints filter before any ranking. Utility never overrides them." },
    ],
  },
  {
    title: "Lease and privacy",
    items: [
      { id: "06", title: "Actor portability", text: "A qualified habit can change actor without rewriting the grant." },
      { id: "07", title: "Lease boundary", text: "Every consequential invocation sits inside an explicit mission lease." },
      { id: "08", title: "Data minimization", text: "LOCAL_ONLY stays local. Workers receive the mission, not the node." },
      { id: "09", title: "Credential mediation", text: "Workers get results, not standing credentials, whenever the contract allows." },
      { id: "10", title: "Isolation", text: "One lease cannot read another mission’s private state." },
    ],
  },
  {
    title: "Verification and recovery",
    items: [
      { id: "11", title: "FATE integration", text: "Availability does not become an effect without the authority membrane." },
      { id: "12", title: "Independent verification", text: "Where independence is required, the executor is not the witness." },
      { id: "13", title: "Honest unknown", text: "Ambiguous outcomes stay UNKNOWN. A timeout is not a failure and not a success." },
      { id: "14", title: "Recovery", text: "A provider can fail without the human reconstructing the mission." },
      { id: "15", title: "Revocation", text: "Future leases stop. Past external copies are a separate, explicit fact." },
    ],
  },
  {
    title: "Knowledge and economy",
    items: [
      { id: "16", title: "House of Wisdom", text: "Admitted wisdom is provenance-bound and distinct from proposals." },
      { id: "17", title: "Habit portability", text: "One habit, two actors, same authority and the same verifier contract." },
      { id: "18", title: "Accounting", text: "Usage attributes to a mission, a resource, a cost class, and a result." },
      { id: "19", title: "Verified impact", text: "Usage is not reward eligibility. Cost is not value." },
      { id: "20", title: "No self-reward", text: "The actor who produced an outcome cannot certify its own reward." },
    ],
  },
  {
    title: "Federation and the human",
    items: [
      { id: "21", title: "Federated proof", text: "Two sovereign nodes, bounded exchange, identities unmerged. Not open in this preview." },
      { id: "22", title: "Provider failure", text: "Removing a model does not delete the mission or the habit." },
      { id: "23", title: "Human comprehension", text: "DEMA can say why this resource, what it received, what it may do, what changed, how it was checked." },
      { id: "24", title: "Burden reduction", text: "Less manual routing and recovery, with authority expansion still at zero." },
      { id: "25", title: "Zero false green", text: "Illustrated is not measured. Unknown is not closed. This preview claims neither." },
    ],
  },
];

/** Measured local paths — not a live federation map. Refresh by re-probing disk. */
export type EcosystemHealth = "healthy" | "partial" | "blocked" | "absent" | "stale";

export interface EcosystemLink {
  id: string;
  name: string;
  role: string;
  path: string;
  remote: string;
  health: EcosystemHealth;
  evidence: string;
  crosses_urp: string;
}

export const ECOSYSTEM: EcosystemLink[] = [
  {
    id: "urp",
    name: "BIZRA_URP",
    role: "Shared substrate face — resource law, lease walk, proof ceiling",
    path: "/home/bizra-operating-system/BIZRA URP",
    remote: "https://github.com/BizraInfo/BIZRA_URP",
    health: "healthy",
    evidence: "npm test 0 · typecheck 0 · preview kernel PREVIEW_ONLY",
    crosses_urp: "This repo is the URP teaching surface and canon pin (v1.1).",
  },
  {
    id: "dema",
    name: "Dema",
    role: "Sovereign node companion — DEMA face, FATE corridor, Node0 CLI",
    path: "/home/bizra-operating-system/Downloads/Dema",
    remote: "https://github.com/BizraInfo/Dema",
    health: "partial",
    evidence: "status Ready:false · face-turn 25/25 · activation BLOCKED",
    crosses_urp: "Owns dema-face-turn-preview + node0-local-urp proofs; schema differs from this Face.",
  },
  {
    id: "home",
    name: "bizra-home",
    role: "Public / Node0 product surface (Next.js)",
    path: "/home/bizra-operating-system/bizra-home",
    remote: "https://github.com/BizraInfo/bizra-home",
    health: "partial",
    evidence: "main ahead of origin by 7 · local dirty paths observed",
    crosses_urp: "UI topology copy references URP; not a URP runtime.",
  },
  {
    id: "lake",
    name: "bizra-data-lake",
    role: "Persistent memory / sovereignty corpus for Node0",
    path: "/data/bizra/repos/bizra-data-lake",
    remote: "https://github.com/BizraInfo/bizra-data-lake",
    health: "stale",
    evidence: "TOPOLOGY_CANON present · last seen commit habit-only tick · not re-tested this pass",
    crosses_urp: "Constitutional topology names one shared URP; lake holds corpus, not the pool fabric.",
  },
  {
    id: "node0-frontend",
    name: "award-winner-design",
    role: "Node0 genesis frontend (under BIZRA Node0)",
    path: "/home/bizra-operating-system/BIZRA Node0/award-winner-design",
    remote: "https://github.com/BizraInfo/award-winner-design",
    health: "partial",
    evidence: "git present · symlink to data-lake · not suite-tested this pass",
    crosses_urp: "Presentation lane for Node0; must not mint URP authority.",
  },
  {
    id: "os",
    name: "BIZRA-OS",
    role: "OS / system-layer identity experiments",
    path: "/home/bizra-operating-system/Downloads/BIZRA-OS",
    remote: "https://github.com/BizraInfo/BIZRA-OS",
    health: "stale",
    evidence: "repo present · not health-gated this pass",
    crosses_urp: "Historical OS layer; not the shared URP fabric.",
  },
];

export const ESTATE_STOP =
  "ACTIVE_MISSION next_safe_action: STOP after D2. No Node1, federation, remote_write repair, or economy without new authority.";

export const NODES: {
  id: string;
  label: string;
  live: boolean;
  place: string;
  body: string;
}[] = [
  {
    id: "node0",
    label: "Node0",
    live: true,
    place: "You · DEMA · PAT local",
    body: "One human, one sovereign node. Private state, keys, and PAT stay here. This preview represents that relationship. It does not certify a deployed Node0 closure.",
  },
  {
    id: "node1",
    label: "Node1",
    live: false,
    place: "Designed · not connected",
    body: "Another human, another node, own keys. No application path reaches it from here. Federation stays future until the local loop is undeniable.",
  },
  {
    id: "node2",
    label: "Node2",
    live: false,
    place: "Designed · not connected",
    body: "Same rule. Contribution would be explicit and revocable. Connection would not donate the machine.",
  },
  {
    id: "node3",
    label: "Node3",
    live: false,
    place: "Designed · not connected",
    body: "A second device of the same human is still one node, not a new sovereign. This slot is a different human, and it is not live.",
  },
  {
    id: "urp",
    label: "URP",
    live: false,
    place: "Logical commons · not one server",
    body: "One logical pool: discovery, leases, verification routing, shared receipts. Physically it would be distributed. It must not become the owner of the human, and it is not running as a network in this preview.",
  },
];
