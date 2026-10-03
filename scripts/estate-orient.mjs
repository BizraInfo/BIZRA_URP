#!/usr/bin/env node
// Read-only host orientation; no new mission store, consent authority, or receipt issuer.
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync, realpathSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, isAbsolute, relative, resolve, sep } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const ADAPTER = fileURLToPath(new URL("./estate-dema-read.mjs", import.meta.url));
export const SCHEMA = "bizra.urp.local_estate_orientation.v0.1";
export const DEMA_SOURCES = Object.freeze([
  "apps/cli/src/daily-return-situation.js",
  "apps/cli/src/first-look-season-resume.js",
  "apps/cli/src/commands/identity-root-gatherer.js",
  "scripts/verify-root-canon.mjs",
  "packages/core/src/dema-identity-root-canon.js",
  "packages/core/src/dema-return-situation.js",
  "packages/core/src/urp-shared-runtime-discovery.js",
  "packages/receipts/src/season-state-store.js",
]);
const BOUNDARY = Object.freeze({
  filesystem_written: false, runtime_invoked: false, model_invoked: false,
  network_used: false, consent_consumed: false, receipt_minted: false,
  federation_activated: false, authority_delta: 0,
});
const sha = (bytes) => createHash("sha256").update(bytes).digest("hex");
const record = (value) => value && typeof value === "object" && !Array.isArray(value);
const nonempty = (value) => typeof value === "string" && value.trim().length > 0;

export function defaultPaths() {
  const home = homedir();
  return {
    repositories: {
      urp: ROOT, dema: resolve(home, "Downloads/Dema"), home: resolve(home, "bizra-home"),
      lake: "/data/bizra/repos/bizra-data-lake",
      "node0-ui": resolve(home, "BIZRA Node0/award-winner-design"),
    },
    pointer: "/data/bizra/ACTIVE_MISSION.json",
    campaignRoot: resolve(home, "bizra-home/.campaigns/node0-genesis-final-sprint-1a"),
    demaHome: process.env.DEMA_HOME || resolve(home, ".dema"),
  };
}

function bind(path) {
  return { path: resolve(path), sha256: sha(readFileSync(path)) };
}

function readJson(path, bindings) {
  const bytes = readFileSync(path);
  bindings.push({ path: resolve(path), sha256: sha(bytes) });
  return JSON.parse(bytes.toString("utf8"));
}

function gitIdentity(path) {
  const git = (...args) => execFileSync("git", ["--no-optional-locks", "-c", "core.fsmonitor=false", "-C", path, ...args], {
    encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], timeout: 5000,
  });
  if (realpathSync(git("rev-parse", "--show-toplevel").trim()) !== realpathSync(path)) {
    throw new Error("repository_root_mismatch");
  }
  const status = git("status", "--porcelain=v1", "-z");
  // -z renames have two path records; count entries rather than path tokens.
  const entries = status.split("\0").filter(Boolean);
  let dirty = 0;
  for (let i = 0; i < entries.length; i++) {
    dirty++;
    if (/[RC]/.test(entries[i].slice(0, 2))) i++;
  }
  return {
    path: realpathSync(path), head: git("rev-parse", "HEAD").trim(),
    tree: git("rev-parse", "HEAD^{tree}").trim(),
    origin: git("remote", "get-url", "origin").trim(),
    dirty_entries: dirty, status_sha256: sha(status),
    tracked_diff_sha256: sha(git("diff", "--no-ext-diff", "--no-textconv", "--binary", "HEAD", "--")),
    test_status: "NOT_RUN", runtime_status: "UNKNOWN",
  };
}

function contained(root, path) {
  if (!nonempty(path) || isAbsolute(path)) throw new Error("unsafe_owner_relative_path");
  const full = resolve(root, path);
  const rel = relative(realpathSync(root), realpathSync(full));
  if (rel === ".." || rel.startsWith(`..${sep}`) || isAbsolute(rel)) {
    throw new Error("owner_path_escape");
  }
  return full;
}

