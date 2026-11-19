import { useEffect, useRef } from "react";
import type { Agency } from "../../data/agency";
import Icon from "../ui/Icon";

interface PillarsDialogProps {
  /** The company whose pillars to show. null = closed. */
  agency: Agency | null;
  onClose: () => void;
}

/** Pop-up card (native <dialog>, same technique as QuoteModal and Lightbox).
 *  Close with the X, the Esc key, or by clicking the dimmed area outside the card. */
export default function PillarsDialog({ agency, onClose }: PillarsDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const open = agency !== null;

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
      aria-labelledby="pillars-title"
      className="m-auto max-h-[88dvh] w-[calc(100%-1.5rem)] max-w-lg overflow-y-auto rounded-leaf-sm bg-white p-0 text-ink-900 shadow-lift backdrop:bg-ink-950/60 backdrop:backdrop-blur-sm"
    >
      {agency && (
        <div>
          <div className="sticky top-0 flex items-center justify-between gap-4 bg-white px-6 pb-3 pt-6 sm:px-8">
            <h2 id="pillars-title" className="font-display text-2xl font-extrabold text-deca-600">{agency.pillarsLabel}</h2>
            <button type="button" onClick={onClose} aria-label="Close"
              className="grid size-10 shrink-0 place-items-center rounded-full bg-blush text-deca-700 hover:bg-deca-100">
              <Icon name="close" />
            </button>
          </div>
          <ol className="grid gap-4 px-6 pb-8 pt-2 sm:px-8">
            {agency.pillars.map((pillar, i) => (
              <li key={pillar.title + i} className="flex gap-4">
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-deca-600 font-display text-lg font-extrabold text-white">{i + 1}</span>
                <div>
                  <h3 className="font-display text-lg font-bold">{pillar.title}</h3>
                  <p className="mt-0.5 text-ink-700">{pillar.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}
    </dialog>
  );
}
