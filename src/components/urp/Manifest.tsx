export function Manifest() {
  return (
    <section id="manifest" className="scroll-mt-36">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[1.3fr_0.7fr]">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-gold">North star · one logical pool</p>
          <h1 className="mt-4 font-display text-5xl leading-tight text-ivory sm:text-6xl">
            The commons expands capability.
            <span className="mt-2 block text-gold">It does not acquire the human.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-mute">
            One human. One sovereign node. Private compute, models, files, and judgment stay owned until
            that human offers a bounded slice. The Universal Resource Pool is the governed field between
            nodes — not a landlord, not a marketplace of people.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="#mission"
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-gold px-5 font-medium text-ink"
            >
              Walk a private mission
            </a>
            <a
              href="#equation"
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-line px-5 text-ivory"
            >
              Read the equation
            </a>
          </div>
        </div>
        <aside className="flex flex-col justify-between gap-6 border border-line bg-panel p-6">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-mute">What this is</p>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed">
              <li className="border-l border-gold pl-3">A target constitution you can operate by hand.</li>
              <li className="border-l border-line pl-3">One design-walk mission with a fail-closed membrane.</li>
              <li className="border-l border-line pl-3">Evidence kept on separate axes. No single green badge.</li>
            </ul>
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-mute">What this is not</p>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-mute">
              <li>A running federation, wallet, or Proof-of-Impact mint.</li>
              <li>A claim that Node0 is closed, audited, or at network scale.</li>
              <li>Permission. Nothing in this page grants an effect outside the walk.</li>
            </ul>
          </div>
        </aside>
      </div>
      <div className="border-y border-line bg-panel">
        <dl className="mx-auto grid max-w-6xl gap-px bg-line sm:grid-cols-3">
          {[
            ["Human", "Meaning and the only root of consequential authority."],
            ["Node", "Identity, private state, devices as assets — not a second sovereign."],
            ["URP", "Discovery, qualification, lease, verification, revocation."],
          ].map(([term, line]) => (
            <div key={term} className="bg-panel px-4 py-6 sm:px-6">
              <dt className="font-display text-2xl">{term}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-mute">{line}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
