# BIZRA URP

**Universal Resource Pool** — the shared substrate of the BIZRA ecosystem.

> Pool capability. Preserve sovereignty.  
> Every consequential claim stops exactly where its proof stops.

This repository is the **URP face + design-walk preview** and the pin for
`BIZRA_URP_System_Architecture_HLD_LLD_Technical_Spec_Master_v1.1`.

It is **not** a live multi-node URP fabric, not Node1, and not an economy mint.

## Role in the ecosystem

| Layer | Repo | Relationship to URP |
|---|---|---|
| Shared substrate | **BIZRA_URP** (this) | Resource law, lease walk, proof ceiling |
| Sovereign companion | [Dema](https://github.com/BizraInfo/Dema) | DEMA face / FATE / Node0 CLI |
| Product home | [bizra-home](https://github.com/BizraInfo/bizra-home) | Public Node0 surface |
| Memory corpus | [bizra-data-lake](https://github.com/BizraInfo/bizra-data-lake) | Constitution + persistent memory |
| Node0 UI | [award-winner-design](https://github.com/BizraInfo/award-winner-design) | Genesis frontend |

Topology canon (data lake): each human is one Node; PAT stays local; SAT capacity
contributes into **one logical URP**; FATE is the only legal crossing.

## Docs

**System roots (always supreme — live under Dema checkout):**
`themassage.pdf` · `bizra.pdf` · `BIZRA_Third_Fact_v0_1_FINAL.pdf`  
Digest + hashes: `docs/SYSTEM_ROOT_REFERENCES.md`

- `docs/BIZRA_URP_System_Architecture_HLD_LLD_Technical_Spec_Master_v1.1.docx` — normative target
- `docs/BIZRA_URP_NORTH_STAR_MANIFEST_PRODUCT_SPEC_v0.md` — readable §§0–59 north-star (target, not deployment proof)
- `docs/BIZRA_URP_NORTH_STAR_BINDING_v0.md` — DOD/invariant distance vs local preview
- `docs/BIZRA_URP_v1.1_SYSTEM_PEAK_DOC_MAPTREE.md` — section ↔ live-binding map
- `docs/ECOSYSTEM_MAP_AND_HEALTH.md` — cross-repo scan + health receipt
- `docs/SEASON_PEAK_SYNTHESIS.md` — proof-bound peak v2 (SNR · linchpin · razor · C-005 tip)
- `docs/MISSION_LOOP_HARNESS_BINDING_v0.md` — mission-loop/harness bind (no new organs)
- `src/lib/dema/invoke-loop.ts` — ultra-micro Third Fact `invoke()` (preview only)
- `src/lib/urp/micro-hgraph.ts` — local canon hypergraph retrieve (not hosted RAG)
- `npm run invoke:check` — fail-closed self-harness
- `npm run estate:orient` — current read-only bindings to Dema, Home, lake, Node0 UI, and the Node0 campaign

## Local estate orientation

Run `npm run estate:orient` for a readable report, or
`npm run --silent estate:orient -- --json` for structured output. This host-only
engineering command reads the existing owners on this machine; it is separate
from the browser's historical ecosystem display. It creates no mission store.

Dema supplies root-canon verification, its qualified return situation, and URP
discovery semantics. The crossing ledger supplies recorded pending work. The
active pointer must match the existing campaign's identity, directive, current
state hash, receipt hash, and update order. Missing bindings exit 3; drift exits
4. Exit 0 means the observation completed, including an honest STOP or an
ambiguous saved season. It grants no consent and dispatches nothing.

Git identity and selected source bytes do not establish runtime health. The
command reports other-repository tests as NOT_RUN and runtime status as UNKNOWN.
Raw private season records are withheld. Use `DEMA_HOME` to explicitly select a
local store; an absent store remains absent. No models, network, signing, shared
URP publication, launcher changes, or receipt issuance occur.

The current pointer adapter binds the existing `pointer_reconciliation_2026_09_30`
schema. A replacement owner schema holds until this adapter is explicitly updated.

## Develop

```bash
npm install
npm test
npm run typecheck
npm run dev
```

Auth and database stay **off** unless explicitly enabled (`.grok/app-env.json`).

## Truth labels

- Face kernel: `PREVIEW_ONLY` (`bizra.dema.face_turn.v0.1`)
- Dema companion face-turn (other repo): `bizra.dema.dema_face_turn_preview.v0.1` — **not the same schema**
- Estate pointer (`/data/bizra/ACTIVE_MISSION.json`): STOP after D2 — no federation without new authority
