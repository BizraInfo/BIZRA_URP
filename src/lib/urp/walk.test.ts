import assert from "node:assert/strict";
import test from "node:test";
import { advance, createWalk, reduce } from "./walk.ts";

test("cloud export and impact mint fail closed", () => {
  let state = advance(advance(createWalk()));
  state = reduce(state, { type: "SELECT", id: "local-rtx" });
  state = advance(state);
  state = reduce(state, { type: "ACTION", action: "send_cloud" });
  assert.equal(state.decision?.fate, "BLOCK");
  assert.equal(state.decision?.code, "PRIVACY_MISMATCH");
  state = reduce(state, { type: "ACTION", action: "mint_impact" });
  assert.equal(state.decision?.code, "VALUE_NOT_PROVEN");
  state = reduce(state, { type: "EXECUTE" });
  assert.equal(state.effectCommitted, false);
});

test("one local effect, replay does not double it, economy stays dark", () => {
  let state = advance(advance(createWalk()));
  state = reduce(state, { type: "SELECT", id: "cloud-model" });
  state = advance(state);
  state = reduce(state, { type: "ACTION", action: "lease_local" });
  assert.equal(state.decision?.fate, "BLOCK");

  state = reduce(state, { type: "SELECT", id: "local-rtx" });
  state = advance(state);
  state = reduce(state, { type: "ACTION", action: "lease_local" });
  assert.equal(state.decision?.fate, "GO");
  state = reduce(state, { type: "EXECUTE" });
  state = reduce(state, { type: "OBSERVE" });
  state = reduce(state, { type: "SEAL" });
  assert.equal(state.receipt?.effect_count, 1);
  assert.equal(state.receipt?.impact_claimed, false);
  assert.equal(state.receipt?.rails.cryptographic, "NOT_RUN");
  assert.equal(state.receipt?.authority_delta, 0);
  state = reduce(state, { type: "REPLAY" });
  state = reduce(state, { type: "REPLAY" });
  assert.equal(state.receipt?.effect_count, 1);
  assert.equal(state.receipt?.duplicate_attempts, 2);
  const learned = reduce(state, { type: "LEARN" });
  assert.equal(learned.learning, false);
  state = reduce(state, { type: "USEFULNESS", value: "USEFUL" });
  state = reduce(state, { type: "LEARN" });
  assert.equal(state.learning, true);
  assert.equal(state.receipt?.authority_delta, 0);
});

test("federation asks for a new grant instead of inventing one", () => {
  let state = createWalk();
  state = reduce(state, { type: "ACTION", action: "open_federation" });
  assert.equal(state.decision?.fate, "REQUIRE_NEW_AUTHORITY");
});
