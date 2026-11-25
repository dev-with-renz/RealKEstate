import { useEffect, useRef } from "react";
import type { PropertyDetail } from "../../types";
import Icon from "../ui/Icon";

interface Props {
  property: PropertyDetail;
  open: boolean;
  onClose: () => void;
}

/** 2 numbers -> "42 to 48"; same number twice -> "42"; nothing -> "To be announced". (The column header already says sqm.) */
function sqm(min: number | null, max: number | null): string {
  if (min == null && max == null) return "To be announced";
  const lo = min ?? max!;
  const hi = max ?? min!;
  return lo === hi ? String(lo) : `${lo} to ${hi}`;
}

/** "Learn more" pop-up (native <dialog>): ONLY the highlighted sub unit types (2BR - A ...) and their floor area in sqm.
 *  A card on every screen size; scrolls inside itself; X, Esc or a click outside closes it. */
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

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      aria-labelledby="facts-title"
      className="m-auto max-h-[88dvh] w-[calc(100%-1.5rem)] max-w-md overflow-y-auto overscroll-contain rounded-leaf-sm bg-white p-0 text-ink-900 shadow-lift backdrop:bg-ink-950/60 backdrop:backdrop-blur-sm"
    >
      {open && (
        <div>
          <div className="sticky top-0 z-10 flex items-center justify-between gap-4 bg-white px-5 pb-3 pt-5 sm:px-8 sm:pt-6">
            <h2 id="facts-title" className="font-display text-2xl font-extrabold text-deca-600">Sub unit types</h2>
            <button type="button" onClick={onClose} aria-label="Close"
              className="grid size-10 shrink-0 place-items-center rounded-full bg-blush text-deca-700 hover:bg-deca-100">
              <Icon name="close" />
            </button>
          </div>

          {/* Highlighted two-column table: sub unit type | floor area (sqm) */}
          <div className="px-5 pb-8 pt-2 sm:px-8">
            <div className="rounded-leaf-sm bg-blush p-3 ring-2 ring-deca-200">
              <div className="overflow-hidden rounded-2xl bg-white">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-deca-600 text-sm text-white">
                      <th scope="col" className="px-4 py-2.5 font-semibold">Sub unit type</th>
                      <th scope="col" className="px-4 py-2.5 text-right font-semibold">Floor area (sqm)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink-900/10">
                    {p.unit_types.map((u) => (
                      <tr key={u.id}>
                        <th scope="row" className="px-4 py-3 font-semibold">{u.name}</th>
                        <td className="px-4 py-3 text-right font-display font-bold text-lagoon-500">{sqm(u.floor_area_min_sqm, u.floor_area_max_sqm)}</td>
                      </tr>
                    ))}
                    {p.unit_types.length === 0 && (
                      <tr><td colSpan={2} className="px-4 py-3 text-sm text-ink-600">Sub unit types will be posted soon.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </dialog>
  );
}
