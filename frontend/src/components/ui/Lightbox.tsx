import { useEffect, useRef } from "react";
import { cn } from "../../lib/cn";
import type { GalleryImage } from "../../types";
import Icon from "./Icon";

interface LightboxProps {
  images: GalleryImage[];
  /** Which photo is showing. null = the viewer is closed. */
  index: number | null;
  onIndexChange: (index: number) => void;
  onClose: () => void;
}

/** Photo viewer built on the native <dialog>, like QuoteModal.
 *  showModal() puts it in the browser's "top layer", so it floats ABOVE the sticky navbar
 *  and dims the page behind it. It is a card, not full screen: click the dimmed area, press
 *  Esc, or tap the X to close. */
export default function Lightbox({ images, index, onIndexChange, onClose }: LightboxProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const open = index !== null;

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
    document.body.classList.toggle("overflow-hidden", open);
    return () => document.body.classList.remove("overflow-hidden");
  }, [open]);

  const current = index ?? 0;
  const go = (to: number) => onIndexChange((to + images.length) % images.length);
  const image = images[current];

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()} // a click on the dimmed backdrop targets the <dialog> itself
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(current + 1);
        if (e.key === "ArrowLeft") go(current - 1);
      }}
      aria-label="Photo viewer"
      className="m-auto max-h-[88dvh] w-[calc(100%-1.5rem)] max-w-4xl overflow-hidden rounded-leaf-sm bg-white p-0 text-ink-900 shadow-lift backdrop:bg-ink-950/60 backdrop:backdrop-blur-sm"
    >
      {open && image && (
        <div className="flex flex-col">
          <div className="flex items-center justify-between gap-4 px-5 py-3">
            <p className="text-sm font-semibold text-ink-600" aria-live="polite">Photo {current + 1} of {images.length}</p>
            <button type="button" onClick={onClose} aria-label="Close photos"
              className="grid size-10 place-items-center rounded-full bg-blush text-deca-700 hover:bg-deca-100">
              <Icon name="close" />
            </button>
          </div>

          <div className="relative bg-ink-50">
            <img src={image.src} alt={image.alt} className="mx-auto max-h-[56dvh] w-full object-contain" />
            {images.length > 1 && (
              <>
                <button type="button" onClick={() => go(current - 1)} aria-label="Previous photo"
                  className="absolute left-3 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 shadow-soft hover:bg-white">
                  <Icon name="chevron-left" />
                </button>
                <button type="button" onClick={() => go(current + 1)} aria-label="Next photo"
                  className="absolute right-3 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 shadow-soft hover:bg-white">
                  <Icon name="chevron-right" />
                </button>
              </>
            )}
          </div>

          <div className="no-scrollbar flex gap-2 overflow-x-auto p-3">
            {images.map((img, i) => (
              <button key={img.src} type="button" onClick={() => onIndexChange(i)} aria-label={`Show photo ${i + 1}`}
                aria-current={i === current}
                className={cn("h-16 w-24 shrink-0 overflow-hidden rounded-lg ring-2 transition", i === current ? "ring-deca-600" : "opacity-70 ring-transparent hover:opacity-100")}>
                <img src={img.src} alt="" className="size-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </dialog>
  );
}
