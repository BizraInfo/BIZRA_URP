import { useState } from "react";
import { AXES, RESOURCES, type AxisId } from "@/lib/urp/canon";
import { Section } from "./Shell";

export function Equation() {
  const [axis, setAxis] = useState<AxisId>("authority");
  const [resource, setResource] = useState(RESOURCES[0].id);
  const card = RESOURCES.find((item) => item.id === resource) ?? RESOURCES[0];

  return (
    <Section
      id="equation"
      kicker="04 · Constitutional equation"
      title="Five facts. Never one badge."
      lede="A GPU may exist, be capable, look qualified, and sit idle — and still be forbidden for this mission. Collapsing those into “ready” is how sovereignty leaks."
    >
      <div className="flex flex-wrap items-center gap-2">
        {AXES.map((item, index) => (
          <div key={item.id} className="flex items-center gap-2">
            <button
              type="button"
              aria-pressed={axis === item.id}
              onClick={() => setAxis(item.id)}
              className={`min-h-11 rounded-full border px-4 text-sm ${
                axis === item.id
                  ? "border-gold bg-gold text-ink"
                  : "border-line bg-panel text-ivory"
              }`}
            >
              {item.word}
            </button>
            {index < AXES.length - 1 ? (
              <span className="font-display text-xl text-gold-dim" aria-hidden>
                ≠
              </span>
            ) : null}
          </div>
        ))}
      </div>
      <p className="mt-6 max-w-2xl border-l-2 border-gold pl-4 font-display text-2xl leading-snug">
        {AXES.find((item) => item.id === axis)?.means}
      </p>

      <div className="mt-10 flex flex-wrap gap-2" role="tablist" aria-label="Example resources">
        {RESOURCES.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={resource === item.id}
            onClick={() => setResource(item.id)}
            className={`min-h-11 border px-4 text-sm ${
              resource === item.id ? "border-gold text-gold" : "border-line text-mute"
            }`}
          >
            {item.name}
          </button>
        ))}
      </div>

      <div className="mt-4 border border-line bg-panel">
        <div className="flex flex-col gap-2 border-b border-line px-4 py-4 sm:flex-row sm:items-baseline sm:justify-between sm:px-6">
          <h3 className="font-display text-2xl">{card.name}</h3>
          <p className="font-mono text-xs uppercase tracking-widest text-mute">{card.family}</p>
        </div>
        <ul>
          {AXES.map((item) => (
            <li
              key={item.id}
              className={`grid gap-1 border-b border-line px-4 py-4 last:border-b-0 sm:grid-cols-[10rem_1fr] sm:px-6 ${
                axis === item.id ? "bg-raised" : ""
              }`}
            >
              <span className="font-mono text-xs uppercase tracking-widest text-gold">{item.word}</span>
              <span className="text-sm leading-relaxed">{card.axes[item.id]}</span>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