export function crossingProjection(text, root, bindings) {
  const blocks = [...text.matchAll(/```json\s*\n([\s\S]*?)\n```/g)];
  if (blocks.length !== 1) throw new Error("crossing_ledger_ambiguous");
  const ledger = JSON.parse(blocks[0][1]);
  if (ledger.schema !== "bizra.crossing_ledger.v0.1" || !Array.isArray(ledger.crossings) ||
      ledger.crossings.length === 0) throw new Error("crossing_ledger_malformed");
  const ids = new Set();
  for (const crossing of ledger.crossings) {
    if (!record(crossing) || !/^C-\d{3}$/.test(crossing.id) || ids.has(crossing.id) ||
        !nonempty(crossing.title) || !nonempty(crossing.gate) ||
        !["CLOSED", "PENDING"].includes(crossing.status)) {
      throw new Error("crossing_ledger_malformed");
    }
    ids.add(crossing.id);
    if (crossing.status === "CLOSED") {
      const receipt = readJson(contained(root, crossing.receipt), bindings);
      if (receipt.schema !== "bizra.crossing_receipt.v0.1" || receipt.crossing_id !== crossing.id) {
        throw new Error("crossing_receipt_identity_mismatch");
      }
    }
  }
  const top = ledger.crossings.find((crossing) => crossing.status === "PENDING");
  return {
    recorded_closed: ledger.crossings.filter((c) => c.status === "CLOSED").map((c) => c.id),
    pending_count: ledger.crossings.filter((c) => c.status === "PENDING").length,
    top_pending: top ? { id: top.id, title: top.title, gate: top.gate } : null,
    gate_evaluated: false, consent_granted: false, closure_reverified: false,
  };
}

export function campaignProjection(pointer, campaign, campaignBinding, receipt) {
  const binding = pointer?.pointer_reconciliation_2026_09_30?.campaign_binding;
  // This is the current existing pointer schema, not a new authority registry.
  if (!record(binding) || !record(campaign) || !record(receipt) ||
      !nonempty(pointer.next_safe_action) || !nonempty(campaign.next_action) ||
      !nonempty(campaign.frontier) || !nonempty(campaign.current_receipt) ||
      !nonempty(campaign.campaign_id) || campaign.authority_delta !== 0) {
    throw new Error("campaign_binding_incomplete");
  }
  const pointerTime = Date.parse(pointer.updated_at_utc);
  const campaignTime = Date.parse(campaign.updated_at);
  if (!Number.isFinite(pointerTime) || !Number.isFinite(campaignTime) ||
      pointerTime < campaignTime || campaignTime > Date.now() || pointerTime > Date.now() ||
      resolve(binding.path) !== campaignBinding.path ||
      binding.campaign_state_sha256 !== `sha256:${campaignBinding.sha256}` ||
      binding.campaign_id !== campaign.campaign_id || pointer.mission_id !== campaign.campaign_id ||
      binding.frontier !== campaign.frontier || binding.next_frontier !== campaign.next_frontier ||
      binding.next_action !== campaign.next_action || pointer.next_safe_action !== campaign.next_action ||
      binding.current_receipt !== campaign.current_receipt || binding.authority_delta !== 0 ||
      binding.current_receipt_sha256 !== `sha256:${receipt.sha256}`) {
    throw new Error("pointer_campaign_drift");
  }
  return {
    campaign_id: campaign.campaign_id, recorded_frontier: campaign.frontier,
    recorded_next_action: campaign.next_action, updated_at: campaign.updated_at,
    pointer_updated_at: pointer.updated_at_utc, current_receipt: campaign.current_receipt,
    binding_status: "MATCHED_CURRENT_OWNER_BYTES", receipt_semantics_reverified: false,
    runtime_status: "UNKNOWN", authority_granted: false,
  };
}

function readDema(paths) {
  const out = execFileSync(process.execPath, [ADAPTER, paths.repositories.dema, paths.demaHome], {
    cwd: paths.repositories.dema, encoding: "utf8", timeout: 10000,
    maxBuffer: 1024 * 1024, stdio: ["ignore", "pipe", "pipe"],
  });
  return JSON.parse(out);
}

