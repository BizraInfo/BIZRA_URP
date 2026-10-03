# BIZRA Shared URP: Node0-to-1,000,000-Node Emulation v1

**Truth label:** EMULATED — deterministic Monte Carlo architecture model, not measured BIZRA network performance.

## Executive signal

- One million admitted nodes create **7,000,000 local PAT role identities** and **5,000,000 SAT identities in shared URP inventory** by architecture arithmetic.
- The five SAT identities created by one node remain one origin for independence analysis; the maximum origin-diverse verifier pool is bounded by admitted node origins, not SAT identity count.
- Under the base assumptions, the shared resource plane exposes approximately **575.05k effective CPU cores**, **3.58k modeled H100-equivalent units**, and **30.69 PB** durable offered storage.
- The base modeled accelerator pool is **17.9%** of AWS's published 20,000-GPU UltraCluster scale anchor for independent compatible workloads; it is not equivalent for tightly coupled training.
- At one shared task per active node every ten minutes, base control/result traffic is only **1.14 Gbps**, while moving 100 MB of raw data per task would require **454.7 Gbps**. This makes compute-to-data and compact proof envelopes architectural necessities.

## Evidence boundary

- Real BIZRA node telemetry: unavailable.
- Hardware mix, availability, opt-in, compatibility, verification overhead, and scheduler efficiency: explicit DESIGN assumptions.
- Monte Carlo results: EMULATED with fixed seed and 500 runs per scale/scenario.
- Centralized reference: AWS P5/P5e UltraCluster vendor specifications; no claim of independent reproduction.
- Distributed precedent: Folding@home demonstrates that volunteer networks can reach very large aggregate compute for highly parallel workloads, while published literature emphasizes network and task-partition constraints.

## Architecture cardinality

| Nodes | Local PAT identities | SAT identities in URP inventory | Maximum independent node origins |
|---:|---:|---:|---:|
| 1 | 7 | 5 | 1 |
| 10 | 70 | 50 | 10 |
| 100 | 700 | 500 | 100 |
| 1,000 | 7,000 | 5,000 | 1,000 |
| 10,000 | 70,000 | 50,000 | 10,000 |
| 100,000 | 700,000 | 500,000 | 100,000 |
| 1,000,000 | 7,000,000 | 5,000,000 | 1,000,000 |

## One-million-node scenario results

| Scenario | Active contributing nodes | Effective CPU cores | Modeled H100-eq | Durable storage | Offered upload | Relative to 20k-GPU anchor |
|---|---:|---:|---:|---:|---:|---:|
| Conservative | 122,508 | 110,368 | 687 | 10.41 PB | 1.23 Tbps | 3.4% |
| Base | 341,028 | 575,048 | 3,578 | 30.69 PB | 3.41 Tbps | 17.9% |
| Optimistic | 600,020 | 1,388,060 | 8,634 | 57.00 PB | 6.00 Tbps | 43.2% |

## Base scenario scaling curve

| Nodes | Active contributors | Effective CPU cores | Modeled H100-eq | Durable storage | SAT service identities available |
|---:|---:|---:|---:|---:|---:|
| 1 | 0.3 | 0.6 | 0.00 | 0.0000 PB | 0.9 |
| 10 | 3.4 | 5.7 | 0.03 | 0.0003 PB | 8.5 |
| 100 | 34.3 | 57.3 | 0.34 | 0.0030 PB | 85.8 |
| 1,000 | 342.6 | 577.8 | 3.61 | 0.0309 PB | 856.4 |
| 10,000 | 3,409.4 | 5,748.7 | 35.77 | 0.3069 PB | 8,523.5 |
| 100,000 | 34,099.6 | 57,494.1 | 357.41 | 3.0682 PB | 85,249.1 |
| 1,000,000 | 341,027.9 | 575,048.2 | 3,577.53 | 30.6946 PB | 852,569.8 |

## Real-world workload comparison

Scores are EMULATED suitability scores from 1 (poor) to 10 (excellent), not benchmarks.

