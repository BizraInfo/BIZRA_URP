import { useState } from "react";
import { CROSSES, DOD_GROUPS, LAWS, NEVER_CROSSES, RESOURCES } from "@/lib/urp/canon";
import { Section } from "./Shell";

const VECTORS = [
  ["Lifecycle", "lifecycle"],
  ["Evidence", "qualification"],
  ["Freshness", "freshness"],
  ["Locality", "locality"],
  ["Privacy", "privacy"],
  ["Availability", "availability"],
  ["Authority", "authority"],
] as const;

export function Resources() {
  const [id, setId] = useState(RESOURCES[0].id);
  const card = RESOURCES.find((item) => item.id === id) ?? RESOURCES[0];

  return (
    <Section
      id="resources"
      kicker="09 · Resource card"
      title="A card describes. It does not authorize."
      lede="Ownership precedes pooling. Detecting a GPU is not a contribution. A contribution is not a blank cheque."
    >
      <div className="grid gap-6 lg:grid-cols-[16rem_1fr]">
        <div className="flex flex-col gap-2" role="tablist" aria-label="Resource cards">
          {RESOURCES.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={id === item.id}
              onClick={() => setId(item.id)}
              className={`min-h-11 border px-4 py-3 text-left ${
                id === item.id ? "border-gold bg-raised" : "border-line bg-panel"
              }`}
            >
              <span className="block text-sm">{item.name}</span>
              <span className="mt-1 block font-mono text-xs uppercase tracking-widest text-mute">{item.family}</span>
            </button>
          ))}
        </div>
        <article className="border border-line bg-panel">
          <header className="border-b border-line px-5 py-5">
            <p className="font-mono text-xs uppercase tracking-widest text-gold">{card.owner}</p>
            <h3 className="mt-2 font-display text-3xl">{card.name}</h3>
            <p className="mt-2 text-sm text-mute">{card.refusal}</p>
          </header>
          <dl>
            {VECTORS.map(([label, key]) => (
              <div key={key} className="grid gap-1 border-b border-line px-5 py-4 last:border-b-0 sm:grid-cols-[9rem_1fr]">
                <dt className="font-mono text-xs uppercase tracking-widest text-mute">{label}</dt>
                <dd className="text-sm">{card[key]}</dd>
              </div>
            ))}
            <div className="grid gap-1 px-5 py-4 sm:grid-cols-[9rem_1fr]">
              <dt className="font-mono text-xs uppercase tracking-widest text-mute">Proof ceiling</dt>
              <dd className="text-sm">
                Does not establish external availability, independent qualification, or a right to use it.
              </dd>
            </div>
          </dl>
        </article>
      </div>
    </Section>
  );
}

