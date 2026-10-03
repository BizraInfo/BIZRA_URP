# BIZRA Universal Resource Pool — Final Architecture V3

**Artifact:** BIZRA-URP-ARCH-V3
**Date:** 2026-09-24 GST
**Status:** PROPOSED CONVERGENCE SPEC — architecture target, not runtime proof
**Authority:** subordinate to the BIZRA Three-Root Canon, `BIZRA_TOPOLOGY_CANON.md`, accepted ADRs, FATE/consent law, and measured runtime truth.

---

## 0. Executive architecture

BIZRA URP V3 resolves the historical ambiguity between a per-human “URP organism” and the current canonical topology.

### Canonical sentence

> **Each human is one sovereign Node. PAT-7 is local and serves that human. Each Node contributes SAT-5 logical system identities/capacity into one shared Universal Resource Pool. SAT serves system integrity. The constitutional membrane/FATE gate is the only legal crossing.**

### Physical realization

“One shared URP” is a **logical-system invariant**, not a requirement for one server, process, database, region, or operator machine. V3 implements the shared URP as a fault-tolerant distributed substrate with ingress gateways, registry partitions, schedulers, receipt/transparency shards, SAT worker pools, knowledge services, and checkpoint authorities. Physical components may communicate internally; sovereign Nodes may not address one another directly.

### The key scaling correction

At 1,000,000 humans, BIZRA canon implies:

- 7,000,000 PAT logical agents, resident with their humans;
- 5,000,000 SAT logical identities/capacity contributions in the shared system;
- **not** 5,000,000 continuously resident frontier-model processes.

SAT identity, constitutional responsibility, scheduler capacity, and process residency are separate concepts. Workers activate elastically, execute a bounded task under an attributable SAT identity/policy, emit a receipt/attestation, and release resources.

---

## 1. Evidence convergence

### 1.1 Current authoritative topology

The live `BizraInfo/Dema` canon states:

- one shared URP;
- PAT local per human;
- SAT in shared URP;
- membrane between PAT and SAT;
- human never accesses network directly;
- no PAT direct node-to-node route;
- second device remains the same human Node.

This V3 preserves those invariants.

### 1.2 Historical architecture correction

`URP_ARCHITECTURE_v2.md` models one self-contained URP per human and places SAT locally. That model is retained as historical reasoning but is **SUPERSEDED FOR TOPOLOGY** by current canon.

`bizra-urp-blocktree(1).html` is substantially aligned with V3 because it places PAT on sovereign Nodes, SAT in the URP, forbids direct peer-to-peer node semantics, and distinguishes single-parent BlockTree lineage from typed multi-parent BlockGraph influence.

### 1.3 Current implementation boundary

The current Dema repo contains substantial local URP/receipt/preview primitives, but current repo documents still classify the **shared URP runtime and multi-node federation as DESIGNED_NOT_LIVE / PLANNED**. Any implementation plan in this document therefore begins from that boundary.

### 1.4 1M emulation boundary

`packages/core/src/loop-emulator.js` is a deterministic design emulator. Its `global_1m` mode samples 1,000 nodes and extrapolates to 1,000,000, with `truth_basis: DERIVED_EXTRAPOLATION` and `truth_label: DESIGN_EMULATION_NOT_RUNTIME_RECEIPT`. It explicitly performs no runtime execution, no federation, no receipt mint, and no state mutation.

V3 uses that emulator as a **scenario generator and bottleneck detector**, never as proof that the network exists.

---

## 2. Constitutional invariants

These are non-negotiable design constraints. Any implementation that violates them is not a conforming URP implementation.

### I1 — Human sovereignty

A human owns/controls their local PAT, private data, device resources, and consent decisions. Joining BIZRA never creates an implied right to private data or resources.

### I2 — Separation of powers

PAT serves the human. SAT serves system integrity. PAT may propose/build; SAT may validate/certify within its lawful scope; FATE/authority gates effects. Neither side can silently inherit the other's authority.

### I3 — No capability self-authorization

A model, agent, skill, capability, scheduler, or verifier cannot create a new human authority grant for itself. Delegation may only attenuate an existing grant and can never widen it.

### I4 — Membrane-only crossing

