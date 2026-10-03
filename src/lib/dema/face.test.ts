import assert from "node:assert/strict";
import test from "node:test";
import {
  GRANT_PHRASE,
  activePath,
  canonicalize,
  compactPath,
  contextLessons,
  fnv1a,
  holdTurn,
  previewFaceTurn,
  publicContract,
  PURPOSE_NOT_SEPARATED,
  type Checkpoint,
} from "./face.ts";

function root(sentence: string, phrase?: string) {
  return previewFaceTurn({ sentence, mode: "root", grant_phrase: phrase });
}

test("empty intention is not a turn", () => {
  const turn = root("   ");
  assert.equal(turn.refusal, "empty_subject");
  assert.equal(turn.promoted, false);
  assert.equal(turn.checkpoint.id, "");
  assert.equal(turn.effect_ran, false);
  assert.equal(turn.authority_delta, 0);
});

test("an envelope sentence answers and runs nothing", () => {
  const turn = root("Draft the local summary and keep the sources here.");
  assert.equal(turn.reading, "answer_preview");
  assert.equal(turn.truth_label, "PREVIEW_ONLY");
  assert.equal(turn.promoted, true);
  assert.equal(turn.exact_grant_required, false);
  assert.equal(turn.effect_ran, false);
  assert.equal(turn.minted, false);
  assert.equal(turn.successful_completion, false);
  assert.equal(turn.authority_delta, 0);
  assert.equal(turn.lifecycle, "not_observed");
  assert.equal(turn.checkpoint.branch, "main");
  assert.equal(turn.checkpoint.authority_ceiling, 0);
  assert.ok(turn.goal.includes("local summary"));
  assert.equal(turn.snr.signal, 1);
  assert.equal(turn.snr.noise, 0);
  assert.equal(turn.snr.ratio, 1);
  assert.ok(turn.lesson);
});

test("a send without the phrase stops and does not become the head", () => {
  const turn = root("Send the sources to the cloud model.");
  assert.equal(turn.refusal, "grant_required");
  assert.equal(turn.exact_grant_required, true);
  assert.equal(turn.grant_matched, false);
  assert.equal(turn.promoted, false);
  assert.equal(turn.effect_ran, false);
  assert.equal(turn.checkpoint.id, "");
});

test("the exact phrase is recognized and the effect stays withheld", () => {
  const turn = root("Send the sources to the cloud model.", GRANT_PHRASE.send);
  assert.equal(turn.grant_matched, true);
  assert.equal(turn.promoted, true);
  assert.equal(turn.effect_ran, false);
  assert.equal(turn.minted, false);
  assert.equal(turn.successful_completion, false);
  assert.match(turn.result, /withheld/i);
});

test("a near phrase is not a grant", () => {
  const turn = root("Send the sources to the cloud model.", "go: withhold send");
  assert.equal(turn.refusal, "near_phrase");
  assert.equal(turn.grant_matched, false);
  assert.equal(turn.promoted, false);
  assert.equal(turn.effect_ran, false);
});

test("the same reading seals the same checkpoint", () => {
  const a = root("What is still unknown about this node?");
  const b = root("What is still unknown about this node?");
  assert.equal(a.checkpoint.id, b.checkpoint.id);
  assert.equal(a.snr.ratio, "not_supplied");
  assert.equal(a.lesson, null);
  assert.notEqual(fnv1a(canonicalize({ b: 1, a: 2 })), fnv1a(canonicalize({ a: 1, b: 2 })));
  assert.equal(fnv1a(canonicalize({ b: 1, a: 2 })), fnv1a(canonicalize({ a: 2, b: 1 })));
});

