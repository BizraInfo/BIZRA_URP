import { useEffect, useState, type ReactNode } from "react";
import { RESOURCES } from "@/lib/urp/canon";
import {
  CEILING,
  STAGES,
  advance,
  createWalk,
  reduce,
  type ActionId,
  type WalkState,
} from "@/lib/urp/walk";
import { Section } from "./Shell";

const STORE = "bizra-urp-design-walk-v1";

const ACTIONS: { id: ActionId; label: string; hint: string }[] = [
  { id: "lease_local", label: "Lease the selected resource", hint: "Only the local GPU fits this grant." },
  { id: "send_cloud", label: "Send the sources to the cloud model", hint: "Faster. Retains prompts. Forbidden here." },
  { id: "mint_impact", label: "Mint impact for the compute", hint: "Usage is not value." },
  { id: "open_federation", label: "Open Node1 and share the lake", hint: "Outside the lease." },
];

function fateTone(fate: string | undefined) {
  if (fate === "GO") return "border-gold text-gold";
  if (fate === "REQUIRE_NEW_AUTHORITY") return "border-gold-dim text-ivory";
  return "border-line text-ivory";
}

export function MissionWalk() {
  const [state, setState] = useState<WalkState>(() => createWalk());
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      setSaved(Boolean(localStorage.getItem(STORE)));
    } catch {
      setSaved(false);
    }
  }, []);

  useEffect(() => {
    if (!state.receipt) return;
    try {
      localStorage.setItem(STORE, JSON.stringify(state.receipt));
      setSaved(true);
    } catch {
      /* private mode */
    }
  }, [state.receipt]);

  function dispatch(next: WalkState) {
    setState(next);
  }

  function rebind() {
    try {
      const raw = localStorage.getItem(STORE);
      if (!raw) return;
      const receipt = JSON.parse(raw) as WalkState["receipt"];
      if (!receipt || receipt.schema !== "bizra.urp.usage_receipt.design_walk.v1") return;
      setState({
        ...createWalk(),
        stage: "receipt",
        selected: "local-rtx",
        effectCommitted: true,
        observed: true,
        duplicateAttempts: receipt.duplicate_attempts,
        usefulness: receipt.usefulness,
        receipt,
        decision: {
          action: "lease_local",
          fate: "GO",
          code: "ADMITTED",
          reason: "Reconstructed from the stored design-walk receipt. The campaign was not re-executed.",
        },
      });
    } catch {
      setSaved(false);
    }
  }

  function discardSaved() {
    try {
      localStorage.removeItem(STORE);
    } catch {
      /* ignore */
    }
    setSaved(false);
    setState(createWalk());
  }

  const selected = RESOURCES.find((item) => item.id === state.selected);

  return (
    <Section
      id="mission"
      kicker="15 · Master acceptance shape"
      title="Reproduce this experiment privately."
      lede="You are the human. DEMA carries the routing. FATE refuses anything the standing grant does not name. The writer of the file is not allowed to be its only witness."
    >
      {saved && state.stage === "intent" ? (
        <div className="mb-6 flex flex-col gap-3 border border-line bg-panel p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-mute">
            A previous design-walk receipt is on this browser. Rebind restores it without asking you to retell the mission. It is still not a runtime proof.
          </p>
          <div className="flex gap-2">
            <button type="button" onClick={rebind} className="min-h-11 border border-gold px-4 text-sm text-gold">
              Rebind
            </button>
            <button type="button" onClick={discardSaved} className="min-h-11 border border-line px-4 text-sm text-mute">
              Discard
            </button>
          </div>
        </div>
      ) : null}

      <ol className="flex gap-2 overflow-x-auto pb-2">
        {STAGES.map((stage, index) => {
          const reached = STAGES.findIndex((item) => item.id === state.stage) >= index;
          return (
            <li key={stage.id}>
              <button
                type="button"
                disabled={!reached}
                onClick={() => dispatch(reduce(state, { type: "TO", stage: stage.id }))}
                className={`min-h-11 whitespace-nowrap rounded-full border px-3 font-mono text-xs uppercase tracking-widest ${
                  state.stage === stage.id
                    ? "border-gold bg-gold text-ink"
                    : reached
                      ? "border-line text-ivory"
                      : "border-line text-mute"
                }`}
              >
                {index + 1} {stage.label}
              </button>
            </li>
          );
        })}
      </ol>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_18rem]">
        <div className="border border-line bg-panel p-5 sm:p-7">
          {state.stage === "intent" ? (
            <Stage
              who="Human"
              line="Dema, reproduce this experiment privately, compare it with the original, and prepare a verified summary."
            >
              <p className="text-sm leading-relaxed text-mute">
                Nothing has been leased, sent, or written. Intent is not an effect.
              </p>
              <Primary onClick={() => dispatch(advance(state))}>Let DEMA compile the contract</Primary>
            </Stage>
          ) : null}

          {state.stage === "contract" ? (
            <Stage who="DEMA" line="I can keep this on your workstation. Nothing consequential happens until you proceed.">
              <ul className="grid gap-2 text-sm sm:grid-cols-2">
                {[
                  ["Task", "Reproduce and compare, then one summary"],
                  ["Data class", "LOCAL_ONLY"],
                  ["Network", "Disabled"],
                  ["Memory", "Workstation class"],
                  ["Verifier", "Separate from the writer"],
                  ["Forbidden", "Public upload, retention, economy, Node1"],
                ].map(([k, v]) => (
                  <li key={k} className="border border-line bg-ink px-3 py-3">
                    <span className="block font-mono text-xs uppercase tracking-widest text-gold">{k}</span>
                    <span className="mt-1 block">{v}</span>
                  </li>
                ))}
              </ul>
              <Primary onClick={() => dispatch(advance(state))}>Discover resources</Primary>
            </Stage>
          ) : null}

          {state.stage === "discovery" ? (
            <Stage who="URP" line="Three listings. Hard constraints before rank. Authority is still not granted.">
              <ul className="space-y-3">
                {RESOURCES.map((item) => {
                  const on = state.selected === item.id;
                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        aria-pressed={on}
                        onClick={() => dispatch(reduce(state, { type: "SELECT", id: item.id }))}
                        className={`w-full border px-4 py-4 text-left ${on ? "border-gold bg-raised" : "border-line"}`}
                      >
                        <span className="flex items-baseline justify-between gap-3">
                          <span className="font-display text-2xl">{item.name}</span>
                          <span className="font-mono text-xs uppercase tracking-widest text-mute">
                            {item.admissible ? "Hard constraints pass" : "Filtered"}
                          </span>
                        </span>
                        <span className="mt-2 block text-sm text-mute">
                          {item.locality} · {item.privacy} · {item.qualification}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
              <Primary disabled={!state.selected} onClick={() => dispatch(advance(state))}>
                Take the selection to FATE
              </Primary>
            </Stage>
          ) : null}

          {state.stage === "admission" ? (
            <Stage
              who="FATE"
              line="The standing grant covers one local reversible write. It does not cover egress, impact, or another node."
            >
              {selected ? (
                <p className="text-sm text-mute">
                  Selected: {selected.name}. {selected.authority}.
                </p>
              ) : (
                <p className="text-sm text-mute">No resource selected. A lease request will fail closed.</p>
              )}
              <div className="grid gap-2">
                {ACTIONS.map((action) => (
                  <button
                    key={action.id}
                    type="button"
                    onClick={() => dispatch(reduce(state, { type: "ACTION", action: action.id }))}
                    className={`min-h-11 border px-4 py-3 text-left text-sm ${
                      state.decision?.action === action.id ? fateTone(state.decision.fate) : "border-line"
                    }`}
                  >
                    <span className="block">{action.label}</span>
                    <span className="mt-1 block text-mute">{action.hint}</span>
                  </button>
                ))}
              </div>
              {state.decision ? (
                <div className={`border p-4 ${fateTone(state.decision.fate)}`}>
                  <p className="font-mono text-xs uppercase tracking-widest">
                    {state.decision.fate} · {state.decision.code}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-ivory">{state.decision.reason}</p>
                </div>
              ) : null}
              <Primary
                disabled={state.decision?.fate !== "GO"}
                onClick={() => dispatch(reduce(state, { type: "EXECUTE" }))}
              >
                Execute the one admitted write
              </Primary>
            </Stage>
          ) : null}

          {state.stage === "effect" ? (
            <Stage who="Node" line="One operation. One artifact. The producer stops here.">
              <dl className="grid gap-3 text-sm sm:grid-cols-2">
                <div className="border border-line p-3">
                  <dt className="font-mono text-xs uppercase tracking-widest text-mute">Prestate</dt>
                  <dd className="mt-1">Summary artifact absent under the mission root.</dd>
                </div>
                <div className="border border-gold p-3">
                  <dt className="font-mono text-xs uppercase tracking-widest text-gold">Poststate</dt>
                  <dd className="mt-1">Exactly one local summary written. effect_count = 1.</dd>
                </div>
              </dl>
              <Primary onClick={() => dispatch(reduce(state, { type: "OBSERVE" }))}>
                Read it back on a separate path
              </Primary>
            </Stage>
          ) : null}

          {state.stage === "observation" ? (
            <Stage who="Witness" line="The path that wrote the file does not get to certify it.">
              <p className="text-sm leading-relaxed text-mute">
                A second observation finds the artifact, matches the expected subject, and does not widen the
                lease. In a real node this witness would be an independent origin. Here it is a separate step
                inside the design walk — process separation, not a foreign verifier.
              </p>
              <Primary onClick={() => dispatch(reduce(state, { type: "SEAL" }))}>Seal the design-walk receipt</Primary>
            </Stage>
          ) : null}

          {state.stage === "receipt" && state.receipt ? (
            <Stage who="Receipt" line="The bytes describe a walk. They do not become canon by existing.">
              <pre className="overflow-x-auto border border-line bg-ink p-4 font-mono text-xs leading-relaxed text-ivory">
                {JSON.stringify(state.receipt, null, 2)}
              </pre>
              <div className="grid gap-2 sm:grid-cols-2">
                <Stat k="Effects" v={String(state.receipt.effect_count)} />
                <Stat k="Duplicate tries" v={String(state.receipt.duplicate_attempts)} />
                <Stat k="Impact claimed" v="false" />
                <Stat k="Authority delta" v="0" />
              </div>
              <p className="text-sm leading-relaxed text-mute">{CEILING}</p>
              <div className="flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={() => dispatch(reduce(state, { type: "REPLAY" }))}
                  className="min-h-11 border border-line px-4 text-sm"
                >
                  Replay the same operation
                </button>
                <span className="self-center text-sm text-mute">Replay is fenced. The file is not written again.</span>
              </div>
              <fieldset>
                <legend className="font-display text-xl">Was this useful?</legend>
                <p className="mt-1 text-sm text-mute">The only judgment the machine will not invent.</p>
                <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                  {(["USEFUL", "NEEDS_CORRECTION", "NOT_USEFUL"] as const).map((value) => (
                    <button
                      key={value}
                      type="button"
                      aria-pressed={state.usefulness === value}
                      onClick={() => dispatch(reduce(state, { type: "USEFULNESS", value }))}
                      className={`min-h-11 border px-3 text-sm ${
                        state.usefulness === value ? "border-gold text-gold" : "border-line"
                      }`}
                    >
                      {value.replaceAll("_", " ")}
                    </button>
                  ))}
                </div>
              </fieldset>
              <Primary
                disabled={state.usefulness === "UNASKED"}
                onClick={() => dispatch(reduce(state, { type: "LEARN" }))}
              >
                Record a learning candidate
              </Primary>
            </Stage>
          ) : null}

          {state.stage === "learning" ? (
            <Stage who="Learning" line="A candidate lesson. Not shared wisdom. Not a new grant.">
              <ul className="space-y-3 text-sm leading-relaxed">
                <li className="border-l border-gold pl-3">
                  When the mission is LOCAL_ONLY, refuse the stronger external model before asking again.
                </li>
                <li className="border-l border-line pl-3">
                  Human judgment recorded as {state.usefulness.replaceAll("_", " ")}. PAT does not overwrite it.
                </li>
                <li className="border-l border-line pl-3">
                  authority_delta remains 0. The House of Wisdom does not admit this episode.
                </li>
              </ul>
              <p className="font-mono text-xs uppercase tracking-widest text-gold">
                {state.usefulness === "USEFUL" ? "Recorded · not a measured lift" : "Recorded · honest, not promoted"}
              </p>
              <button
                type="button"
                onClick={() => dispatch(reduce(state, { type: "RESET" }))}
                className="min-h-11 border border-line px-4 text-sm"
              >
                Begin again
              </button>
            </Stage>
          ) : null}
        </div>

        <aside className="space-y-4">
          <div className="border border-line bg-raised p-4">
            <h3 className="font-mono text-xs uppercase tracking-widest text-gold">Rails</h3>
            <ul className="mt-3 space-y-3 text-sm">
              <Rail name="Formal" status={state.observed ? "Pass in-walk" : "Waiting"} />
              <Rail name="Cryptographic" status="Not run" />
              <Rail name="Empirical" status={state.observed ? "Separate readback" : "Not observed"} />
              <Rail name="Economic" status="Not applicable" />
            </ul>
            <p className="mt-4 text-sm leading-relaxed text-mute">
              The ceiling is the weakest required rail. Missing cryptography means this walk cannot claim
              authenticity.
            </p>
          </div>
          <div className="border border-line p-4 text-sm leading-relaxed text-mute">
            <p className="font-mono text-xs uppercase tracking-widest text-gold">Standing grant</p>
            <p className="mt-2">
              Local read, one reversible summary write, no network, no publication, no keys, no token, no
              Node1. Child authority stays inside that envelope.
            </p>
          </div>
        </aside>
      </div>
    </Section>
  );
}

function Stage({ who, line, children }: { who: string; line: string; children: ReactNode }) {
  return (
    <div className="space-y-5">
      <div>
        <p className="font-mono text-xs uppercase tracking-widest text-gold">{who}</p>
        <p className="mt-2 font-display text-2xl leading-snug sm:text-3xl">{line}</p>
      </div>
      {children}
    </div>
  );
}

function Primary({
  children,
  onClick,
  disabled,
}: {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="inline-flex min-h-11 items-center justify-center bg-gold px-5 text-sm font-medium text-ink disabled:opacity-40"
    >
      {children}
    </button>
  );
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div className="border border-line px-3 py-3">
      <p className="font-mono text-xs uppercase tracking-widest text-mute">{k}</p>
      <p className="mt-1 font-display text-2xl">{v}</p>
    </div>
  );
}

function Rail({ name, status }: { name: string; status: string }) {
  return (
    <li className="flex items-baseline justify-between gap-3 border-b border-line pb-2">
      <span>{name}</span>
      <span className="text-right font-mono text-xs uppercase tracking-widest text-mute">{status}</span>
    </li>
  );
}