export function orientEstate({ paths = defaultPaths(), readDemaImpl = readDema } = {}) {
  const report = {
    schema: SCHEMA, truth_label: "LOCAL_READ_ONLY_ORIENTATION",
    observed_at: new Date().toISOString(), ok: false, exit_code: 3,
    dispatch_allowed: false, boundary: BOUNDARY, repositories: {}, bindings: [], errors: [],
    binding_scope: "listed owner files plus Git identities and tracked diffs; not all transitive dependencies",
    proof_ceiling: "Source and recorded-owner bindings only; no runtime health, independent SAT, mission closure, or shared URP activation",
  };
  try {
    for (const [id, path] of Object.entries(paths.repositories)) report.repositories[id] = gitIdentity(path);
    report.bindings.push(bind(fileURLToPath(import.meta.url)), bind(ADAPTER));
    const dema = paths.repositories.dema;
    report.bindings.push(...DEMA_SOURCES.map((path) => bind(contained(dema, path))));
    const ledgerPath = contained(dema, "docs/CROSSING_LEDGER.md");
    report.bindings.push(bind(ledgerPath));
    report.crossings = crossingProjection(readFileSync(ledgerPath, "utf8"), dema, report.bindings);
    report.bindings.push(bind(contained(paths.repositories.lake, "TOPOLOGY_CANON.md")));
    const pointer = readJson(paths.pointer, report.bindings);
    const campaignPath = contained(paths.campaignRoot, "campaign-state.json");
    const campaign = readJson(campaignPath, report.bindings);
    const campaignBinding = report.bindings.at(-1);
    const receiptPath = contained(paths.campaignRoot, campaign.current_receipt);
    report.bindings.push(bind(receiptPath));
    report.campaign = campaignProjection(pointer, campaign, campaignBinding, report.bindings.at(-1));
    const owners = readDemaImpl(paths);
    report.dema = owners;
    const returnEffects = ["executed", "mutated", "consent_consumed", "receipt_minted",
      "model_invoked", "provider_called", "dema_home_written"];
    if (owners?.roots?.ok !== true || owners.roots.report?.verified !== true ||
        owners.roots.report?.result !== "BIZRA_ROOT_CANON_SEALED" ||
        owners.shared_urp?.mode !== "DISCOVERY_ONLY" ||
        returnEffects.some((key) => owners.return_situation?.effects?.[key] !== false)) {
      throw new Error("dema_owner_verification_refused");
    }
    for (const before of report.bindings) {
      if (bind(before.path).sha256 !== before.sha256) throw new Error("owner_bytes_changed_during_observation");
    }
    for (const [id, path] of Object.entries(paths.repositories)) {
      if (JSON.stringify(gitIdentity(path)) !== JSON.stringify(report.repositories[id])) {
        throw new Error("repository_changed_during_observation");
      }
    }
    report.ok = true;
    report.exit_code = 0; // Observation completed; STOP directives remain STOP.
  } catch (error) {
    const reason = error.message || "orientation_failed";
    report.errors.push(reason);
    report.exit_code = /drift|changed_during_observation/.test(reason) ? 4 : 3;
  }
  return report;
}

export function main(argv = process.argv.slice(2), options = {}) {
  if (argv.some((arg) => !["--json", "--help"].includes(arg))) {
    console.error("Usage: npm run estate:orient -- [--json]");
    return 3;
  }
  if (argv.includes("--help")) {
    console.log("Read-only local estate orientation. Exit 0 = observation complete; 3 = missing/refused binding; 4 = drift. No dispatch.");
    return 0;
  }
  const report = orientEstate(options);
  if (argv.includes("--json")) console.log(JSON.stringify(report, null, 2));
  else {
    console.log(`${report.truth_label}: ${report.ok ? "observation complete" : "HELD"}`);
    for (const [id, repo] of Object.entries(report.repositories)) {
      console.log(`${id}: ${repo.head.slice(0, 12)}; dirty=${repo.dirty_entries}; runtime=UNKNOWN; tests=NOT_RUN`);
    }
    if (report.campaign) console.log(`Recorded campaign directive: ${report.campaign.recorded_next_action}`);
    if (report.crossings?.top_pending) console.log(`Recorded pending crossing: ${report.crossings.top_pending.id}; gate: ${report.crossings.top_pending.gate}; NOT AUTHORIZED`);
    if (report.dema) console.log(`Roots: ${report.dema.roots?.report?.result ?? "UNKNOWN"}; return: ${report.dema.return_situation?.status ?? "WITHHELD"}; shared URP: ${report.dema.shared_urp?.mode ?? "WITHHELD"}`);
    for (const error of report.errors) console.log(`HOLD: ${error}`);
    console.log("Dispatch disabled. No consent consumed; no runtime effect; no receipt issued.");
  }
  return report.exit_code;
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  process.exitCode = main();
}
