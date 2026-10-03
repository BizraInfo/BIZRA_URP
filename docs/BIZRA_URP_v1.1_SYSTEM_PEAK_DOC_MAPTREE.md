# BIZRA URP v1.1 — System Peak Doc Maptree

**Canon source:** `docs/BIZRA_URP_System_Architecture_HLD_LLD_Technical_Spec_Master_v1.1.docx`  
**Also at:** `/home/bizra-operating-system/Downloads/BIZRA_URP_System_Architecture_HLD_LLD_Technical_Spec_Master_v1.1.docx`  
**sha256:** `49877b34f117b419dd7131e818f8725ccbc3a901b272f5167e79101dc480bd82`  
**Readable §§0–59 twin:** `docs/BIZRA_URP_NORTH_STAR_MANIFEST_PRODUCT_SPEC_v0.md` (`sha256:38303a36517cdf0ffe41b24f85fcebeae4956e7806487e0416979a65239c0705`)  
**Binding receipt:** `docs/BIZRA_URP_NORTH_STAR_BINDING_v0.md`  
**Document status (from control table):** Normative target architecture; current deployment must be rebound by separate evidence.  
**Maptree generated:** 2026-10-03 · peak lens (structure → proof ceiling → live preview binding)

Truth labels used below:

| Label | Meaning |
|---|---|
| `NORMATIVE` | Required by v1.1 target |
| `PREVIEW` | Illustrated in this repo’s local URP walk / Face |
| `WIRED_PARTIAL` | Partial code surface; not network-complete |
| `ABSENT` | Not implemented in this workspace |
| `EMULATED` | Modeled elsewhere; not runtime |

---

## 0. Document spine

```
BIZRA URP System Architecture Master v1.1
├── Document Control & Proof Discipline
├── PART I   §§0–17   North-Star & Sovereign Resource Constitution
├── PART II  §§18–33  Agents, Knowledge, Execution, Proof & Economics
├── PART III §§34–50  Network, Federation, Planes, Security & Recovery
├── PART IV  §§51–59  Stack, Architecture, Invariants, DOD & Acceptance
├── PART V   §§60–74  Implementation-Grade LLD Annex
└── APPENDICES A–D    Traceability, ADRs, Glossary, Closing
```

---

## 1. Peak map — Part → section → live binding

### PART I — North-Star & Sovereign Resource Constitution

| § | Title | Peak role | Live binding in this repo |
|---|---|---|---|
| 0 | Proof Ceiling | Claim discipline root | `PREVIEW` — Face `PREVIEW_ONLY`, walk `DESIGN_WALK` |
| 1 | Opening — The Manifest | Product north star | `PREVIEW` — `Manifest.tsx` |
| 2 | The Fundamental Idea | Pool capability / keep sovereignty | `PREVIEW` — Shell lede / brand |
| 3 | The URP Product Promise | Promise boundary | `PREVIEW` — copy in Rest/Manifest |
| 4 | The Constitutional Equation | Formal relation | `PREVIEW` — `Equation.tsx` |
| 5 | BIZRA’s Sovereign Resource Law | Private ≠ pooled | `PREVIEW` — canon laws I1–I15 |
| 6 | One Human — One Node — One URP | Node topology | `PREVIEW` — `Topology.tsx` / `NODES` |
| 7 | DEMA’s Relationship to URP | DEMA as face | `PREVIEW` — `Face.tsx` + `dema/face.ts` |
| 8 | URP Resource Classes | Taxonomy | `PREVIEW` — resource families in canon |
| 9 | The Resource Card | Identity surface | `PREVIEW` — `Rest.Resources` + `RESOURCES` |
| 10 | The Capability Contract | What it can do | `PREVIEW` — axes on cards |
| 11 | URP Resource Lifecycle | Discovered→…→Superseded | `PREVIEW` — lifecycle fields; not a live SM service |
| 12 | The URP Evidence Vector | Evidence dimensions | `PREVIEW` — VECTORS in Rest |
| 13 | Resource Contribution Contract | Contribution ≠ blank cheque | `PREVIEW` — prose |
| 14 | URP Resource Lease | Lease boundary | `PREVIEW` — MissionWalk lease path |
| 15 | Mission → URP Flow | End-to-end stages | `PREVIEW` — `walk.ts` stages |
| 16 | Resource Discovery Engine | Hard filters before rank | `PREVIEW` — SELECT / discovery stage |
| 17 | URP Scheduler | Rank without override | `ABSENT` as service; design-only |

