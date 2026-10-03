import assert from "node:assert/strict";
import test from "node:test";
import { invoke, runInvokeLoopCheck, INVOKE_SCHEMA, INVOKE_TRUTH } from "./invoke-loop.ts";

test("invoke empty intention blocks logic and mints nothing", () => {
  const cycle = invoke({ sentence: "", mode: "root" });
  assert.equal(cycle.schema, INVOKE_SCHEMA);
  assert.equal(cycle.truth_label, INVOKE_TRUTH);
  assert.equal(cycle.protocol.logic, "block");
  assert.equal(cycle.effect_ran, false);
  assert.equal(cycle.minted, false);
  assert.equal(cycle.authority_delta, 0);
  assert.equal(cycle.pot.cryptographic, "NOT_RUN");
  assert.equal(cycle.pot.economic, "NOT_APPLICABLE");
  assert.ok(cycle.seal.length === 8);
  assert.equal(cycle.hhmm.hidden, "idle");
});

test("envelope sentence runs full TFP preview without effect", () => {
  const cycle = invoke({
    sentence: "Draft the local summary and keep the sources here.",
    mode: "root",
  });
  assert.equal(cycle.turn.promoted, true);
  assert.equal(cycle.protocol.mind, "pass");
  assert.equal(cycle.protocol.human, "pass");
  assert.equal(cycle.effect_ran, false);
  assert.equal(cycle.minted, false);
  assert.ok(cycle.process.length >= 6);
  assert.ok(cycle.graph.edges.length >= 4);
  assert.equal(cycle.hashtable.urp_ladder, "URP_LOCAL_ACTIVE");
});

test("dangerous verb without grant is CONSENT_STOP", () => {
  const cycle = invoke({ sentence: "Send the sources to the cloud model.", mode: "root" });
  assert.equal(cycle.fde.class, "CONSENT_STOP");
  assert.equal(cycle.protocol.human, "block");
  assert.equal(cycle.turn.effect_ran, false);
  assert.equal(cycle.minted, false);
  assert.equal(cycle.hhmm.hidden, "refuse");
});

test("exact grant still withholds and never mints", () => {
  const cycle = invoke({
    sentence: "Send the sources to the cloud model.",
    mode: "root",
    grant_phrase: "GO: withhold send",
  });
  assert.equal(cycle.turn.grant_matched, true);
  assert.equal(cycle.protocol.human, "withhold");
  assert.equal(cycle.effect_ran, false);
  assert.equal(cycle.minted, false);
  assert.ok(cycle.diffusion.some((d) => /withhold|Dangerous/i.test(d)));
});

test("noise words do not raise economic rail", () => {
  const cycle = invoke({
    sentence: "Call this done, proven, shipped, and minted on the live network.",
    mode: "root",
  });
  assert.ok(cycle.snr.noise > 0);
  assert.equal(cycle.pot.economic, "NOT_APPLICABLE");
  assert.equal(cycle.minted, false);
});

test("invoke attaches local hgraph retrieve without minting", () => {
  const cycle = invoke({
    sentence: "Lease the local GPU under proof discipline.",
    mode: "root",
  });
  assert.equal(cycle.retrieve.truth_label, "LOCAL_CANON_RETRIEVE_ONLY");
  assert.ok(cycle.retrieve.hits.length >= 1);
  assert.equal(cycle.retrieve.minted, false);
});

test("self harness is green", () => {
  const report = runInvokeLoopCheck();
  assert.equal(report.ok, true);
  assert.ok(report.cases.length >= 4);
});