| Workload | BIZRA at 1M | Centralized cluster | Verdict |
|---|---:|---:|---|
| Private personal inference and local memory | 9 | 6 | BIZRA structural advantage |
| Embarrassingly parallel batch jobs | 8 | 9 | Centralized structural advantage |
| Tightly coupled foundation-model training | 2 | 10 | Centralized structural advantage |
| Origin-diverse verification and evidence review | 9 | 5 | BIZRA structural advantage |
| Deterministic low-tail-latency online service | 5 | 9 | Centralized structural advantage |
| Operation during shared-network outage | 9 | 3 | BIZRA structural advantage |

### Interpretation

1. **BIZRA wins where work is local, privacy-sensitive, asynchronous, independently partitionable, or benefits from origin diversity.**
2. **Centralized systems win where the workload needs uniform accelerators, tightly coupled collective communication, deterministic tail latency, or very large shared memory.**
3. **BIZRA should not imitate a hyperscale training cluster.** Its strongest design is a sovereign edge intelligence network with brokered asynchronous compute, compute-to-data execution, proof routing, and diverse verification.
4. **The shared URP entry plane is the common-mode bottleneck.** One logical endpoint must be implemented as replicated regional gateways, otherwise the no-P2P rule creates a network-wide single point of failure and bandwidth choke point.

## Rarely fired circuits

- Five SAT identities per node can create the appearance of five independent verifiers even though they share one origin; committee selection must deduplicate by node/root authority.
- A million nodes can advertise multiple terabits per second of aggregate upload, but broker ingress, egress, abuse controls, and proof storage can become more expensive than compute.
- Raw-data routing destroys the advantage; task capsules should carry code/model references, policy, hashes, and minimal inputs while execution moves toward local data.
- Node churn is tolerable for asynchronous tasks but harmful to long-running stateful jobs; checkpointing and lease-based scheduling are mandatory.
- Shared URP outage does not kill local nodes, but it halts shared scheduling, cross-origin verification, and network settlement; local and network finality must remain distinct.
- Heterogeneous hardware makes aggregate FLOPS misleading; every resource offer needs workload-specific calibration and a verified performance profile.

## Proof-of-Truth convergence

| Claim | Formal | Cryptographic | Empirical | Economic | Level |
|---|---|---|---|---|---:|
| 1M nodes produce 7M PAT and 5M SAT identities | Defined arithmetic | Not needed | Not observed | Not applicable | 1 |
| Shared URP can aggregate useful resources | Architecture specified | Receipts planned | EMULATED only | Settlement unproven | 1 |
| Shared URP outperforms centralized AI generally | Not defensible | None | Not measured | Not measured | 0 |
| Shared URP can outperform on selected asynchronous/privacy-local workloads | Bounded hypothesis | Planned | Requires physical pilots | Requires cost evidence | 1 |

## Peak logical next step

Build **URP-SCALE-HARNESS-1A**, first as a deterministic discrete-event emulator, then replace assumptions with telemetry from 1, 3, 10, and 100 physical nodes.

Required harness modules:

```text
harness/urp_scale/
  node_population.py
  hardware_profiles.py
  churn_model.py
  task_broker.py
  gateway_shards.py
  sat_committee.py
  proof_overhead.py
  economic_settlement.py
  centralized_baseline.py
  run_matrix.py
```

Acceptance gates: no direct P2P edge; local loop survives gateway loss; committee origins are distinct; every resource result has a signed receipt; simulated impact cannot mint; control-plane saturation is detected; raw-data tasks are rejected or converted to compute-to-data form; every metric is emitted with assumptions and confidence intervals.

## Sources used as external anchors

- Amazon EC2 P5 Instances: up to 20,000 H100/H200 GPUs in UltraClusters, up to 20 exaflops aggregate, up to 3,200 Gbps EFA per P5 class instance, and 900 GB/s NVSwitch inside an 8-GPU instance.
- NVIDIA H100 product page: H100 is designed for high-performance AI training/inference with high-speed scale-up interconnects.
- Folding@home literature: volunteer computing has demonstrated very large aggregate throughput for highly parallel scientific tasks, while task decomposition and network limits remain decisive.

## Receipt

- emulation id: URP-1M-EMULATION-V1
- seed: 20260711
- runs per scale/scenario: 500
- truth class: EMULATED
- public performance claim eligibility: NO
