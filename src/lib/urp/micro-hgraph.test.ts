import assert from "node:assert/strict";
import test from "node:test";
import { hgraphStats, retrieve, HGRAPH_TRUTH } from "./micro-hgraph.ts";

test("retrieve prefers URP ladder for federation noise", () => {
  const result = retrieve("open federation on the live network URP", 4);
  assert.equal(result.truth_label, HGRAPH_TRUTH);
  assert.equal(result.effect_ran, false);
  assert.equal(result.minted, false);
  assert.ok(result.hits.some((h) => h.id === "ladder.local" || h.id === "surface.walk"));
  assert.ok(result.hrm.length >= 1);
});

test("retrieve surfaces mint forbid for reward language", () => {
  const result = retrieve("mint impact reward simulation proven", 4);
  assert.ok(result.hits.some((h) => h.id === "law.sim" || h.id === "fde.law"));
});

test("empty query falls back without minting", () => {
  const result = retrieve("   ");
  assert.equal(result.hits.length, 1);
  assert.equal(result.hits[0].id, "ladder.local");
  assert.equal(result.minted, false);
});

test("hgraph stats are non-zero", () => {
  const stats = hgraphStats();
  assert.ok(stats.nodes >= 8);
  assert.ok(stats.edges >= 8);
});