### PART II — Agents, Knowledge, Execution, Proof & Economics

| § | Title | Peak role | Live binding |
|---|---|---|---|
| 18 | Smallest Adequate Team | Team composition | `ABSENT` |
| 19 | PAT and URP | Private agent | `PREVIEW` — Face holds PAT-local contract |
| 20 | SAT and URP | Verification agent | `PREVIEW` — witness stage labels only |
| 21 | FATE and URP | Authority membrane | `PREVIEW` — `walk` FATE decisions |
| 22 | House of Wisdom inside URP | Admitted knowledge | `PREVIEW` — learning stage (no HoW store) |
| 23 | Knowledge Object | Provenance-bound object | `ABSENT` |
| 24 | Skills in URP | Loadable skills | `PREVIEW` — Face skill cards (consent/branch/lesson/witness) |
| 25 | Habit Portability | HabitSpec | `ABSENT` |
| 26 | URP Execution Plane | Bounded execution | `PREVIEW` — local effect commit in walk |
| 27 | Credential Mediation | Results ≠ standing creds | `ABSENT` |
| 28 | Data-Egress Policy | LOCAL_ONLY etc. | `PREVIEW` — `PRIVACY_MISMATCH` on cloud |
| 29 | Execution Is Not Verification | Separation | `PREVIEW` — observe ≠ execute |
| 30 | The Dual-Proof Model | Structural + semantic | `PREVIEW` — rails on design receipt |
| 31 | Usage Receipt | Accounting artifact | `PREVIEW` — `DesignReceipt` |
| 32 | Proof of Impact | Reward eligibility | `PREVIEW` hold — `impact_claimed: false` |
| 33 | Economic Plane | Cost ≠ value | `PREVIEW` hold — mint blocked |

### PART III — Network, Federation, Planes, Security & Recovery

| § | Title | Peak role | Live binding |
|---|---|---|---|
| 34 | URP Network Architecture | Logical fabric | `ABSENT` (nodes marked not live) |
| 35 | No Direct Trust Path | Trust law | `PREVIEW` — law I15 |
| 36 | Federation Model | Forest pilot | `PREVIEW` refuse — `REQUIRE_NEW_AUTHORITY` |
| 37–42 | Protocol + four planes | Control/Data/Evidence/Governance | `ABSENT` as services |
| 43–44 | Security / Zero-trust access | Access model | `ABSENT` network; Face grant phrases only |
| 45 | Revocation | Future leases stop | `ABSENT` |
| 46–48 | Failure / Retry / Recovery | Failure taxonomy | `WIRED_PARTIAL` — walk codes only |
| 49 | Observability | Telemetry | `ABSENT` |
| 50 | Privacy UX | Human-facing privacy | `PREVIEW` — Face/walk copy |

### PART IV — Stack, Architecture, Invariants, DOD & Acceptance

| § | Title | Peak role | Live binding |
|---|---|---|---|
| 51 | Technical Stack — Target | Runtime stack | `WIRED_PARTIAL` — TanStack/Vite preview host |
| 52 | High-Level Software Architecture | Module map | `WIRED_PARTIAL` — UI + kernels, not URP services |
| 53 | Master System Invariants | I-laws | `PREVIEW` — `LAWS` in canon |
| 54 | Non-Functional Requirements | NFR classes | `ABSENT` measured |
| 55 | URP Definition of Done | DOD-01…25 | `PREVIEW` — `DOD_GROUPS` / DefinitionOfDone |
| 56 | Master URP Acceptance Mission | Acceptance story | `PREVIEW` — MissionWalk |
| 57 | The True URP KPI | KPI discipline | `PREVIEW` prose |
| 58 | The URP Masterpiece Moment | Narrative close | `PREVIEW` prose |
| 59 | Final Manifest | Closing oath | `PREVIEW` — Manifest |

### PART V — LLD Annex

