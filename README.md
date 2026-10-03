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
- `docs/BIZRA_URP_v1.1_SYSTEM_PEAK_DOC_MAPTREE.md` — section ↔ live-binding map
- `docs/ECOSYSTEM_MAP_AND_HEALTH.md` — cross-repo scan + health receipt
- `docs/SEASON_PEAK_SYNTHESIS.md` — SNR gems vs noise + invoke() spearpoint
- `src/lib/dema/invoke-loop.ts` — ultra-micro Third Fact `invoke()` (preview only)

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
