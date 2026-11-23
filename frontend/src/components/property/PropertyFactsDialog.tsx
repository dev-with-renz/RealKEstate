import { useEffect, useRef } from "react";
import { formatArea, formatPriceRange, unitLabel } from "../../lib/format";
import type { PropertyDetail } from "../../types";
import Icon from "../ui/Icon";

interface Props {
  property: PropertyDetail;
  open: boolean;
  onClose: () => void;
}

const TBA = "To be announced";

/** "Learn more" pop-up (native <dialog>, same technique as the photo viewer): the extra details.
 *  A card on every screen size: scrolls inside itself, X at the top right, click outside to close. */
export default function PropertyFactsDialog({ property: p, open, onClose }: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
    document.body.classList.toggle("overflow-hidden", open);
    return () => document.body.classList.remove("overflow-hidden");
  }, [open]);

  const f = p.facts;
  const facts: { label: string; value: string; wide?: boolean }[] = [
    { label: "Address", value: f.address ?? p.location, wide: true },
    { label: "Total land area", value: f.land_area_sqm != null ? `${f.land_area_sqm.toLocaleString()} sqm` : TBA },
    { label: "Total buildings", value: String(f.total_buildings) },
    { label: "Total floors", value: f.total_floors != null ? String(f.total_floors) : TBA },
    { label: "Total units", value: f.total_units.toLocaleString() },
    { label: "Total parking slots", value: f.parking_slots != null ? f.parking_slots.toLocaleString() : TBA },
  ];

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      aria-labelledby="facts-title"
      className="m-auto max-h-[88dvh] w-[calc(100%-1.5rem)] max-w-2xl overflow-y-auto overscroll-contain rounded-leaf-sm bg-white p-0 text-ink-900 shadow-lift backdrop:bg-ink-950/60 backdrop:backdrop-blur-sm"
    >
      {open && (
        <div>
          <div className="sticky top-0 z-10 flex items-center justify-between gap-4 bg-white px-5 pb-3 pt-5 sm:px-8 sm:pt-6">
            <h2 id="facts-title" className="font-display text-2xl font-extrabold text-deca-600">More about {p.name}</h2>
            <button type="button" onClick={onClose} aria-label="Close"
              className="grid size-10 shrink-0 place-items-center rounded-full bg-blush text-deca-700 hover:bg-deca-100">
              <Icon name="close" />
            </button>
          </div>

          <div className="grid gap-6 px-5 pb-8 pt-2 sm:px-8">
            <dl className="grid grid-cols-2 gap-3">
              {facts.map((item) => (
                <div key={item.label} className={`rounded-2xl bg-ink-50 p-4 ${item.wide ? "col-span-2" : ""}`}>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-ink-500">{item.label}</dt>
                  <dd className="mt-1 font-display text-lg font-bold leading-snug">{item.value}</dd>
                </div>
              ))}
            </dl>

            {/* Highlighted: every sub unit type with its floor area */}
            <section className="rounded-leaf-sm bg-blush p-4 ring-2 ring-deca-200 sm:p-5">
              <h3 className="font-display text-xl font-bold text-deca-700">Unit types and floor areas</h3>
              <ul className="mt-3 grid gap-2">
                {p.unit_types.map((u) => (
                  <li key={u.id} className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 rounded-2xl bg-white px-4 py-3">
                    <div className="min-w-0">
                      <p className="font-semibold">{u.name}</p>
                      <p className="text-xs text-ink-500">{unitLabel(u.bedrooms)} · {formatPriceRange(u.price_min, u.price_max)}</p>
                    </div>
                    <span className="rounded-full bg-lagoon-500 px-3 py-1 text-sm font-bold text-white">
                      {formatArea(u.floor_area_min_sqm, u.floor_area_max_sqm) ?? TBA}
                    </span>
                  </li>
                ))}
                {p.unit_types.length === 0 && <li className="text-sm text-ink-600">Unit types will be posted soon.</li>}
              </ul>
            </section>
          </div>
        </div>
      )}
    </dialog>
  );
}
