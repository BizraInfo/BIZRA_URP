import { useEffect, useState, type FormEvent } from "react";
import {
  GRANT_PHRASE,
  activePath,
  CONTEXT_KEEP,
  compactPath,
  contextLessons,
  detectVerb,
  holdTurn,
  publicContract,
  type Checkpoint,
  type FaceTurn,
  type PublicContract,
} from "@/lib/dema/face";
import { invoke, type InvokeCycle } from "@/lib/dema/invoke-loop";
import { Section } from "./Shell";

const STORE = "bizra-dema-face-v1";
const LOG_SCHEMA = "bizra.dema.face_log.v0.1";

const EXAMPLES = [
  "Draft the local summary and keep the sources here.",
  "Send the sources to the cloud model.",
  "What is still unknown about this node?",
  "Call this done, proven, and shipped.",
];

const LINES: { key: keyof Pick<
  FaceTurn,
  "goal" | "current_state" | "next_step" | "will_change" | "will_not_change" | "unknown" | "result"
>; label: string }[] = [
  { key: "goal", label: "Evidence" },
  { key: "current_state", label: "Now" },
  { key: "next_step", label: "Next" },
  { key: "will_change", label: "Will change" },
  { key: "will_not_change", label: "Will not change" },
  { key: "unknown", label: "Unknown" },
  { key: "result", label: "Result" },
];

const DOES = [
  "One intention in. Six lines out, plus the result.",
  "Work inside the envelope does not ask for a grant.",
  "Send, publish, mint, pay, deploy, delete, and transfer ask for an exact phrase and still do not run.",
  "Hold and resume return the same checkpoint.",
  "A different contract is refused. An interrupted turn is not retried.",
  "Skills load only when the sentence needs them. A lesson on the path is consulted and cannot raise the ceiling.",
  "The kept tail is the next context. The full path stays stored. The words are evidence, not a public purpose.",
  "A handed contract omits the branch. The truth label stays preview.",
];

const DOES_NOT = [
  "An independent witness. Seeing this screen is a self-report.",
  "A green sealing run of the node’s tests, check, or guidance.",
  "A launcher bound to a checkout.",
  "A live network, a token, a mint, or an autopoietic RSI loop. invoke() is preview-only.",
];

interface Log {
  schema: typeof LOG_SCHEMA;
  head_id: string | null;
  turns: FaceTurn[];
}

function emptyLog(): Log {
  return { schema: LOG_SCHEMA, head_id: null, turns: [] };
}

function isTurn(value: unknown): value is FaceTurn {
  if (!value || typeof value !== "object") return false;
  const turn = value as FaceTurn;
  return turn.schema === "bizra.dema.face_turn.v0.1" && turn.truth_label === "PREVIEW_ONLY";
}

function readLog(): Log {
  try {
    const raw = localStorage.getItem(STORE);
    if (!raw) return emptyLog();
    const parsed = JSON.parse(raw) as Log;
    if (parsed.schema !== LOG_SCHEMA || !Array.isArray(parsed.turns)) return emptyLog();
    const turns = parsed.turns.filter(isTurn).slice(-16);
    const head = turns.find((turn) => turn.checkpoint.id === parsed.head_id) ?? null;
    return { schema: LOG_SCHEMA, head_id: head?.checkpoint.id ?? null, turns };
  } catch {
    return emptyLog();
  }
}

function writeLog(log: Log) {
  try {
    localStorage.setItem(STORE, JSON.stringify(log));
  } catch {
    /* private mode */
  }
}

function nextFork(branch: string, turns: FaceTurn[]): string {
  const have = new Set(turns.map((turn) => turn.checkpoint.branch));
  let name = `${branch}/fork`;
  let n = 1;
  while (have.has(name)) {
    n += 1;
    name = `${branch}/fork-${n}`;
  }
  return name;
}

function ratioLabel(turn: FaceTurn): string {
  if (turn.snr.ratio === "not_supplied") return "not supplied";
  return turn.snr.ratio.toFixed(2);
}