export function Membrane() {
  return (
    <Section
      id="membrane"
      kicker="21 · Membrane"
      title="What may cross. What never does."
      lede="FATE is a membrane, not an agent. It admits, blocks, or asks for one exact new grant. It does not reason itself into a wider permission."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="border border-line">
          <h3 className="border-b border-line px-5 py-4 font-display text-2xl">May cross, minimized</h3>
          <ul>
            {CROSSES.map((item) => (
              <li key={item.name} className="border-b border-line px-5 py-4 last:border-b-0">
                <p className="text-sm">{item.name}</p>
                <p className="mt-1 text-sm leading-relaxed text-mute">{item.detail}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="border border-gold-dim">
          <h3 className="border-b border-line px-5 py-4 font-display text-2xl">Does not cross</h3>
          <ul>
            {NEVER_CROSSES.map((item) => (
              <li key={item} className="border-b border-line px-5 py-4 text-sm last:border-b-0">
                {item}
              </li>
            ))}
          </ul>
          <p className="px-5 py-4 text-sm leading-relaxed text-mute">
            Decisions are only GO, BLOCK, or REQUIRE_NEW_AUTHORITY. Refusal is a finished outcome, not a
            broken screen.
          </p>
        </div>
      </div>
      <ol className="mt-8 grid gap-3 sm:grid-cols-3">
        {LAWS.slice(0, 6).map((law) => (
          <li key={law.id} className="border border-line bg-panel p-4">
            <p className="font-mono text-xs text-gold">{law.id}</p>
            <p className="mt-2 text-sm leading-relaxed">{law.text}</p>
          </li>
        ))}
      </ol>
      <details className="mt-4 border border-line bg-panel">
        <summary className="min-h-11 cursor-pointer px-4 py-3 text-sm">The rest of the invariants</summary>
        <ul className="space-y-3 border-t border-line px-4 py-4">
          {LAWS.slice(6).map((law) => (
            <li key={law.id} className="text-sm leading-relaxed">
              <span className="font-mono text-xs text-gold">{law.id} </span>
              {law.text}
            </li>
          ))}
        </ul>
      </details>
    </Section>
  );
}

const LINEAGE = [
  {
    id: "b0",
    title: "Block0",
    edge: "Genesis",
    body: "The lineage root in the diagram. This preview does not mint it, and a picture of a seed is not a receipt.",
  },
  {
    id: "lin",
    title: "Node lineage",
    edge: "One parent · tree",
    body: "Ancestry has a single parent. Identity descends. It does not vote.",
  },
  {
    id: "act",
    title: "Action",
    edge: "One parent · tree",
    body: "What was attempted, under which lease. The attempt is not the outcome.",
  },
  {
    id: "rc",
    title: "Receipt",
    edge: "One parent · tree",
    body: "Signed bytes, once a key exists. Existence of a hash is not semantic truth.",
  },
  {
    id: "ck",
    title: "Checkpoint",
    edge: "Canon seal",
    body: "A bounded commitment over an epoch. It must be re-derivable. It does not launder earlier claims.",
  },
];

export function Ledger() {
  const [id, setId] = useState("rc");
  const block = LINEAGE.find((item) => item.id === id) ?? LINEAGE[0];

  return (
    <Section
      id="ledger"
      kicker="17 · BlockTree and BlockGraph"
      title="One parent for ancestry. Many parents for influence."
      lede="The tree answers who came from whom. The graph answers what affected what. A colored edge cannot rewrite lineage, and neither structure is a truth oracle."
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <ol className="relative space-y-3 border-l border-line pl-5">
          {LINEAGE.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                aria-pressed={id === item.id}
                onClick={() => setId(item.id)}
                className={`w-full border px-4 py-3 text-left ${
                  id === item.id ? "border-gold bg-raised" : "border-line bg-panel"
                }`}
              >
                <span className="font-mono text-xs uppercase tracking-widest text-mute">{item.edge}</span>
                <span className="mt-1 block font-display text-2xl">{item.title}</span>
              </button>
            </li>
          ))}
        </ol>
        <div className="space-y-4">
          <article className="border border-line bg-panel p-5">
            <h3 className="font-display text-3xl">{block.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-mute">{block.body}</p>
          </article>
          <ul className="space-y-3">
            {[
              ["Adoption", "Someone took the result up. Influence, not parentage."],
              ["Verification", "A witness edge. Many may point at one receipt. Same origin is not independence."],
              ["Impact", "A future economic reading. Drawn dashed until a governed value rail exists. It does not exist here."],
            ].map(([title, text]) => (
              <li key={title} className="border border-dashed border-gold-dim px-4 py-3">
                <p className="text-sm">{title}</p>
                <p className="mt-1 text-sm leading-relaxed text-mute">{text}</p>
              </li>
            ))}
          </ul>
          <p className="border border-line px-4 py-4 text-sm leading-relaxed text-mute">
            Open decision, not silently closed: one source diagram names BLAKE3, current diagnostic contracts
            use SHA-256. Every digest needs an algorithm field. This preview does not pick the canonical
            BlockTree hash.
          </p>
        </div>
      </div>
    </Section>
  );
}

export function DefinitionOfDone() {
  return (
    <Section
      id="dod"
      kicker="55 · Definition of done"
      title="Twenty-five gates. Zero of them closed here."
      lede="A design walk can illustrate a shape. It cannot paint the gate green. Unknown stays unknown. Twenty-three of twenty-four would still not be closure."
    >
      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        {[
          ["Status of this preview", "TARGET_DESIGN"],
          ["Shared URP runtime", "NOT LIVE"],
          ["False greens issued", "0"],
        ].map(([k, v]) => (
          <div key={k} className="border border-line bg-panel px-4 py-4">
            <p className="font-mono text-xs uppercase tracking-widest text-mute">{k}</p>
            <p className="mt-2 font-display text-2xl text-gold">{v}</p>
          </div>
        ))}
      </div>
      <div className="space-y-3">
        {DOD_GROUPS.map((group) => (
          <details key={group.title} className="border border-line bg-panel">
            <summary className="min-h-11 cursor-pointer px-4 py-3 font-display text-xl">{group.title}</summary>
            <ul className="border-t border-line">
              {group.items.map((item) => (
                <li key={item.id} className="grid gap-2 border-b border-line px-4 py-4 last:border-b-0 sm:grid-cols-[4rem_1fr_auto] sm:items-baseline">
                  <span className="font-mono text-xs text-gold">{item.id}</span>
                  <span>
                    <span className="block text-sm">{item.title}</span>
                    <span className="mt-1 block text-sm leading-relaxed text-mute">{item.text}</span>
                  </span>
                  <span className="font-mono text-xs uppercase tracking-widest text-mute">Target</span>
                </li>
              ))}
            </ul>
          </details>
        ))}
      </div>
      <blockquote className="mt-10 border-l-2 border-gold pl-4 font-display text-2xl leading-snug sm:text-3xl">
        Discover broadly. Qualify rigorously. Lease narrowly. Execute minimally. Observe independently.
        Reward verified benefit.
      </blockquote>
    </Section>
  );
}