All local-to-shared crossings are mediated by a policy-bound membrane that performs identity/pseudonym checks, consent/authority checks, privacy classification, schema verification, replay checks, quota/rate checks, and receipt creation.

### I5 — No direct node control channel

No Node may expose or consume an application/control route addressed directly to another sovereign Node. Cross-node benefit is mediated by URP contracts and pseudonymous routing.

### I6 — Claim discipline

Every consequential claim carries an evidence/truth class. Architecture cannot turn `PROPOSED`, `DERIVED`, or `DESIGNED_NOT_LIVE` into `MEASURED` by wording.

### I7 — Receipted consequential effects

Consequential effects and every membrane crossing produce tamper-evident evidence. Verification must be possible independently of the producer process.

### I8 — Privacy by minimum disclosure

Raw private content remains local unless a human has authorized its disclosure. Prefer hashes, derived claims, redacted artifacts, capability proofs, and result commitments over raw payload transport.

### I9 — Revocability and boundedness

Grants, leases, resource offers, keys, trust relationships, and shared wisdom must support expiration/revocation or have an explicit immutable reason.

### I10 — Economic quarantine

Execution success and verified contribution do not automatically imply impact or reward eligibility. PoI and economic settlement require separate evidence and governance gates.

---

## 3. System context

```text
Human
  |
  v
DEMA — one visible face
  |
  v
PAT-7 — local / private / human-loyal
  |
  | MissionEnvelope + AuthorityProof + minimal disclosed data
  v
+--------------------------------------------------------------+
| Constitutional Membrane / FATE Crossing                      |
| schema | authority | privacy | replay | policy | quotas | ID |
+--------------------------------------------------------------+
  |
  v
==================== ONE LOGICAL URP ============================
|                                                              |
|  Ingress + Node Registry + Authority/Revocation Registry     |
|  Resource Directory + Fair Scheduler + Resource Leases       |
|  SAT Logical Registry + Ephemeral SAT Worker Pools           |
|  Receipt/Transparency Shards + Epoch Checkpoint Service      |
|  UKE/House of Wisdom (governed shared knowledge)             |
|  Shared Reflex/Skill Metadata                                |
|  PoI Shadow Ledger -> future gated settlement                |
|  Telemetry/Operations/Security                               |
|                                                              |
================================================================
  |
  v
Membrane -> PAT -> DEMA -> Human
```

The physical URP may span many machines and regions. Its identity and policy surface remain singular.

---

## 4. Logical components

### 4.1 DEMA

Responsibilities:

- present human intent and system state;
- turn ambiguous intent into a Mission draft;
- show proposed authority/effects before consent;
- surface refusals and missing authority as first-class outcomes;
- never claim SAT/system authority;
- display proof references, not hide them.

### 4.2 PAT-7

PAT remains a local think tank/execution team. A conforming implementation may map logical PAT roles to one or many models/processes, but role identity must remain distinguishable from process topology.

PAT responsibilities:

- local planning/research/coding/evaluation/building/publishing/integration per current canon;
- minimize disclosure before a URP request;
- prepare typed mission requirements;
- use local resources first when policy/quality permits;
- handle reversible local work within authority;
- consume verified results and translate them for the human.

### 4.3 Constitutional Membrane / FATE Crossing

The membrane is a deterministic policy pipeline. Recommended order:

1. decode + schema/version validation;
2. canonicalization check;
3. issuer/workload identity verification;
4. nonce/sequence/expiry replay check;
5. policy/canon version binding;
6. authority grant/lease verification;
7. requested effect classification;
8. data/privacy class validation and disclosure minimization;
9. capability and resource constraints;
10. rate/quota/fairness admission pre-check;
11. SAT/verifier requirement derivation;
12. admit, reject, or require fresh human authority;
13. produce boundary decision evidence.

A rejected crossing is a valid product outcome and should be observable/receipted when consequential.

### 4.4 Node Registry

Stores only what the shared system needs:

- pseudonymous `node_id` / ordinal binding;
- public verification keys / key references;
- trust state and revocation state;
- capability manifest hash;
- resource contribution policy references;
- home ingress/shard placement metadata;
- policy/canon compatibility versions;
- companion-device attestations where required.

It must not require legal name, raw device inventory, or private local corpus.

### 4.5 Authority Registry

Tracks:

