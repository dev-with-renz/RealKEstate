import { useRef, useState } from "react";
import { cn } from "../../lib/cn";
import Icon from "./Icon";
import Media from "./Media";

interface CarouselProps {
  images: string[];
  alt: string;
  className?: string;
  aspect?: string;
}

/** Swipe on touch (native scroll-snap), click the arrows, or use the keyboard arrow keys. No library needed. */
export default function Carousel({ images, alt, className, aspect = "aspect-[4/3]" }: CarouselProps) {
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const slides = images.length ? images : [""];
  const many = slides.length > 1;

  const go = (to: number) => {
    const el = track.current;
    if (!el) return;
    const next = (to + slides.length) % slides.length;
    el.scrollTo({ left: next * el.clientWidth, behavior: "smooth" });
  };

  return (
    <div className={cn("relative overflow-hidden rounded-leaf bg-ink-900/5", className)}>
      <div
        ref={track}
        role="group"
        aria-roledescription="carousel"
        aria-label={alt}
        tabIndex={0}
        onScroll={(e) => setIndex(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") { e.preventDefault(); go(index + 1); }
          if (e.key === "ArrowLeft") { e.preventDefault(); go(index - 1); }
        }}
        className={cn("no-scrollbar flex snap-x snap-mandatory overflow-x-auto scroll-smooth", aspect)}
      >
        {slides.map((src, i) => (
          <div key={`${src}-${i}`} className="size-full shrink-0 snap-center" aria-label={`Photo ${i + 1} of ${slides.length}`}>
            <Media src={src} alt={`${alt}, photo ${i + 1}`} className="size-full" />
          </div>
        ))}
      </div>

      {many && (
        <>
          <button type="button" onClick={() => go(index - 1)} aria-label="Previous photo"
            className="absolute left-3 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-ink-900 shadow-soft backdrop-blur transition hover:bg-white">
            <Icon name="chevron-left" />
          </button>
          <button type="button" onClick={() => go(index + 1)} aria-label="Next photo"
            className="absolute right-3 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-ink-900 shadow-soft backdrop-blur transition hover:bg-white">
            <Icon name="chevron-right" />
          </button>
          <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5" aria-hidden="true">
            {slides.map((_, i) => (
              <span key={i} className={cn("h-1.5 rounded-full bg-white transition-all", i === index ? "w-6" : "w-1.5 opacity-60")} />
            ))}
          </div>
          <span className="absolute right-3 top-3 rounded-full bg-ink-900/70 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur">
            {index + 1}/{slides.length}
          </span>
        </>
      )}
    </div>
  );
}
