import { useState } from "react";
import { formatPesoCompact, formatPriceRange, unitLabel } from "../../lib/format";
import type { PropertyDetail } from "../../types";
import Carousel from "../ui/Carousel";
import Icon, { type IconName } from "../ui/Icon";
import Section from "../ui/Section";
import PropertyFactsDialog from "./PropertyFactsDialog";

// Amenity.icon (set in the database / seed) -> icon drawn on the page
const AMENITY_ICONS: Record<string, IconName> = {
  pool: "pool", court: "court", garden: "garden", gym: "gym", playground: "playground",
  shield: "shield", mall: "bag", home: "home", room: "building",
};

const LABEL = "text-xs font-semibold uppercase tracking-wide text-ink-500";

/** Property explorer: photos on the left, the facts a buyer looks for first on the right.
 *  The info card is plain content (nothing to click except "Learn more"). */
export default function PropertyExplorer({ property: p }: { property: PropertyDetail }) {
  const [factsOpen, setFactsOpen] = useState(false);

  return (
    <Section className="pt-0 sm:pt-0">
      <h2 className="font-display text-2xl font-bold sm:text-3xl">Property explorer</h2>

      <div className="mt-6 grid gap-6 lg:grid-cols-[3fr_2fr] lg:items-start">
        {/* Up to 10 property photos; a placeholder shows when there are none yet */}
        <Carousel images={p.images} alt={p.name} aspect="aspect-[4/3] sm:aspect-[16/10]" />

        <aside className="flex flex-col gap-6 rounded-leaf-sm bg-white p-5 shadow-soft ring-1 ring-ink-900/5 sm:p-6">
          <dl className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-blush p-4">
              <dt className={LABEL}>Buildings</dt>
              <dd className="mt-1 font-display text-3xl font-extrabold text-deca-600">{p.building_count}</dd>
            </div>
            <div className="rounded-2xl bg-blush p-4">
              <dt className={LABEL}>Starting at</dt>
              <dd className="mt-1 font-display text-3xl font-extrabold text-deca-600">{p.price_from != null ? formatPesoCompact(p.price_from) : "Ask us"}</dd>
            </div>
          </dl>

          <section>
            <h3 className="font-display text-lg font-bold">Unit types and prices</h3>
            <ul className="mt-3 grid gap-2">
              {p.bedroom_prices.map((b) => (
                <li key={b.bedrooms} className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 rounded-2xl bg-ink-50 px-4 py-3">
                  <span className="flex items-center gap-2 font-semibold"><Icon name="bed" className="size-5 text-deca-600" />{unitLabel(b.bedrooms)}</span>
                  <span className="font-display text-sm font-bold sm:text-base">{formatPriceRange(b.price_min, b.price_max)}</span>
                </li>
              ))}
              {p.bedroom_prices.length === 0 && <li className="text-sm text-ink-600">Prices will be posted soon.</li>}
            </ul>
          </section>

          {p.amenities.length > 0 && (
            <section>
              <h3 className="font-display text-lg font-bold">Community amenities</h3>
              <ul className="mt-3 grid grid-cols-2 gap-2">
                {p.amenities.map((a) => (
                  <li key={a.name} className="flex items-center gap-2 rounded-2xl bg-lagoon-400/10 px-3 py-2.5 text-sm font-semibold text-ink-800">
                    <Icon name={AMENITY_ICONS[a.icon ?? ""] ?? "sparkle"} className="size-5 shrink-0 text-lagoon-500" />
                    {a.name}
                  </li>
                ))}
              </ul>
            </section>
          )}

          <button type="button" className="btn btn-dark w-full" onClick={() => setFactsOpen(true)}>
            Learn more <Icon name="arrow-right" className="size-4" />
          </button>
        </aside>
      </div>

      <PropertyFactsDialog property={p} open={factsOpen} onClose={() => setFactsOpen(false)} />
    </Section>
  );
}