- human authority grants;
- bounded `AuthorityLease` objects;
- revocations;
- protected effect classes that always require fresh consent;
- consumed budgets/attempts;
- lease parent/attenuation chain.

The registry is safety-critical and strongly consistent within its ownership domain.

### 4.6 Resource Directory

Maintains current offers and capabilities, not ownership transfer.

Resource types:

- CPU;
- GPU/NPU/accelerator;
- memory;
- storage;
- bandwidth/relay;
- model-serving capacity;
- trusted execution/attestation capability;
- specialist skill/capability endpoint;
- verified knowledge shard.

Offers are opt-in, revocable, time-bounded, and privacy-classed.

### 4.7 Scheduler

The scheduler performs policy-aware matching, not ownership decisions.

Selection dimensions:

- authority and allowed effects;
- resource type/capacity;
- data locality/privacy requirement;
- latency/deadline;
- model/tool capability;
- trust/attestation class;
- cost/budget;
- energy/carbon preference if policy chooses;
- regional/legal policy constraints where applicable;
- fairness share / recent usage;
- reliability history;
- verifier independence constraints.

Admission uses backpressure; an overloaded URP should queue/reject honestly rather than silently degrade guarantees.

### 4.8 SAT logical registry and worker pools

The SAT registry represents canonical system roles and contribution lineage. It does not imply process residency.

A SAT execution binding should include:

- `sat_identity_id`;
- canonical role + role version;
- contributing Node pseudonym/lineage, where appropriate and privacy-safe;
- policy hash;
- worker workload identity;
- model/runtime version;
- task hash;
- independence group / conflict-of-interest tags;
- attestation/result hash.

High-risk verification should require independence constraints so the actor that produced an output cannot be its sole certifier.

### 4.9 Receipt Transparency Service

Treat BIZRA receipts as signed statements plus independently verifiable registration/inclusion evidence.

A receipt service SHOULD:

- verify issuer signature and protected metadata;
- apply explicit registration policy;
- append the signed statement to a verifiable data structure;
- issue an inclusion receipt/proof;
- support consistency checking between checkpoints;
- allow offline verification;
- support payload-by-hash for private/large content.

This pattern is directly aligned with modern transparency architectures such as SCITT without requiring BIZRA to copy their exact wire format.

### 4.10 UKE / House of Wisdom

UKE is shared verified knowledge, not an upload bucket. Shared artifacts enter through a lifecycle and evidence challenge process. Recommended lifecycle:

```text
OBSERVED
  -> CANDIDATE
  -> CHALLENGED
  -> SUPPORTED
  -> ADMITTED
  -> ACTIVE
  -> SUSPENDED
  -> SUPERSEDED | REVOKED
```

No model output can jump directly to ACTIVE shared wisdom.

### 4.11 PoI shadow ledger

The first implementation has **zero settlement authority**. It records:

- contribution evidence;
- independent attestations;
- impact hypotheses/scores;
- anti-gaming flags;
- counterfactual eligibility.

Only after separate governance, legal/Shariah, anti-collusion, and economic DoD gates may any score affect SEED/BLOOM or external value.

---

## 5. Core contract model

All IDs below are examples of namespaces, not mandated literal encodings.

### 5.1 NodePassport

Required semantic fields:

```text
schema
schema_version
node_id                 pseudonymous
node_ordinal
primary_or_companion
primary_node_id?        if companion
public_key_refs[]
capability_manifest_hash
canon_version
policy_compatibility[]
created_at
status                   LOCAL_ACTIVE | URP_REGISTERED | SUSPENDED | REVOKED
issuer
signature
```

### 5.2 AuthorityLease

```text
lease_id
human_grant_id
node_id
subject                  PAT/capability/campaign
allowed_effects[]
forbidden_effects[]
resource_budgets
path_or_object_scopes[]
network_endpoint_scopes[]
data_classes[]
valid_from / expires_at
max_attempts
max_parallelism
max_external_cost
parent_lease_id?
revocation_epoch
nonce
policy_hash
canon_hash
human_consent_receipt_hash
signature
```

A child lease MUST be an attenuation: every permission and budget is equal to or narrower than its parent.

### 5.3 MissionEnvelope

