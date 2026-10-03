import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { DEMA_SOURCES, main, orientEstate } from "./estate-orient.mjs";
import { readDemaOwners } from "./estate-dema-read.mjs";

const sha = (bytes) => createHash("sha256").update(bytes).digest("hex");
const json = (path, value) => writeFileSync(path, JSON.stringify(value));
const owners = () => ({
  roots: { ok: true, report: { verified: true, result: "BIZRA_ROOT_CANON_SEALED" } },
  return_situation: { status: "ABSENT", effects: {
    executed: false, mutated: false, consent_consumed: false, receipt_minted: false,
    model_invoked: false, provider_called: false, dema_home_written: false,
  } },
  shared_urp: { mode: "DISCOVERY_ONLY" },
});

function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), "urp-orient-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const repositories = {};
  for (const id of ["urp", "dema", "home", "lake", "node0-ui"]) {
    const path = join(root, id);
    mkdirSync(path);
    const git = (...args) => execFileSync("git", ["-C", path, ...args], { stdio: "ignore" });
    git("init", "-b", "main");
    git("-c", "user.name=Fixture", "-c", "user.email=fixture@example.invalid", "commit", "--allow-empty", "-m", "fixture");
    git("remote", "add", "origin", `https://example.invalid/${id}.git`);
    repositories[id] = path;
  }
  for (const path of DEMA_SOURCES) {
    const file = join(repositories.dema, path);
    mkdirSync(join(file, ".."), { recursive: true });
    writeFileSync(file, "// fixture source\n");
  }
  const receiptDir = join(repositories.dema, "docs/receipts");
  mkdirSync(receiptDir, { recursive: true });
  json(join(receiptDir, "c001.json"), { schema: "bizra.crossing_receipt.v0.1", crossing_id: "C-001" });
  const crossings = [
    { id: "C-001", title: "Bound", gate: "none (read-only)", status: "CLOSED", receipt: "docs/receipts/c001.json" },
    { id: "C-005", title: "Check", gate: "follows C-004", status: "PENDING" },
  ];
  const ledger = join(repositories.dema, "docs/CROSSING_LEDGER.md");
  const setLedger = (rows) => writeFileSync(ledger, `# Ledger\n\n\`\`\`json\n${JSON.stringify({ schema: "bizra.crossing_ledger.v0.1", crossings: rows })}\n\`\`\`\n`);
  setLedger(crossings);
  writeFileSync(join(repositories.lake, "TOPOLOGY_CANON.md"), "One logical URP.\n");
  const campaignRoot = join(repositories.home, ".campaigns/test");
  mkdirSync(join(campaignRoot, "receipts"), { recursive: true });
  json(join(campaignRoot, "receipts/current.json"), { observation: "historical" });
  const campaign = {
    campaign_id: "test", frontier: "STOP", next_frontier: "STOP", next_action: "STOP",
    authority_delta: 0, current_receipt: "receipts/current.json", updated_at: "2026-01-01T00:00:00Z",
  };
  const campaignPath = join(campaignRoot, "campaign-state.json");
  json(campaignPath, campaign);
  const pointer = {
    mission_id: "test", updated_at_utc: "2026-01-02T00:00:00Z", next_safe_action: "STOP",
    pointer_reconciliation_2026_09_30: { campaign_binding: {
      ...campaign, path: campaignPath,
      campaign_state_sha256: `sha256:${sha(readFileSync(campaignPath))}`,
      current_receipt_sha256: `sha256:${sha(readFileSync(join(campaignRoot, campaign.current_receipt)))}`,
    } },
  };
  const pointerPath = join(root, "ACTIVE_MISSION.json");
  json(pointerPath, pointer);
  return {
    paths: { repositories, campaignRoot, pointer: pointerPath, demaHome: join(root, "absent-home") },
    crossings, campaign, pointer, ledger, setLedger,
  };
}

test("binds all five owners, reports STOP without dispatch, and leaves an absent home absent", (t) => {
  const f = fixture(t);
  let calls = 0;
  const result = orientEstate({ paths: f.paths, readDemaImpl: () => { calls++; return owners(); } });
  assert.equal(result.ok, true);
  assert.equal(result.exit_code, 0);
  assert.equal(calls, 1);
  assert.equal(Object.keys(result.repositories).length, 5);
  assert.equal(result.campaign.recorded_next_action, "STOP");
  assert.equal(result.crossings.top_pending.id, "C-005");
  assert.equal(result.crossings.consent_granted, false);
  assert.equal(result.crossings.closure_reverified, false);
  assert.equal(result.dispatch_allowed, false);
  assert.equal(result.boundary.authority_delta, 0);
  assert.equal(existsSync(f.paths.demaHome), false);
  for (const repo of Object.values(result.repositories)) assert.equal(repo.runtime_status, "UNKNOWN");
});

test("missing cited source holds before any Dema owner invocation", (t) => {
  const f = fixture(t);
  rmSync(join(f.paths.repositories.dema, DEMA_SOURCES[0]));
  let calls = 0;
  const result = orientEstate({ paths: f.paths, readDemaImpl: () => { calls++; return owners(); } });
  assert.equal(result.exit_code, 3);
  assert.equal(result.ok, false);
  assert.equal(calls, 0);
});

