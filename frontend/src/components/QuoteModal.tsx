import { useEffect, useRef } from "react";
import InquiryForm from "./InquiryForm";
import Icon from "./ui/Icon";

interface QuoteModalProps {
  open: boolean;
  onClose: () => void;
  property?: { slug: string; name: string };
}

/** Uses the native <dialog>: focus trapping, Esc to close and a backdrop come for free.
 *  It is a bottom sheet on phones and a centered window on larger screens. */
export default function QuoteModal({ open, onClose, property }: QuoteModalProps) {
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
      aria-labelledby="quote-title"
      className="m-0 mt-auto max-h-[92dvh] w-full max-w-none overflow-y-auto overscroll-contain rounded-t-[2rem] bg-white p-0 text-ink-900 shadow-lift backdrop:bg-ink-950/65 backdrop:backdrop-blur-sm sm:m-auto sm:max-w-lg sm:rounded-leaf"
    >
      <div className="p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="quote-title" className="font-display text-3xl font-extrabold">Get a free quote</h2>
            <p className="mt-1 text-sm text-ink-600">Tell us what you need. We will send an estimate with no obligation.</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="grid size-10 shrink-0 place-items-center rounded-full bg-blush text-deca-700 hover:bg-deca-100">
            <Icon name="close" />
          </button>
        </div>
        <div className="mt-6">
          {open && <InquiryForm kind="quote" propertySlug={property?.slug} propertyName={property?.name} onDone={onClose} />}
        </div>
      </div>
    </dialog>
  );
}