```text
mission_id
node_id
intent_hash
objective
success_criteria[]
required_capabilities[]
required_resources[]
data_disclosure_manifest
risk_class
requested_effects[]
authority_lease_id
policy_hash
canon_hash
created_at
expires_at
trace_id
signature
```

### 5.4 ResourceOffer

```text
offer_id
node_id_pseudonym
resource_type
capacity
resource_attributes
privacy_class
allowed_workloads[]
prohibited_workloads[]
attestation_class
region_or_locality_class
availability_window
lease_ttl_max
rate_or_shadow_cost?     non-economic until authorized
consent_receipt_hash
expires_at
signature
```

### 5.5 ResourceLease

```text
resource_lease_id
offer_id
mission_id
allocated_capacity
start_at
expires_at
exclusive_keys[]
worker_identity
scheduler_policy_hash
fencing_token
state
signature
```

`fencing_token` is monotonic within the resource authority domain to prevent stale workers from acting after reassignment.

### 5.6 ExecutionReceipt

```text
receipt_id
stream_id
sequence
prev_receipt_hash
mission_id
authority_lease_id
resource_lease_id?
issuer_identity
subject_hash
input_commitments[]
output_commitments[]
effect_class
effect_summary
truth_label
evidence_class
policy_hash
canon_hash
runtime_measurements
started_at
ended_at
nonce
hash_alg
sig_alg
key_id
signature
transparency_registration?  // inclusion proof/reference
```

### 5.7 VerifierAttestation

```text
attestation_id
receipt_id | subject_hash
sat_identity_id
verifier_workload_id
verifier_policy_hash
independence_group
checks[]
verdict                    PASS | FAIL | CHALLENGE | UNKNOWN
reason_codes[]
evidence_hashes[]
issued_at
signature
```

### 5.8 EpochCheckpoint

```text
checkpoint_id
epoch
previous_checkpoint_hash
shard_roots[]
canon_hash
policy_set_hash
revocation_root
key_set_hash
node_registry_root
resource_lease_root?
wisdom_root?
poi_shadow_root?
created_at
quorum_attestations[]
signature_set
```

---

## 6. State machines

### 6.1 Node

```text
UNREGISTERED
  -> LOCAL_ACTIVE
  -> URP_REGISTRATION_PENDING
  -> URP_REGISTERED
  -> DRAINING
  -> LOCAL_ACTIVE | SUSPENDED | REVOKED
```

No state transition may delete local human ownership.

### 6.2 AuthorityLease

```text
DRAFT
  -> AWAITING_HUMAN_CONSENT
  -> ACTIVE
  -> EXHAUSTED | EXPIRED | REVOKED
```

`ACTIVE -> ACTIVE` may update only consumed counters, never widen authority.

### 6.3 Mission

```text
DRAFT
 -> VALIDATED
 -> AUTHORITY_REQUIRED | AUTHORIZED
 -> QUEUED
 -> RESOURCE_LEASED
 -> RUNNING
 -> VERIFYING
 -> COMMITTED
 -> IMPACT_CANDIDATE
```

Terminal/alternate states:

```text
REJECTED | REFUSED | CANCELLED | FAILED | QUARANTINED | EXPIRED
```

### 6.4 ResourceOffer

```text
DRAFT
 -> CONSENTED
 -> ADVERTISED
 -> PARTIALLY_LEASED | LEASED
 -> RELEASED
 -> ADVERTISED | RETIRED | REVOKED | EXPIRED
```

### 6.5 Receipt registration

```text
CREATED
 -> SIGNATURE_VALIDATED
 -> POLICY_VALIDATED
 -> APPENDED
 -> INCLUSION_PROVEN
 -> CHECKPOINTED
```

Any invalid stage goes to `REJECTED`; no “best effort” append of invalid receipts.

---

## 7. Authority model at scale

The current emulator exposes the central human-attention problem: if every consequential micro-step requires an independent approval, approval pressure grows faster than human capacity.

V3 therefore proposes a two-level mechanism while preserving sovereignty:

### 7.1 HumanGrant

A direct, explicit human authorization for a clearly described campaign or effect.

### 7.2 AuthorityLease

A machine-checkable attenuation of the HumanGrant. It can cover a bounded set of already-understood reversible steps.

Example:

```text
Human: GO run URP conformance campaign on this worktree for 30 minutes;
       read only except write under /tmp/urp-audit;
       no network, no push, no service restart, no keys, no economy.
```

The compiled lease carries those boundaries. A worker may perform hundreds of reads/tests under it without asking again. Attempting `git push`, touching a key, using network, or writing outside `/tmp/urp-audit` fails closed and returns control to the human.

### 7.3 Effects that always require fresh authority

At minimum:

- new federation relationship;
- public publication/deployment;
- key creation/export/rotation that changes authority;
- financial/economic settlement;
- token mint/burn/transfer;
- canon/constitution modification;
- identity/ordinal reassignment;
- destructive data deletion outside an already-approved reversible sandbox;
- widening privacy disclosure;
- irreversible external API side effects;
- changing an authority policy itself.

This mechanism must be adopted by ADR before it is authoritative.

---

## 8. Resource scheduling architecture

### 8.1 Hierarchy

```text
Global Logical URP Directory
       |
       +-- Region/Sharding Group A
       |      +-- Scheduler A1
       |      +-- Scheduler A2
       |
       +-- Region/Sharding Group B
       |      +-- Scheduler B1
       |
       +-- Local/Edge resource adapters
```

The global layer should answer **where can this class of work be admitted?** It should not serially schedule every GPU timeslice.

### 8.2 Fairness

Use a weighted historical-share model:

- every tenant/Node has nominal share and policy weight;
- unused quota can be lent within bounded cohorts;
- borrowing has limits;
- heavy recent borrowers lose priority relative to under-served peers;
- high-priority safety/system work can preempt only under explicit policies;
- repeated preemption is bounded to avoid thrash.

### 8.3 Backpressure

Queues expose:

- pending count;
- age percentiles;
- resource deficit reason;
- authority deficit reason;
- verifier deficit reason;
- privacy/locality mismatch;
- predicted start window.

No fake “accepted” status when work has not acquired a valid lease.

---

## 9. Receipt, BlockTree, BlockGraph, and checkpoint design

### 9.1 Why not global-consensus every receipt

Planetary mission/event volume is incompatible with a design that requires every node to agree on every receipt synchronously. Global serialization would turn proof into the bottleneck.

### 9.2 Local/shard receipt streams

Each authority domain maintains ordered streams. Ordering is explicit through `stream_id`, `sequence`, and `prev_receipt_hash`.

### 9.3 BlockTree

The tree answers **ancestry**.

Rules:

- genesis has no lineage parent;
- every non-genesis lineage block has exactly one lineage parent;
- lineage parent hash is signed/committed;
- lineage cycles are invalid.

### 9.4 BlockGraph

The graph answers **relationship/influence**. Cross-links are typed and may be many-to-many:

- verification;
- challenge;
- adoption;
- dependency;
- supersession;
- impact;
- knowledge derivation.

A cross-link can never change lineage semantics.

### 9.5 Epoch checkpoint

Shard receipts are accumulated into Merkle/VDS roots. Periodically, a checkpoint commits roots and authority context. The checkpoint is the bounded global coordination object.

This creates a clean proof hierarchy:

```text
Effect
 -> ExecutionReceipt
 -> Stream/Shard inclusion
 -> Shard root
 -> EpochCheckpoint
 -> BlockTree lineage + BlockGraph attestations
```

### 9.6 Transparency semantics

A receipt proves that a signed statement was registered under a policy and included in a verifiable structure. It does **not** by itself prove the issuer was honest or that the result was socially beneficial. That distinction is why BIZRA keeps execution receipt, verifier attestation, wisdom admission, and PoI impact as separate objects.

---

## 10. Identity and trust model

### 10.1 Separate namespaces

Never collapse:

- human identity;
- node pseudonymous identity;
- node ordinal;
- companion device identity;
- signing-key identity;
- workload/process identity;
- SAT logical identity;
- organization/operator identity.

### 10.2 Workload identity

Use short-lived workload credentials for URP services/workers. Trust-domain isolation should resemble SPIFFE semantics: identities are qualified by a trust domain; bundles/roots remain bound to that domain; cross-domain trust is explicit and revocable.

### 10.3 Pseudonymity

Receipts visible to shared infrastructure should carry only the identity needed for verification/attribution. Legal/human identity mapping, if ever required, belongs in a separately governed disclosure system, not the default receipt path.