test("tampered campaign and receipt bytes each hold before owner invocation", (t) => {
  for (const path of ["campaign-state.json", "receipts/current.json"]) {
    const f = fixture(t);
    writeFileSync(join(f.paths.campaignRoot, path), path.startsWith("receipts") ? "tampered" : JSON.stringify({ ...f.campaign, frontier: "EXECUTE" }));
    let calls = 0;
    const result = orientEstate({ paths: f.paths, readDemaImpl: () => { calls++; return owners(); } });
    assert.equal(result.exit_code, 4);
    assert.equal(calls, 0);
    assert.equal(result.dispatch_allowed, false);
  }
});

test("duplicate crossing, missing gate, and foreign receipt identity refuse", (t) => {
  for (const variant of ["duplicate", "gate", "receipt"]) {
    const f = fixture(t);
    if (variant === "duplicate") f.crossings.push({ ...f.crossings[0] });
    if (variant === "gate") delete f.crossings[1].gate;
    if (variant === "receipt") json(join(f.paths.repositories.dema, "docs/receipts/c001.json"), { schema: "bizra.crossing_receipt.v0.1", crossing_id: "C-009" });
    f.setLedger(f.crossings);
    let calls = 0;
    const result = orientEstate({ paths: f.paths, readDemaImpl: () => { calls++; return owners(); } });
    assert.equal(result.exit_code, 3);
    assert.equal(calls, 0);
  }
});

test("source or tracked-file drift during the observation refuses after the read", (t) => {
  for (const kind of ["source", "tracked"]) {
    const f = fixture(t);
    const file = join(f.paths.repositories.dema, kind === "source" ? DEMA_SOURCES[0] : "unrelated-tracked.js");
    if (kind === "tracked") {
      writeFileSync(file, "// initial tracked content\n");
      execFileSync("git", ["-C", f.paths.repositories.dema, "add", file]);
      execFileSync("git", ["-C", f.paths.repositories.dema, "-c", "user.name=Fixture", "-c", "user.email=fixture@example.invalid", "commit", "-m", "source"], { stdio: "ignore" });
      writeFileSync(file, "// already dirty before observation\n");
    }
    const result = orientEstate({ paths: f.paths, readDemaImpl: () => {
      writeFileSync(file, "// changed during read\n"); return owners();
    } });
    assert.equal(result.exit_code, 4);
    assert.equal(result.ok, false);
  }
});

test("older pointer, mismatched mission, and near-miss directive each hold", (t) => {
  for (const variant of ["older", "mission", "directive"]) {
    const f = fixture(t);
    if (variant === "older") f.pointer.updated_at_utc = "2025-12-31T00:00:00Z";
    if (variant === "mission") f.pointer.mission_id = "another-mission";
    if (variant === "directive") f.pointer.next_safe_action = "STOP ";
    json(f.paths.pointer, f.pointer);
    let calls = 0;
    const result = orientEstate({ paths: f.paths, readDemaImpl: () => { calls++; return owners(); } });
    assert.equal(result.exit_code, 4);
    assert.equal(calls, 0);
  }
});

test("owner reader exception yields a hold with no effect permission", (t) => {
  const f = fixture(t);
  const result = orientEstate({ paths: f.paths, readDemaImpl: () => { throw new Error("reader_failed"); } });
  assert.equal(result.exit_code, 3);
  assert.equal(result.ok, false);
  assert.equal(result.dispatch_allowed, false);
});

test("root refusal and missing effect flags never become a successful orientation", (t) => {
  for (const variant of ["root", "flag"]) {
    const f = fixture(t);
    const result = orientEstate({ paths: f.paths, readDemaImpl: () => {
      const out = owners();
      if (variant === "root") out.roots.ok = false;
      else delete out.return_situation.effects.model_invoked;
      return out;
    } });
    assert.equal(result.exit_code, 3);
    assert.equal(result.ok, false);
  }
});

test("absolute receipt path cannot escape an owner root", (t) => {
  const f = fixture(t);
  f.crossings[0].receipt = f.paths.pointer;
  f.setLedger(f.crossings);
  let calls = 0;
  const result = orientEstate({ paths: f.paths, readDemaImpl: () => { calls++; return owners(); } });
  assert.equal(result.exit_code, 3);
  assert.equal(calls, 0);
});

test("root refusal prevents even importing the season and discovery loaders", async (t) => {
  const f = fixture(t);
  writeFileSync(join(f.paths.repositories.dema, "apps/cli/src/commands/identity-root-gatherer.js"),
    'export async function readVerifiedRootCanon() { return {ok:false, root_canon:{verified:false}, error:"drift"}; }');
  for (const path of ["apps/cli/src/daily-return-situation.js", "packages/core/src/urp-shared-runtime-discovery.js"]) {
    writeFileSync(join(f.paths.repositories.dema, path), 'throw new Error("loader must not import");');
  }
  const result = await readDemaOwners({ demaRoot: f.paths.repositories.dema, demaHome: f.paths.demaHome });
  assert.equal(result.roots.ok, false);
  assert.equal(result.return_situation, undefined);
  assert.equal(existsSync(f.paths.demaHome), false);
});

test("readable CLI preserves exit 3 when root refusal withholds other owner outputs", (t) => {
  const f = fixture(t);
  const lines = [];
  t.mock.method(console, "log", (line) => lines.push(line));
  const exit = main([], { paths: f.paths, readDemaImpl: () => ({ roots: { ok: false, report: { verified: false } } }) });
  assert.equal(exit, 3);
  assert.ok(lines.some((line) => line.includes("return: WITHHELD")));
  assert.ok(lines.some((line) => line.includes("Dispatch disabled")));
});
