import { ECOSYSTEM, ESTATE_STOP, type EcosystemHealth } from "@/lib/urp/canon";
import { Section } from "./Shell";

const TONE: Record<EcosystemHealth, string> = {
  healthy: "text-gold",
  partial: "text-ivory",
  blocked: "text-mute",
  absent: "text-mute",
  stale: "text-mute",
};

export function Ecosystem() {
  return (
    <Section
      id="ecosystem"
      kicker="07 · Ecosystem"
      title="URP is the shared substrate. It is not the node."
      lede="Node0, Dema, Home, and the data lake orbit one logical pool. This panel records measured local bindings. It does not open federation."
    >
      <p className="mb-6 border border-gold/40 bg-raised px-4 py-3 font-mono text-xs uppercase tracking-widest text-gold">
        {ESTATE_STOP}
      </p>
      <ul className="grid gap-3">
        {ECOSYSTEM.map((link) => (
          <li key={link.id} className="border border-line bg-panel px-4 py-4 sm:px-5">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-display text-2xl">{link.name}</h3>
              <span className={`font-mono text-xs uppercase tracking-widest ${TONE[link.health]}`}>
                {link.health}
              </span>
            </div>
            <p className="mt-2 text-sm text-mute">{link.role}</p>
            <p className="mt-3 font-mono text-xs text-ivory/80">{link.evidence}</p>
            <p className="mt-2 text-sm">{link.crosses_urp}</p>
            <p className="mt-3 break-all font-mono text-[11px] uppercase tracking-wider text-mute">
              {link.remote}
            </p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