---

## 11. Serialization and cryptography

### 11.1 Canonicalization

For JSON objects used in hashing/signing, use a single deterministic profile such as RFC 8785 JCS. Reject non-conforming inputs before signing rather than allowing different producers to hash semantically equivalent but byte-different JSON.

For high-rate compact wire/storage, deterministic CBOR per RFC 8949 is recommended.

### 11.2 Hash domains

Every hash operation must include an unambiguous domain separator, for example:

```text
BIZRA:URP:RECEIPT:v1\0<canonical-bytes>
BIZRA:URP:CHECKPOINT:v1\0<canonical-bytes>
BIZRA:URP:MISSION:v1\0<canonical-bytes>
```

### 11.3 Algorithm agility

Objects carry algorithms and key IDs. Verification policy says what is acceptable; producers do not decide acceptance merely by naming an algorithm.

### 11.4 Key protection

Prefer platform TPM/secure enclave/HSM/OS keystore where available. Exportable raw private keys should be exceptional and separately authorized. Rotation, overlap, and revocation are first-class tested flows.

---

## 12. Protocol surfaces

### 12.1 Node-local API

Recommended logical API (transport independent):

```text
POST /v1/missions
GET  /v1/missions/{id}
POST /v1/authority/leases
POST /v1/authority/leases/{id}/revoke
POST /v1/resources/offers
DELETE /v1/resources/offers/{id}
GET  /v1/receipts/{id}
POST /v1/receipts/verify
GET  /v1/checkpoints/{epoch}
```

### 12.2 URP internal service API

```text
POST /v1/admission/evaluate
POST /v1/scheduler/lease
POST /v1/sat/verify
POST /v1/transparency/register
POST /v1/transparency/prove
POST /v1/wisdom/candidates
POST /v1/wisdom/{id}/challenge
POST /v1/poi/shadow/evaluate
```

### 12.3 Event catalog

```text
node.registered
node.suspended
node.revoked
authority.lease.activated
authority.lease.revoked
resource.offer.advertised
resource.offer.revoked
resource.lease.issued
resource.lease.released
mission.authorized
mission.queued
mission.started
mission.completed
mission.failed
receipt.registered
receipt.rejected
attestation.issued
checkpoint.sealed
wisdom.admitted
wisdom.suspended
impact.shadow_evaluated
```

Events are notifications; authoritative state must be read from the owning state machine and its receipts.

### 12.4 A2A / MCP adapters

A2A-like task interoperability and MCP tool connectivity belong at adapters, not inside constitutional core. An adapter can translate an external protocol into BIZRA Mission/Capability contracts, but cannot bypass authority, privacy, receipt, or FATE checks.

---

## 13. Consistency model

### Strong consistency required

- node ordinal allocation and revocation;
- authority grant/lease state;
- scarce/exclusive resource leases;
- key and trust revocation state;
- epoch checkpoint publication;
- economic settlement/impact eligibility if activated.

### Eventual consistency acceptable

- resource availability advertisements;
- non-authoritative health dashboards;
- telemetry;
- knowledge discovery indexes;
- cached capability metadata;
- cached receipt verification results;
- skill/reputation hints that do not themselves grant authority.

### Partition behavior

Safety-critical operations fail closed if the required authority/revocation view cannot be established. Read-only verification can remain available from locally cached checkpoints and trust material where freshness policy permits.

---

## 14. Security threat model

### Threats

1. forged/replayed mission or receipt;
2. compromised PAT attempting authority escalation;
3. compromised SAT worker or verifier collusion;
4. Sybil Nodes/resource inflation;
5. malicious ResourceOffer / poisoned worker;
6. prompt/artifact injection crossing into privileged tools;
7. privacy exfiltration through receipts/telemetry;
8. stale key / revoked identity use;
9. scheduler poisoning or fairness gaming;
10. double lease / stale worker race;
11. log/transparency equivocation;
12. supply-chain dependency compromise;
13. denial of service / queue starvation;
14. clock skew / partition / delayed revocation;
15. circular PoI attestation / self-dealing;
16. compromised operator credentials;
17. malicious canonicalization ambiguity;
18. public bridge overclaiming implementation state.

### Required controls

