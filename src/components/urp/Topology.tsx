import { useState, type KeyboardEvent } from "react";
import { NODES } from "@/lib/urp/canon";
import { Section } from "./Shell";

const SPOKES = [
  { id: "node0", x: 200, y: 36, live: true },
  { id: "node1", x: 332, y: 108, live: false },
  { id: "node2", x: 332, y: 252, live: false },
  { id: "node3", x: 68, y: 252, live: false },
] as const;

function onKey(event: KeyboardEvent, run: () => void) {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    run();
  }
}

export function Topology() {
  const [active, setActive] = useState("node0");
  const node = NODES.find((item) => item.id === active) ?? NODES[0];

  return (
    <Section
      id="topology"
      kicker="06 · Topology"
      title="A star of authority. Not a mesh of control."
      lede="Every node faces the pool. Nodes do not take administrative hold of each other. The star is a sovereignty diagram — one logical URP may still be many machines. Neither reading makes the network live."
    >
      <div className="grid items-start gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="border border-line bg-panel p-4 sm:p-6">
          <svg viewBox="0 0 400 360" role="img" aria-labelledby="topoTitle topoDesc" className="h-auto w-full">
            <title id="topoTitle">Nodes around a shared URP with no peer links</title>
            <desc id="topoDesc">
              Node0 is drawn solid. Other nodes are dashed and not connected to each other. A crossed line marks the forbidden peer path.
            </desc>
            {SPOKES.map((spoke) => (
              <line
                key={spoke.id}
                x1="200"
                y1="180"
                x2={spoke.x + 36}
                y2={spoke.y + 22}
                stroke={spoke.live ? "var(--color-gold)" : "var(--color-line)"}
                strokeWidth="1.4"
                strokeDasharray={spoke.live ? undefined : "4 4"}
              />
            ))}
            <line x1="368" y1="140" x2="368" y2="250" stroke="var(--color-gold-dim)" strokeDasharray="3 4" />
            <circle cx="368" cy="196" r="10" fill="var(--color-panel)" stroke="var(--color-gold-dim)" />
            <path d="M362 190 L374 202 M374 190 L362 202" stroke="var(--color-gold)" strokeWidth="1.4" />
            <text x="292" y="186" fill="var(--color-mute)" fontSize="10">
              no peer path
            </text>

            <g
              role="button"
              tabIndex={0}
              aria-pressed={active === "urp"}
              aria-label="URP, logical commons, not live"
              className="cursor-pointer"
              onClick={() => setActive("urp")}
              onKeyDown={(event) => onKey(event, () => setActive("urp"))}
            >
              <circle
                cx="200"
                cy="180"
                r="52"
                fill="var(--color-raised)"
                stroke={active === "urp" ? "var(--color-gold)" : "var(--color-gold-dim)"}
                strokeWidth="1.6"
              />
              <text x="200" y="176" textAnchor="middle" fill="var(--color-gold)" fontSize="16">
                URP
              </text>
              <text x="200" y="194" textAnchor="middle" fill="var(--color-mute)" fontSize="9">
                logical commons
              </text>
            </g>

            {SPOKES.map((spoke) => {
              const meta = NODES.find((item) => item.id === spoke.id);
              const selected = active === spoke.id;
              return (
                <g
                  key={spoke.id}
                  role="button"
                  tabIndex={0}
                  aria-pressed={selected}
                  aria-label={`${meta?.label ?? spoke.id}, ${spoke.live ? "represented" : "designed, not connected"}`}
                  className="cursor-pointer"
                  onClick={() => setActive(spoke.id)}
                  onKeyDown={(event) => onKey(event, () => setActive(spoke.id))}
                >
                  <rect
                    x={spoke.x}
                    y={spoke.y}
                    width="72"
                    height="44"
                    rx="8"
                    fill="var(--color-ink)"
                    stroke={selected || spoke.live ? "var(--color-gold)" : "var(--color-line)"}
                    strokeDasharray={spoke.live ? undefined : "4 3"}
                  />
                  <text
                    x={spoke.x + 36}
                    y={spoke.y + 27}
                    textAnchor="middle"
                    fill={spoke.live ? "var(--color-ivory)" : "var(--color-mute)"}
                    fontSize="11"
                  >
                    {meta?.label}
                  </text>
                </g>
              );
            })}
          </svg>
          <p className="mt-2 font-mono text-xs text-mute">Select a node. Dashed means designed, not joined.</p>
        </div>

        <article className="border border-line bg-raised p-6">
          <p className="font-mono text-xs uppercase tracking-widest text-gold">
            {node.live ? "Represented" : "Not live"}
          </p>
          <h3 className="mt-2 font-display text-4xl">{node.label}</h3>
          <p className="mt-1 text-sm text-gold-dim">{node.place}</p>
          <p className="mt-4 text-base leading-relaxed text-mute">{node.body}</p>
          <dl className="mt-6 space-y-3 border-t border-line pt-4 text-sm">
            <div>
              <dt className="font-mono text-xs uppercase tracking-widest text-mute">May hold</dt>
              <dd className="mt-1">
                {node.id === "urp"
                  ? "Admitted receipts, capability offers, verifier routing, revocation state."
                  : "Private files, local models, PAT memory, the human’s grants."}
              </dd>
            </div>
            <div>
              <dt className="font-mono text-xs uppercase tracking-widest text-mute">Must not become</dt>
              <dd className="mt-1">
                {node.id === "urp"
                  ? "The owner of a person, a back door into raw state, or a silent peer channel."
                  : "An account inside someone else’s machine, or a witness for its own effects."}
              </dd>
            </div>
          </dl>
        </article>
      </div>
    </Section>
  );
}
