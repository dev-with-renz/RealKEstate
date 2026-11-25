import { useState } from "react";
import { unitLabel } from "../../lib/format";
import type { PropertyDetail } from "../../types";
import Carousel from "../ui/Carousel";
import Icon from "../ui/Icon";
import Section from "../ui/Section";
import PropertyFactsDialog from "./PropertyFactsDialog";

const TBA = "To be announced";
const LABEL = "text-xs font-semibold uppercase tracking-wide text-ink-500";

/** Property explorer: up to 10 property photos beside the quick facts. No prices, no inquiry buttons.
 *  "Learn more" (bottom of the card) opens a pop-up with the sub unit types and their floor areas. */
export default function PropertyExplorer({ property: p }: { property: PropertyDetail }) {
  const [learnMore, setLearnMore] = useState(false);
  const f = p.facts;

  const facts: { label: string; value: string; wide?: boolean }[] = [
    { label: "Land area", value: f.land_area_sqm != null ? `${f.land_area_sqm.toLocaleString()} sqm` : TBA, wide: true },
    { label: "Buildings", value: String(f.total_buildings) },
    { label: "Total floors", value: f.total_floors != null ? String(f.total_floors) : TBA },
    { label: "Total units", value: f.total_units.toLocaleString() },
    { label: "Total parking slots", value: f.parking_slots != null ? f.parking_slots.toLocaleString() : TBA },
  ];

  return (
    <Section className="pt-0 sm:pt-0">
      <h2 className="font-display text-2xl font-bold sm:text-3xl">Property Explorer</h2>

      <div className="mt-6 grid gap-6 lg:grid-cols-[3fr_2fr] lg:items-start">
        {/* A placeholder shows when the property has no photos yet */}
        <Carousel images={p.images} alt={p.name} aspect="aspect-[4/3] sm:aspect-[16/10]" />

        <aside className="flex flex-col gap-6 rounded-leaf-sm bg-white p-5 shadow-soft ring-1 ring-ink-900/5 sm:p-6">
          {/* Main unit types, highlighted. One chip per bedroom count: 2BR A to D count as a single "2 Bedroom". */}
          <section className="rounded-2xl bg-blush p-4 ring-2 ring-deca-200">
            <h3 className="font-display text-lg font-bold text-deca-700">Unit types</h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {p.bedroom_prices.map((b) => (
                <li key={b.bedrooms} className="chip gap-2 bg-white px-4 py-2 text-sm text-ink-900 shadow-soft">
                  <Icon name="bed" className="size-4 text-deca-600" />
                  {unitLabel(b.bedrooms)}
                </li>
              ))}
              {p.bedroom_prices.length === 0 && <li className="text-sm text-ink-600">Unit types will be posted soon.</li>}
            </ul>
          </section>

          <dl className="grid grid-cols-2 gap-3">
            {facts.map((item) => (
              <div key={item.label} className={`rounded-2xl bg-ink-50 p-4 ${item.wide ? "col-span-2" : ""}`}>
                <dt className={LABEL}>{item.label}</dt>
                <dd className="mt-1 font-display text-lg font-bold leading-snug">{item.value}</dd>
              </div>
            ))}
          </dl>

          <button type="button" className="btn btn-dark w-full" onClick={() => setLearnMore(true)} aria-haspopup="dialog">
            Learn more <Icon name="arrow-right" className="size-4" />
          </button>
        </aside>
      </div>

      <PropertyFactsDialog property={p} open={learnMore} onClose={() => setLearnMore(false)} />
    </Section>
  );
}