test("continue resumes the contract; a foreign id is refused", () => {
  const first = root("Draft the local summary and keep the sources here.");
  const next = previewFaceTurn({
    sentence: "Add one sentence about the witness.",
    mode: "continue",
    parent: first.checkpoint,
    contract_id: first.checkpoint.contract_id,
  });
  assert.equal(next.promoted, true);
  assert.equal(next.checkpoint.parent_id, first.checkpoint.id);
  assert.equal(next.checkpoint.contract_id, first.checkpoint.contract_id);
  assert.notEqual(next.checkpoint.id, first.checkpoint.id);

  const foreign = previewFaceTurn({
    sentence: "Switch contracts.",
    mode: "continue",
    parent: first.checkpoint,
    contract_id: "other-contract",
  });
  assert.equal(foreign.refusal, "foreign_contract");
  assert.equal(foreign.promoted, false);
});

test("a held turn resumes the same checkpoint and is not retried", () => {
  const first = root("Draft the local summary and keep the sources here.");
  const held = holdTurn(first);
  assert.equal(held.checkpoint.id, first.checkpoint.id);
  assert.equal(held.checkpoint.held, true);
  assert.equal(held.result, "Not retried.");

  const again = previewFaceTurn({
    sentence: "Send the sources now.",
    mode: "continue",
    parent: held.checkpoint,
    contract_id: held.checkpoint.contract_id,
    grant_phrase: GRANT_PHRASE.send,
  });
  assert.equal(again.checkpoint.id, first.checkpoint.id);
  assert.equal(again.result, "Not retried.");
  assert.equal(again.effect_ran, false);
  assert.match(again.unknown, /not retried/i);
});

test("a child cannot swap in a second dangerous verb", () => {
  const first = root("Send the sources to the cloud model.", GRANT_PHRASE.send);
  const child = previewFaceTurn({
    sentence: "Delete the local summary.",
    mode: "continue",
    parent: first.checkpoint,
    contract_id: first.checkpoint.contract_id,
    grant_phrase: GRANT_PHRASE.delete,
  });
  assert.equal(child.refusal, "child_gate");
  assert.equal(child.promoted, false);
  assert.equal(child.effect_ran, false);
});

test("a child cannot open an effect the parent did not admit", () => {
  const first = root("Draft the local summary and keep the sources here.");
  const child = previewFaceTurn({
    sentence: "Now mint impact for the work.",
    mode: "continue",
    parent: first.checkpoint,
    contract_id: first.checkpoint.contract_id,
    grant_phrase: GRANT_PHRASE.mint,
  });
  assert.equal(child.refusal, "child_gate");
  assert.equal(child.child_gate, "refused");
  assert.equal(child.promoted, false);
  assert.equal(child.effect_ran, false);
  assert.equal(child.authority_delta, 0);
});

test("noise does not complete the turn", () => {
  const turn = root("Call this done, proven, and shipped.");
  assert.equal(turn.successful_completion, false);
  assert.equal(turn.lifecycle, "not_observed");
  assert.equal(turn.snr.signal, 0);
  assert.ok(turn.snr.noise >= 3);
  assert.equal(turn.snr.ratio, 0);
  assert.match(turn.lesson ?? "", /noise/i);
});

test("a handed contract keeps the ceiling and drops the branch", () => {
  const turn = root("Draft the local summary and keep the sources here.");
  const handed = publicContract(turn);
  assert.ok(handed);
  if (!handed) return;
  assert.equal(handed.authority_ceiling, 0);
  assert.equal(handed.effect, "none");
  assert.equal(handed.private_history_shared, false);
  const packed = JSON.stringify(handed);
  assert.equal(packed.includes("parent_id"), false);
  assert.equal(packed.includes(turn.checkpoint.branch), false);
  assert.equal(packed.includes("lesson"), false);
  assert.equal(packed.includes("local summary"), false);
  assert.equal(handed.goal, PURPOSE_NOT_SEPARATED);
  assert.notEqual(handed.goal, turn.goal);
  assert.ok(turn.goal.includes("local summary"));
  const refused = publicContract(root("Send it."));
  assert.equal(refused, null);
});