export function Face() {
  const [sentence, setSentence] = useState("");
  const [phrase, setPhrase] = useState("");
  const [turn, setTurn] = useState<FaceTurn | null>(null);
  const [log, setLog] = useState<Log>(emptyLog);
  const [ready, setReady] = useState(false);
  const [branch, setBranch] = useState<string | null>(null);
  const [handoff, setHandoff] = useState<PublicContract | null>(null);
  const [standId, setStandId] = useState<string | null>(null);
  const [cycle, setCycle] = useState<InvokeCycle | null>(null);

  useEffect(() => {
    const stored = readLog();
    setLog(stored);
    const head = stored.turns.find((item) => item.checkpoint.id === stored.head_id) ?? null;
    setTurn(head);
    setReady(true);
  }, []);

  const head: FaceTurn | null =
    log.turns.find((item) => item.checkpoint.id === log.head_id) ?? null;
  const stood = standId ? (log.turns.find((item) => item.checkpoint.id === standId) ?? null) : null;
  const anchor = stood ?? head;
  const parent: Checkpoint | null = anchor ? anchor.checkpoint : null;
  const verb = detectVerb(sentence);
  const childBlocked = Boolean(
    parent && !parent.held && verb !== "none" && (parent.envelope || parent.verb !== verb),
  );
  const askPhrase = verb !== "none" && !parent?.held;

  function commit(next: FaceTurn, mode: "root" | "continue") {
    setTurn(next);
    setHandoff(null);
    if (!next.promoted || !next.checkpoint.id) return;
    setLog((current) => {
      const without = current.turns.filter((item) => item.checkpoint.id !== next.checkpoint.id);
      const turns = [...without, next].slice(-16);
      const saved: Log = { schema: LOG_SCHEMA, head_id: next.checkpoint.id, turns };
      writeLog(saved);
      return saved;
    });
    if (mode === "root") {
      setBranch(null);
      setStandId(null);
    }
  }

  function preview(text: string, asRoot: boolean) {
    const mode = asRoot || !parent ? "root" : "continue";
    const cycleNext = invoke({
      sentence: text,
      mode,
      parent: mode === "continue" ? parent : null,
      contract_id: mode === "continue" ? parent?.contract_id : null,
      grant_phrase: phrase,
      branch: mode === "continue" ? branch : null,
      prior_lessons:
        mode === "continue" && parent
          ? contextLessons(
              activePath(
                log.turns.map((item) => ({
                  id: item.checkpoint.id,
                  parent_id: item.checkpoint.parent_id,
                  lesson: item.lesson,
                })),
                parent.id,
              ),
              CONTEXT_KEEP,
            )
          : [],
    });
    setCycle(cycleNext);
    commit(cycleNext.turn, mode);
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    preview(sentence, !parent || childBlocked);
  }

  function hold() {
    if (!anchor?.promoted || anchor.checkpoint.held) return;
    const held = holdTurn(anchor);
    if (held.checkpoint.id !== anchor.checkpoint.id || !held.checkpoint.held) return;
    setTurn(held);
    setHandoff(null);
    setLog((current) => {
      const turns = current.turns.map((item) =>
        item.checkpoint.id === held.checkpoint.id ? held : item,
      );
      const saved: Log = { schema: LOG_SCHEMA, head_id: held.checkpoint.id, turns };
      writeLog(saved);
      return saved;
    });
  }

  const resumed = ready && anchor && turn?.checkpoint.id === anchor.checkpoint.id;
  const path = parent ? activePath(log.turns.map((item) => item.checkpoint), parent.id) : [];
  const pathIds = new Set(path.map((item) => item.id));
  const compacted = compactPath(path, CONTEXT_KEEP);

  function standOn(item: FaceTurn) {
    setTurn(item);
    setHandoff(null);
    setSentence(item.checkpoint.sentence);
    setPhrase("");
    setBranch(null);
    setStandId(item.checkpoint.id === log.head_id ? null : item.checkpoint.id);
  }

  return (
    <Section
      id="face"
      kicker="00 · Dema face"
      title="One intention. The screen answers. Nothing runs."
      lede="Pi supplies the active path and loads a skill only when the sentence needs it. KiroCrew supplies the checkpoint, the lesson, and a gate that cannot be widened. The effect still does not run."
    >
      <form onSubmit={onSubmit} className="border border-line bg-panel">
        <div className="border-b border-line px-4 py-4 sm:px-5">
          <label htmlFor="intention" className="font-mono text-xs uppercase tracking-widest text-gold">
            Intention
          </label>
          <textarea
            id="intention"
            value={sentence}
            onChange={(event) => setSentence(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
                event.preventDefault();
                preview(sentence, !parent || childBlocked);
              }
            }}
            rows={3}
            placeholder="One sentence about what this node should hold."
            className="mt-3 w-full resize-y bg-transparent font-display text-2xl leading-snug text-ivory outline-none placeholder:text-mute"
          />
          <div className="mt-4 flex flex-wrap gap-2">
            {EXAMPLES.map((example) => (
              <button
                key={example}
                type="button"
                onClick={() => {
                  setSentence(example);
                  setPhrase("");
                  preview(example, true);
                }}
                className="min-h-11 max-w-full border border-line px-3 text-left text-sm text-mute hover:border-gold hover:text-ivory"
              >
                {example}
              </button>
            ))}
          </div>
        </div>

        {childBlocked ? (
          <p className="border-b border-line px-4 py-4 text-sm leading-relaxed text-mute sm:px-5">
            This contract cannot take {verb}. A child does not widen what the parent admitted. The button
            below starts a separate contract. The effect still does not run.
          </p>
        ) : null}

        {askPhrase ? (
          <div className="border-b border-line px-4 py-4 sm:px-5">
            <label htmlFor="grant" className="font-mono text-xs uppercase tracking-widest text-gold">
              Exact phrase · {GRANT_PHRASE[verb]}
            </label>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-mute">
              This verb leaves the envelope. The phrase only marks that you saw the boundary. The effect
              still does not run.
            </p>
            <input
              id="grant"
              value={phrase}
              onChange={(event) => setPhrase(event.target.value)}
              autoComplete="off"
              spellCheck={false}
              className="mt-3 w-full border border-line bg-ink px-3 py-3 font-mono text-sm text-ivory outline-none focus:border-gold"
            />
          </div>
        ) : null}

        {parent?.held ? (
          <p className="border-b border-line px-4 py-4 text-sm leading-relaxed text-mute sm:px-5">
            This contract is held. Continue shows the same checkpoint and does not take a new sentence.
          </p>
        ) : null}

        <div className="flex flex-col gap-2 px-4 py-4 sm:flex-row sm:flex-wrap sm:px-5">
          <button
            type="submit"
            className="inline-flex min-h-11 items-center justify-center bg-gold px-5 font-medium text-ink"
          >
            {!parent ? "Preview the turn" : childBlocked ? "Preview as a separate contract" : "Continue this contract"}
          </button>
          <button
            type="button"
            onClick={() => preview(sentence, true)}
            disabled={!head}
            className="inline-flex min-h-11 items-center justify-center border border-line px-5 text-ivory disabled:opacity-40"
          >
            Separate contract
          </button>
          <button
            type="button"
            onClick={hold}
            disabled={!anchor?.promoted || anchor.checkpoint.held}
            className="inline-flex min-h-11 items-center justify-center border border-line px-5 text-ivory disabled:opacity-40"
          >
            Hold
          </button>
          <button
            type="button"
            onClick={() => {
              if (!anchor) return;
              setBranch(nextFork(anchor.checkpoint.branch, log.turns));
            }}
            disabled={!anchor || anchor.checkpoint.held}
            className="inline-flex min-h-11 items-center justify-center border border-line px-5 text-ivory disabled:opacity-40"
          >
            Branch
          </button>
        </div>
        {branch ? (
          <p className="px-4 pb-4 font-mono text-xs uppercase tracking-widest text-gold sm:px-5">
            Next continue uses {branch}
          </p>
        ) : null}
      </form>

      {cycle ? (
        <aside className="mt-6 border border-gold/40 bg-raised px-4 py-4 sm:px-5" aria-label="Invoke cycle receipt">
          <p className="font-mono text-xs uppercase tracking-widest text-gold">
            invoke() · {cycle.truth_label} · seal {cycle.seal}
          </p>
          <p className="mt-2 font-mono text-[11px] uppercase tracking-widest text-mute">
            TFP{" "}
            {(["mind", "memory", "logic", "crypto", "receipts", "human"] as const)
              .map((stage) => `${stage}:${cycle.protocol[stage]}`)
              .join(" · ")}
          </p>
          <p className="mt-2 font-mono text-[11px] uppercase tracking-widest text-mute">
            PoT F:{cycle.pot.formal} · C:{cycle.pot.cryptographic} · E:{cycle.pot.empirical} · $:
            {cycle.pot.economic} · FDE {cycle.fde.class} · HHMM {cycle.hhmm.hidden}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-ivory">{cycle.spearpoint_next}</p>
          <p className="mt-2 text-xs text-mute">
            minted {String(cycle.minted)} · effect_ran {String(cycle.effect_ran)} · process events{" "}
            {cycle.process.length}
          </p>
          {cycle.retrieve.hits.length > 0 ? (
            <ul className="mt-3 space-y-1 border-t border-line pt-3">
              {cycle.retrieve.hits.slice(0, 3).map((hit) => (
                <li key={hit.id} className="font-mono text-[11px] uppercase tracking-widest text-mute">
                  rag/{hit.kind} · {hit.title}
                  <span className="mt-0.5 block normal-case tracking-normal text-ivory/80">{hit.body}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </aside>
      ) : null}

      <div className="mt-8" aria-live="polite">
        {!ready || !turn ? (
          <p className="border border-line bg-panel px-5 py-6 text-mute">
            No checkpoint yet. The face is idle. Authority outside an explicit grant stays at zero, and this
            page never holds that grant.
          </p>
        ) : (
          <article className="border border-line bg-panel">
            <header className="flex flex-col gap-2 border-b border-line px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
              <p className="font-mono text-xs uppercase tracking-widest text-gold">
                {turn.truth_label} · {turn.reading}
                {turn.gate ? ` · gate ${turn.gate}` : ""}
                {turn.refusal ? ` · ${turn.refusal}` : ""}
              </p>
              <p className="font-mono text-xs uppercase tracking-widest text-mute">
                Authority Δ {turn.authority_delta} · effect {turn.effect_ran ? "ran" : "did not run"}
              </p>
            </header>
            <ol className="divide-y divide-line">
              {LINES.map((line, index) => (
                <li key={line.key} className="grid gap-2 px-4 py-4 sm:grid-cols-[9rem_1fr] sm:px-5">
                  <p className="font-mono text-xs uppercase tracking-widest text-gold">
                    {String(index + 1).padStart(2, "0")} {line.label}
                  </p>
                  <p className="font-display text-xl leading-snug text-ivory">{turn[line.key]}</p>
                </li>
              ))}
            </ol>
            {turn.skills_loaded ? (
              <div className="border-t border-line px-4 py-4 sm:px-5">
                <p className="font-mono text-xs uppercase tracking-widest text-gold">Loaded on demand</p>
                {turn.skills_loaded.length > 0 ? (
                  <ul className="mt-3 space-y-3">
                    {turn.skills_loaded.map((skill) => (
                      <li key={skill.id}>
                        <p className="font-mono text-xs uppercase tracking-widest text-ivory">{skill.id}</p>
                        <p className="mt-1 text-sm leading-relaxed text-mute">{skill.body}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-3 text-sm text-mute">Nothing in the catalog matched. The rest stayed out.</p>
                )}
                {(turn.skills_left_out ?? []).length > 0 ? (
                  <p className="mt-3 font-mono text-xs uppercase tracking-widest text-mute">
                    Left out · {turn.skills_left_out.join(" · ")}
                  </p>
                ) : null}
              </div>
            ) : null}
            {resumed ? (
              <p className="border-t border-line px-4 py-3 text-sm text-mute sm:px-5">
                {anchor?.checkpoint.held
                  ? "Held. This checkpoint stays. A new sentence is not taken until you start a separate contract."
                  : stood
                    ? "Standing off the head. The next continue branches here. Nothing was deleted."
                    : "This is the head of the branch stored in this browser. Not an independent witness."}
              </p>
            ) : null}
          </article>
        )}
      </div>

      {turn?.promoted ? (
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <div className="border border-line bg-raised px-4 py-4 sm:px-5">
            <p className="font-mono text-xs uppercase tracking-widest text-gold">Checkpoint</p>
            <dl className="mt-3 space-y-2 font-mono text-xs leading-relaxed text-mute">
              <div className="flex justify-between gap-4">
                <dt>Id</dt>
                <dd className="text-ivory">{turn.checkpoint.id}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt>Parent</dt>
                <dd className="text-ivory">{turn.checkpoint.parent_id ?? "none"}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt>Branch</dt>
                <dd className="text-ivory">{turn.checkpoint.branch}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt>Child gate</dt>
                <dd className="text-ivory">{turn.child_gate}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt>Lifecycle</dt>
                <dd className="text-ivory">{turn.lifecycle}</dd>
              </div>
            </dl>
          </div>
          <div className="border border-line bg-raised px-4 py-4 sm:px-5">
            <p className="font-mono text-xs uppercase tracking-widest text-gold">Lesson and noise</p>
            <p className="mt-3 leading-relaxed text-ivory">
              {turn.lesson ?? "No lesson. The sentence carried neither evidence words nor noise words."}
            </p>
            <p className="mt-3 font-mono text-xs uppercase tracking-widest text-mute">
              Signal {turn.snr.signal} · noise {turn.snr.noise} · ratio {ratioLabel(turn)}
            </p>
            <p className="mt-2 text-sm text-mute">
              A count of a closed lexicon. Not a model score, and not a product score.
            </p>
          </div>
        </div>
      ) : null}

      <div className="mt-4 flex flex-col gap-3 border border-line px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <p className="max-w-xl text-sm leading-relaxed text-mute">
          Hand outward the ceiling only. The words, the branch, the lesson, and the chain stay here.
        </p>
        <button
          type="button"
          disabled={!turn?.promoted}
          onClick={() => setHandoff(turn ? publicContract(turn) : null)}
          className="inline-flex min-h-11 shrink-0 items-center justify-center border border-gold px-5 text-gold disabled:opacity-40"
        >
          Hand the contract
        </button>
      </div>

      {handoff ? (
        <dl className="mt-4 border border-line bg-panel px-4 py-4 sm:px-5">
          <p className="font-mono text-xs uppercase tracking-widest text-gold">Public contract</p>
          {(
            [
              ["Contract", handoff.contract_id],
              ["Purpose", handoff.goal],
              ["Will change", handoff.will_change],
              ["Will not change", handoff.will_not_change],
              ["Ceiling", String(handoff.authority_ceiling)],
              ["Effect", handoff.effect],
            ] as const
          ).map(([label, value]) => (
            <div key={label} className="mt-3 grid gap-1 sm:grid-cols-[9rem_1fr]">
              <dt className="font-mono text-xs uppercase tracking-widest text-mute">{label}</dt>
              <dd className="text-ivory">{value}</dd>
            </div>
          ))}
        </dl>
      ) : null}

      {log.turns.length > 0 ? (
        <div className="mt-6 border border-line">
          <div className="border-b border-line px-4 py-3 sm:px-5">
            <p className="font-mono text-xs uppercase tracking-widest text-gold">Active path</p>
            {compacted.earlier > 0 ? (
              <p className="mt-2 text-sm text-mute">
                {compacted.earlier} earlier {compacted.earlier === 1 ? "entry stays" : "entries stay"} stored.
                They are not the next context.
              </p>
            ) : (
              <p className="mt-2 text-sm text-mute">
                Stand on an entry to branch from it. The other path is kept.
              </p>
            )}
            {stood ? (
              <p className="mt-2 font-mono text-xs uppercase tracking-widest text-gold">
                Standing on {stood.checkpoint.id}. The head is unchanged until the next promoted turn.
              </p>
            ) : null}
          </div>
          <ol className="divide-y divide-line" aria-label="Session branch">
            {log.turns
              .slice()
              .reverse()
              .map((item) => {
                const onPath = pathIds.has(item.checkpoint.id);
                const current = item.checkpoint.id === (anchor?.checkpoint.id ?? "");
                return (
                  <li key={item.checkpoint.id}>
                    <button
                      type="button"
                      onClick={() => standOn(item)}
                      aria-current={current ? "true" : undefined}
                      className={`flex min-h-11 w-full flex-col items-start gap-1 px-4 py-3 text-left font-mono text-xs uppercase tracking-widest sm:flex-row sm:items-center sm:justify-between sm:px-5 ${
                        current ? "text-gold" : onPath ? "text-ivory" : "text-mute"
                      }`}
                    >
                      <span>
                        {item.checkpoint.id === log.head_id ? "Head" : onPath ? "On path" : "Kept"} ·{" "}
                        {item.checkpoint.branch || "unpromoted"}
                        {item.checkpoint.held ? " · held" : ""}
                      </span>
                      <span>{item.checkpoint.id}</span>
                    </button>
                  </li>
                );
              })}
          </ol>
        </div>
      ) : null}

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <div>
          <h3 className="font-display text-2xl text-ivory">What this screen does</h3>
          <ul className="mt-4 space-y-3">
            {DOES.map((item) => (
              <li key={item} className="border-l border-gold pl-4 text-sm leading-relaxed text-ivory">
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-display text-2xl text-ivory">What it does not prove</h3>
          <ul className="mt-4 space-y-3">
            {DOES_NOT.map((item) => (
              <li key={item} className="border-l border-line pl-4 text-sm leading-relaxed text-mute">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className="mt-8 text-sm text-mute">
        The pool’s laws sit below.{" "}
        <a href="#manifest" className="text-gold underline-offset-4 hover:underline">
          Read the north star
        </a>
        .
      </p>
    </Section>
  );
}
