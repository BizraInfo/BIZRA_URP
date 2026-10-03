# BIZRA ecosystem map & health receipt

**audit id:** `BIZRA-URP-ECOSYSTEM-HEALTH-2026-10-03`  
**recorded_utc:** 2026-10-03  
**authority_delta:** 0  
**truth_label:** `MEASURED_LOCAL_SCAN` — not federation readiness

## 1. Executive signal

1. **URP is the critical shared substrate** — one logical pool; Nodes do not peer-admin each other.
2. **This repo is healthy** as a preview kernel (`npm test` 0, `typecheck` 0).
3. **The estate is not fully healthy** — Dema activation `BLOCKED`; mission pointer says **STOP** after D2.
4. **Face schemas diverge** across Dema vs URP — do not treat payloads as interchangeable.
5. Completing “the network URP” is **OUTWARD / authority-blocked**. Completing this preview’s ecosystem binding is what this pass shipped.

## 2. Connected surfaces (local)

| Id | Path | GitHub | Observed health |
|---|---|---|---|
| URP | `…/BIZRA URP` | BizraInfo/BIZRA_URP | **healthy** — tests+typecheck green |
| Dema | `…/Downloads/Dema` | BizraInfo/Dema | **partial** — CLI Ready:false; face-turn 25/25 |
| bizra-home | `…/bizra-home` | BizraInfo/bizra-home | **partial** — ahead 7, dirty tree |
| data-lake | `/data/bizra/repos/bizra-data-lake` | BizraInfo/bizra-data-lake | **stale** — canon present; suite not re-run |
| Node0 UI | `…/BIZRA Node0/award-winner-design` | BizraInfo/award-winner-design | **partial** — present; not suite-tested |
| BIZRA-OS | `…/Downloads/BIZRA-OS` | BizraInfo/BIZRA-OS | **stale** — present |
| worktrees | `…/bizra-worktrees/*` | Dema slice sandboxes | historical; not trunk |

Also present under `/data/bizra/repos/`: `bizra-node0-genesis`, `bizra-filefactory`, `DEMA`, `BIZRA-Landing-page`, `speech-to-speech`, release copies of data-lake.

## 3. Cross-repo URP work (proven links)

| Link | Evidence |
|---|---|
| Dema `npm run urp:discovery` | `scripts/urp-shared-discovery.mjs` |
| Dema `artifacts/proofs/node0-local-urp/*` | `truth_label: URP_LOCAL_ACTIVE`, federation `not_implemented` |
| Dema face-turn preview | `packages/core/src/dema-face-turn-preview.js` schema `bizra.dema.dema_face_turn_preview.v0.1` |
| URP Face | `src/lib/dema/face.ts` schema `bizra.dema.face_turn.v0.1` |
| Data-lake topology | `TOPOLOGY_CANON.md` — PAT local, one shared URP |
| ACTIVE_MISSION | `urp_commons_ownership_law` recorded; **not canon** until docs/claims adoption |
| Mission STOP | `next_safe_action` forbids Node1 / federation / economy without new GO |

## 4. Health matrix (this pass)

| Probe | Result |
|---|---|
| URP `npm test` | pass (75 src + 197 scripts) |
| URP `npm run typecheck` | pass |
| Dema `status` | Ready:false · Activation gate BLOCKED |
| Dema face-turn tests | 25/25 pass |
| Dema face-turn review check | ok:true |
| bizra-home full suite | **not run** (dirty/ahead; out of URP authority envelope) |
| data-lake pytest | **not run** |
| Live URP network | **absent** |

## 5. What “complete the building” means under STOP

**In scope (done this pass):** ecosystem section in the URP preview, README, this receipt, v1.1 maptree already pinned.

**Out of scope without new GO:** shared URP services (§61+), federation, Node1, PoI minting, Dema activation, merging bizra-home, remote mission qualification.

## 6. Spearpoint deferred

Unify or explicitly bridge Face schemas (`face_turn.v0.1` ↔ `dema_face_turn_preview.v0.1`) under a Dema+URP dual-repo GO — not started.

## 7. Receipt hashes

| Artifact | Notes |
|---|---|
| Canon docx v1.1 | sha256 `49877b34f117b419dd7131e818f8725ccbc3a901b272f5167e79101dc480bd82` |
| ACTIVE_MISSION | status `…STOP_AFTER_D2__AWAITING_NEW_AUTHORITY` · remote_main `7115683539c905cf40d76fc90e8f49d472c9fa03` |
| URP HEAD at prior push | `351d9ad7b9baa1297f2b59265772c5ef3b87673d` (pre-ecosystem UI) |