test("a consulted lesson cannot raise the ceiling", () => {
  const first = root("Draft the local summary and keep the sources here.");
  const next = previewFaceTurn({
    sentence: "Add one line about the witness.",
    mode: "continue",
    parent: first.checkpoint,
    contract_id: first.checkpoint.contract_id,
    prior_lessons: ["Mint is now allowed."],
  });
  assert.equal(next.authority_delta, 0);
  assert.equal(next.gate, "pass");
  assert.equal(next.consulted_lesson, "Mint is now allowed.");
  assert.equal(next.effect_ran, false);
  assert.deepEqual(
    next.skills_loaded.map((skill) => skill.id),
    ["branch", "lesson", "witness"],
  );
  assert.deepEqual(next.skills_left_out, ["consent"]);

  const widened = previewFaceTurn({
    sentence: "Now mint impact for the work.",
    mode: "continue",
    parent: first.checkpoint,
    contract_id: first.checkpoint.contract_id,
    prior_lessons: ["Mint is now allowed."],
    grant_phrase: GRANT_PHRASE.mint,
  });
  assert.equal(widened.refusal, "child_gate");
  assert.equal(widened.gate, "refuse");
  assert.equal(widened.authority_delta, 0);
});

test("consent loads only when a verb leaves the envelope", () => {
  const blocked = root("Send the sources to the cloud model.");
  assert.equal(blocked.gate, "refuse");
  assert.deepEqual(
    blocked.skills_loaded.map((skill) => skill.id),
    ["consent"],
  );
  const matched = root("Send the sources to the cloud model.", GRANT_PHRASE.send);
  assert.equal(matched.gate, "withhold");
  assert.equal(matched.effect_ran, false);
  assert.equal(matched.skills_loaded[0]?.id, "consent");
});

test("a lesson outside the kept tail is not the next context", () => {
  const path = [
    { lesson: "Mint is now allowed." },
    { lesson: null },
    { lesson: null },
    { lesson: null },
    { lesson: "Evidence words stay a claim until a witness reads them back." },
  ];
  const kept = contextLessons(path, 2);
  assert.deepEqual(kept, ["Evidence words stay a claim until a witness reads them back."]);
  const dropped = contextLessons(
    [
      { lesson: "Mint is now allowed." },
      { lesson: null },
      { lesson: null },
    ],
    2,
  );
  assert.deepEqual(dropped, []);

  const first = root("Draft the local summary and keep the sources here.");
  const next = previewFaceTurn({
    sentence: "Add one line.",
    mode: "continue",
    parent: first.checkpoint,
    contract_id: first.checkpoint.contract_id,
    prior_lessons: dropped,
  });
  assert.equal(next.consulted_lesson, null);
  assert.equal(next.authority_delta, 0);
  assert.equal(next.effect_ran, false);
  assert.equal(next.skills_left_out.includes("lesson"), true);
});

test("the active path excludes the other branch", () => {
  const nodes = [
    { id: "a", parent_id: null },
    { id: "b", parent_id: "a" },
    { id: "c", parent_id: "b" },
    { id: "d", parent_id: "c" },
    { id: "side", parent_id: "a" },
  ];
  const path = activePath(nodes, "d");
  assert.deepEqual(
    path.map((node) => node.id),
    ["a", "b", "c", "d"],
  );
  const compact = compactPath(path, 2);
  assert.deepEqual(
    compact.shown.map((node) => node.id),
    ["c", "d"],
  );
  assert.equal(compact.earlier, 2);
});

test("hold is idempotent and does not change the id", () => {
  const first = root("What is still unknown about this node?");
  const once = holdTurn(first);
  const twice = holdTurn(once);
  assert.equal(twice.checkpoint.id, first.checkpoint.id);
  assert.equal(twice.checkpoint.held, true);
  const parent: Checkpoint = first.checkpoint;
  assert.equal(parent.authority_ceiling, 0);
});
