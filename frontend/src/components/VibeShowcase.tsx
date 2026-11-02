import { useState } from "react";
import { LIFESTYLES, STYLES } from "../data/site";
import { cn } from "../lib/cn";
import Icon from "./ui/Icon";
import Section from "./ui/Section";

type Mode = keyof typeof LIFESTYLES;
const MODES = Object.keys(LIFESTYLES) as Mode[];

/** Marketing block: Familial vs Stylish/Modern, then the three style notes. */
export default function VibeShowcase() {
  const [mode, setMode] = useState<Mode>("familial");
  const v = LIFESTYLES[mode];
  const dark = mode === "stylish";

  return (
    <Section>
      <div className="max-w-2xl">
        <h2 className="font-display text-4xl font-extrabold sm:text-5xl">Two ways to love coming home</h2>
        <p className="mt-3 text-ink-600">Building a family life or choosing a stylish first place, there is a DECA HOMES community for it.</p>
      </div>

      <div role="tablist" aria-label="Lifestyle" className="mt-8 inline-flex rounded-full bg-white p-1.5 shadow-soft ring-1 ring-ink-900/5">
        {MODES.map((key) => (
          <button key={key} type="button" role="tab" id={`tab-${key}`} aria-selected={mode === key} aria-controls="vibe-panel" onClick={() => setMode(key)}
            className={cn("rounded-full px-5 py-2.5 text-sm font-semibold transition", mode === key ? "bg-linear-to-r from-deca-500 to-ember-500 text-white shadow-glow" : "text-ink-600 hover:text-ink-900")}>
            {LIFESTYLES[key].label}
          </button>
        ))}
      </div>

      <div id="vibe-panel" role="tabpanel" aria-labelledby={`tab-${mode}`}
        className={cn("mt-6 grid overflow-hidden transition-colors duration-300 lg:grid-cols-2", dark ? "rounded-leaf-alt bg-ink-900 text-white" : "rounded-leaf bg-blush text-ink-900")}>
        <div className="flex flex-col justify-center gap-5 p-7 sm:p-10">
          <h3 className="font-display text-3xl font-extrabold sm:text-4xl">{v.title}</h3>
          <p className={dark ? "text-ink-200" : "text-ink-700"}>{v.body}</p>
          <ul className="grid gap-3">
            {v.points.map((point) => (
              <li key={point} className="flex items-start gap-3">
                <span className={cn("mt-0.5 grid size-6 shrink-0 place-items-center rounded-full", dark ? "bg-lagoon-400 text-ink-900" : "bg-deca-500 text-white")}>
                  <Icon name="check" className="size-4" strokeWidth={2.6} />
                </span>
                {point}
              </li>
            ))}
          </ul>
        </div>
        <img src={v.image} alt="" aria-hidden="true" className="h-60 w-full object-cover lg:h-full lg:min-h-80" />
      </div>

      <ul className="mt-12 grid gap-8 md:grid-cols-3">
        {STYLES.map((s) => (
          <li key={s.title} className="border-t-4 border-deca-500 pt-5">
            <Icon name={s.icon} className="size-8 text-deca-500" />
            <h3 className="mt-3 font-display text-2xl font-bold">{s.title}</h3>
            <p className="mt-1.5 text-ink-600">{s.body}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