| § | Title | Peak role | Live binding |
|---|---|---|---|
| 60 | LLD Scope & Implementation Boundary | What LLD covers | Normative text only |
| 61 | Target Service / Module Topology | Services | `ABSENT` |
| 62 | Persistence & Evidence Stores | Stores | Auth/db scaffold off; no URP stores |
| 63 | Core Data Contracts (Card/Capability/Lease/Receipt) | Schemas | `WIRED_PARTIAL` — preview types in canon/walk |
| 64–65 | Lifecycle + Mission/Lease state machines | SM specs | `WIRED_PARTIAL` — `walk.ts` design SM |
| 66 | FATE Evaluator Contract | Evaluator API | `WIRED_PARTIAL` — inline in walk |
| 67 | Discovery & Scheduler Algorithm | Algorithm | Hard filters in walk; no ranker service |
| 68 | Verification / Receipt Pipeline | Pipeline | Design receipt only |
| 69 | BlockTree / BlockGraph LLD | Evidence graph | `ABSENT` |
| 70 | House of Wisdom & HabitSpec LLD | Knowledge LLD | `ABSENT` |
| 71 | Security & Privacy Enforcement | Enforcement | Face withhold + walk BLOCK |
| 72 | Deployment Topologies | Deploy shapes | App Builder / Vercel scaffold |
| 73 | Verification, Test & CI Matrix | Test matrix | `WIRED_PARTIAL` — Face + walk tests gated |
| 74 | Delivery Sequence & First Executable Slice | Delivery order | This preview is a teaching slice, not §74 network slice |

### Appendices

| ID | Title | Binding |
|---|---|---|
| A | DOD Traceability Matrix | Maps to `DOD_GROUPS` ids |
| B | ADR Backlog | Not instantiated as ADRs in-repo |
| C | Glossary | Terms mirrored in UI copy |
| D | Canonical Closing Statement | Aligns with Manifest |

---

## 2. Flow trees (from the doc)

### 2.1 Mission → URP (§15)

```
HUMAN INTENT
  → MISSION CONTRACT
  → RESOURCE REQUIREMENT
  → URP DISCOVERY
  → QUALIFIED CANDIDATES
  → PLANNER / ROUTER
  → RESOURCE LEASE
  → BOUNDED EXECUTION
  → POSTSTATE OBSERVATION
  → SAT VERIFICATION
  → USAGE RECEIPT
  → MISSION OUTCOME
  → OPTIONAL IMPACT CLAIM
```

**Preview collapse:** `walk.ts` stages  
`intent → contract → discovery → admission → effect → observation → receipt → learning`

### 2.2 Resource lifecycle (§11)

```
DISCOVERED → REGISTERED → CANDIDATE → QUALIFIED → AVAILABLE
                                              ↘ SUSPENDED
                                              ↘ SUPERSEDED
```

### 2.3 House of Wisdom admission (§22)

```
RAW SOURCE → PAT PROPOSAL → PROVENANCE → CHALLENGE → SAT VERIFICATION
  → CONSENT / GOVERNANCE → HOUSE OF WISDOM → URP-SHAREABLE
```

### 2.4 Proof of Impact (§32) — economy stays dark in preview

```
CONTRIBUTION → VERIFIED OUTCOME → HUMAN / MISSION BENEFIT
  → IMPACT CLAIM → INDEPENDENT EVALUATION → REWARD ELIGIBILITY
```

---

## 3. SNR compression (peak spearpoint from the doc × repo)

1. **Highest verified leverage now:** keep §0 proof ceiling — never promote preview to network readiness.  
2. **Executable kernel present:** §15/§21/§28/§31 via `walk.ts` + tests.  
3. **Largest ABSENT mass:** §§34–50 network/federation planes, §61 services, §69 BlockGraph.  
4. **Doc canon pin:** v1.1 sha above outranks older `attachments/*` v2/v3/docx copies until rebind.

**Deferred (need separate GO):** implementing LLD services, federation, BlockGraph, PoI minting, pruning superseded attachments.

---

## 4. Receipt

| Field | Value |
|---|---|
| Artifact | `docs/BIZRA_URP_v1.1_SYSTEM_PEAK_DOC_MAPTREE.md` |
| Source doc sha256 | `49877b34f117b419dd7131e818f8725ccbc3a901b272f5167e79101dc480bd82` |
| Source version | 1.1 · 3 October 2026 |
| Claim ceiling | Normative target ≠ measured deployment |
| Mapping confidence | High for TOC structure; medium for every LLD field-to-file (ABSENT labeled) |