- signatures + canonical serialization;
- nonces/sequences/expiry;
- short-lived workload identity;
- revocation registry;
- fencing tokens for resource leases;
- least-privilege sandboxing;
- privacy classification and structured redaction;
- independent verifier diversity for high-risk acts;
- quarantine/challenge states;
- rate/quotas/fair-share;
- signed build/SBOM/provenance;
- transparency inclusion/consistency proofs;
- chaos and Byzantine/adversarial tests;
- policy version binding in every consequential receipt.

---

## 15. Observability without authority leakage

OpenTelemetry-style trace context should correlate:

```text
mission_id
trace_id/span_id
authority_lease_id
resource_lease_id
sat_identity_id
receipt_id
checkpoint_id
```

Rules:

- telemetry is not a receipt;
- logs must not contain raw private payload by default;
- identifiers exposed in metrics should be pseudonymous/low-cardinality where possible;
- all privileged debugging that increases disclosure requires explicit operator authority;
- security/audit evidence has retention policy distinct from application debug logs.

---

## 16. Reliability and recovery

### 16.1 Failure containment

A failed worker cannot own durable authority. Authority and ResourceLeases outlive processes and can be revoked/reassigned using fencing tokens.

### 16.2 Recovery sources

- last accepted EpochCheckpoint;
- append logs after checkpoint;
- authority/revocation state;
- key-set metadata;
- resource lease state;
- separately backed-up local sovereign state.

### 16.3 Recovery proof

Recovery is complete only when replay produces the same authoritative hashes/state roots for the same accepted input history.

---

## 17. Performance model

V3 refuses architecture numbers without benchmark evidence. Instead, it defines measurement contracts.

### Required SLI set

- ingress p50/p95/p99;
- admission p50/p95/p99;
- scheduler placements/sec;
- receipt registrations/sec;
- receipt verification/sec;
- checkpoint build/seal time;
- SAT worker cold/warm activation time;
- queue wait age percentiles;
- bytes/receipt;
- bytes/checkpoint;
- CPU/RAM/GPU per workload class;
- recovery RTO/RPO;
- cache hit ratio;
- refusal rate and reasons;
- privacy and authority violations.

### Benchmark receipt

Every benchmark must bind:

```text
repo_commit
scenario_hash
config_hash
hardware_manifest_hash
software_manifest_hash
seed(s)
start/end timestamp
warmup
sample size
raw result artifact hash
summary statistics
known invalidations
truth_label = MEASURED
```

---

## 18. 1M-node architecture

### 18.1 What scales linearly by doctrine

At one million sovereign humans:

- 1M Node identities;
- 7M PAT logical agents distributed across users;
- 5M contributed SAT logical identities/capacity records;
- large resource/knowledge/receipt surface.

### 18.2 What must not scale linearly in central residency

Do not allocate centrally:

- one permanent heavyweight process per SAT identity;
- one globally replicated full receipt log per worker;
- one consensus vote from every Node per mission;
- one human micro-consent per internal reversible step;
- one global lock per ResourceOffer update.

### 18.3 Hierarchical scaling pattern

```text
1M Nodes
  -> many ingress partitions
  -> regional admission/scheduling cohorts
  -> elastic SAT worker pools
  -> local/shard receipt streams
  -> epoch root aggregation
  -> bounded global checkpoints
```

### 18.4 Emulator upgrade

Refactor the current emulator so assumptions are input data:

```yaml
scenario: global_1m_v3
nodes_represented: 1000000
nodes_simulated: 1000
pat_per_node: 7
sat_identities_per_node: 5
sat_worker_residency_model: elastic
mission_mix: ...
authority_model: scoped_leases
receipt_encoding: jcs-json
checkpoint_interval_seconds: ...
resource_distribution: ...
churn: ...
adversary_rate: ...
```

Then calibrate distributions against measured 100/1,000-node tests.

---

## 19. Hidden high-signal findings from convergence

### G1 — The URP is a semantic singleton, not a physical singleton

This is the architecture move that reconciles sovereign topology with distributed-systems reality. The star diagram describes authority semantics, not cabling.

### G2 — SAT count is constitutional capacity, not process count

This removes a false scaling cliff without changing the “+5 SAT per human” law.

### G3 — Human attention is a scarce resource and must be scheduled constitutionally

