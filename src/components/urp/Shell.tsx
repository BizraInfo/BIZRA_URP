import type { ReactNode } from "react";

const LINKS = [
  ["face", "Face"],
  ["manifest", "Manifest"],
  ["equation", "Equation"],
  ["topology", "Topology"],
  ["mission", "Mission"],
  ["resources", "Resources"],
  ["membrane", "Membrane"],
  ["ledger", "Ledger"],
  ["dod", "Done"],
] as const;

export function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-ink text-ivory">
      <a
        href="#face"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-gold focus:px-3 focus:py-2 focus:text-ink"
      >
        Skip to content
      </a>
      <header className="sticky top-0 z-40 border-b border-line bg-ink/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <a href="#face" className="flex min-h-11 items-center gap-3">
            <span className="font-display text-xl text-gold" aria-hidden>
              بذرة
            </span>
            <span className="leading-tight">
              <span className="block font-display text-lg tracking-wide">BIZRA URP</span>
              <span className="block font-mono text-xs uppercase tracking-widest text-mute">
                Universal Resource Pool
              </span>
            </span>
          </a>
          <p className="hidden max-w-xs text-right font-mono text-xs uppercase tracking-widest text-gold sm:block">
            Face preview · not a live node
          </p>
        </div>
        <nav aria-label="Sections" className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 pb-3 sm:px-6">
          {LINKS.map(([id, label]) => (
            <a
              key={id}
              href={`#${id}`}
              className="inline-flex min-h-11 shrink-0 items-center rounded-full border border-line px-3 font-mono text-xs uppercase tracking-widest text-mute hover:border-gold hover:text-ivory"
            >
              {label}
            </a>
          ))}
        </nav>
      </header>
      <div className="border-b border-line bg-panel">
        <p className="mx-auto max-w-6xl px-4 py-3 font-mono text-xs leading-relaxed tracking-wide text-mute sm:px-6">
          Proof ceiling · architecture may describe the destination. Evidence decides how far anything has
          travelled. Federation, keys, wallets, and Proof-of-Impact are off.
        </p>
      </div>
      <main>{children}</main>
      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-10 sm:px-6">
          <p className="font-display text-2xl text-ivory">Pool capability. Preserve sovereignty.</p>
          <p className="max-w-2xl text-mute">
            Discover broadly. Qualify rigorously. Lease narrowly. Execute minimally. Observe independently.
            Reward only verified benefit — and never from this preview.
          </p>
          <p className="font-mono text-xs uppercase tracking-widest text-gold-dim">
            Design instrument · authority delta outside an explicit grant is zero
          </p>
        </div>
      </footer>
    </div>
  );
}

export function Section({
  id,
  kicker,
  title,
  lede,
  children,
}: {
  id: string;
  kicker: string;
  title: string;
  lede?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-36 border-t border-line">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        <p className="font-mono text-xs uppercase tracking-widest text-gold">{kicker}</p>
        <h2 className="mt-3 max-w-3xl font-display text-4xl leading-tight text-ivory sm:text-5xl">{title}</h2>
        {lede ? <p className="mt-4 max-w-2xl text-lg leading-relaxed text-mute">{lede}</p> : null}
        <div className="mt-10">{children}</div>
      </div>
    </section>
  );
}