The emulator's pending-GO pressure is not a UX nuisance; it is an architectural resource bottleneck. Authority leases turn consent into a typed budget without allowing agents to self-authorize.

### G4 — Receipts need two proofs

An issuer signature proves who made a statement; an inclusion/transparency proof establishes that the system registered it under a policy. Neither alone establishes truth/impact. This separation strengthens BIZRA's “receipt is proof” doctrine by making the exact proof claim explicit.

### G5 — BlockTree and BlockGraph should not carry all data

They should carry identity/lineage, commitments, typed attestations, and checkpoint roots. Heavy artifacts remain content-addressed off-structure under retention/privacy rules.

### G6 — Strong consistency is a scarce budget

Spend it on authority, scarce-resource leasing, revocation, and settlement. Do not spend it on telemetry, availability ads, or caches.

### G7 — Refusal throughput is a performance metric

A safe URP needs fast, explainable denial at scale. p99 refusal latency, reason-code stability, and no-side-effect rejection deserve the same engineering attention as successful mission throughput.

---

## 20. Known contradictions to close

1. **Per-human URP vs shared URP:** historical V2 vs current canon. Resolve by supersession metadata.
2. **SAT role names:** Topology Canon uses Validator/Oracle/Mediator/Archivist/Sentinel; `five-sat-urp-launch.js` prototype uses Guardian/Reasoner/Builder/Critic/Archivist. Resolve with one ADR + enum + migration.
3. **Prototype launch truth label:** code comments state “declaration only/no runtime,” while emitted label says “LAUNCHED_AND_LOCKED.” Fix to no-false-GREEN semantics.
4. **Receipt hash vocabulary:** BLAKE3 is canonical in topology prose while some local receipt-chain descriptions have used SHA-256. Either define separate hash domains intentionally or standardize.
5. **Performance superlatives/numbers:** claims such as sub-0.1ms governance or decreasing to 1ms at planetary scale require benchmark receipts or must be demoted to hypothesis.
6. **Emulator hard-coded hardware assumptions:** move to scenario configuration and sensitivity analysis.

---

## 21. Delivery phases

```text
P0 Canon Convergence
  -> P1 Pure Contracts/Crypto
  -> P2 Authority Lease + Local Scheduler
  -> P3 Receipt Transparency + BlockTree/Graph
  -> P4 Shared URP Single-Region Alpha
  -> P5 Node1 Pilot
  -> P6 100/1,000 Measured Load + Chaos
  -> P7 UKE Shared Wisdom
  -> P8 PoI Shadow Ledger
  -> P9 Multi-Region
  -> P10 1M-Calibrated Emulation
  -> P11 Independent Production Gate
```

Network opening is not allowed to leapfrog local proof or authority/receipt gates.

---

## 22. Final Definition of Architecture

A conforming BIZRA URP implementation is:

> **a logically singular, physically distributed, constitution-bound shared substrate that accepts only membrane-mediated, explicitly authorized requests from sovereign human Nodes; schedules opt-in resources fairly; activates system-loyal SAT verification capacity elastically; records consequential statements as independently verifiable receipts and batched checkpoints; compounds only challenged, provenance-bound wisdom; and keeps impact/economics powerless until separately proven and authorized.**

That formulation preserves the original BIZRA insight — **humans become infrastructure, not fuel** — while preventing scale from turning sovereignty into centralization or proof into a global bottleneck.

---

## 23. Proof status of this document

| Layer | Status |
|---|---|
| Topology alignment with current Dema canon | GROUNDED IN CURRENT REPO |
| Local preview/emulator observations | GROUNDED IN CURRENT REPO |
| Historical V2/BlockTree synthesis | GROUNDED IN SUPPLIED/LIBRARY ARTIFACTS |
| Physical sharding, authority leases, workload identity, transparency design | PROPOSED |
| Shared live URP runtime | DESIGNED_NOT_LIVE unless separately proven after this document |
| Node1 live federation | DESIGNED_NOT_LIVE |
| UKE shared runtime | DESIGNED_NOT_LIVE |
| PoI settlement/economy | DESIGNED_NOT_LIVE |
| 1M live deployment | NOT CLAIMED |

**No architecture document, including this one, grants execution authority.**
