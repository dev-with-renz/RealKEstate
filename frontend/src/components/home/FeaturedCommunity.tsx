import { useState } from "react";
import { Link } from "react-router-dom";
import { FEATURED } from "../../data/site";
import { cn } from "../../lib/cn";
import Lightbox from "../ui/Lightbox";
import Media from "../ui/Media";
import Section from "../ui/Section";

export default function FeaturedCommunity() {
  // null = viewer closed, 0, 1, 2... = which photo is open
  const [viewer, setViewer] = useState<number | null>(null);
  const { images } = FEATURED;
  const preview = images.slice(0, 3); // only 3 thumbnails on the page...
  const extra = images.length - preview.length; // ...the rest are reached inside the viewer

  return (
    <Section>
      <div className="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-12">
        <div>
          <p className="chip bg-blush text-deca-700">{FEATURED.eyebrow}</p>
          <h2 className="mt-4 font-display text-4xl font-extrabold sm:text-5xl">{FEATURED.title}</h2>
          <p className="mt-4 text-lg text-ink-700">{FEATURED.body}</p>
          <ul className="mt-6 flex flex-wrap gap-2">
            {FEATURED.highlights.map((h) => <li key={h} className="chip bg-lagoon-400/10 py-2 text-ink-800">{h}</li>)}
          </ul>
          <Link to={`/properties/${FEATURED.slug}`} className="btn btn-primary mt-8">View {FEATURED.name}</Link>
        </div>

        {/* Mobile: 1 wide photo + 2 small ones underneath the text.
            Desktop (lg): 1 tall photo on the left + 2 stacked on the right, 30rem high. */}
        <ul className="grid grid-cols-2 gap-3 lg:h-[30rem] lg:grid-rows-2">
          {preview.map((img, i) => (
            <li key={img.src}
              className={cn("relative overflow-hidden rounded-leaf-sm bg-ink-50",
                i === 0 ? "col-span-2 aspect-[16/10] lg:col-span-1 lg:row-span-2 lg:aspect-auto" : "aspect-[4/3] lg:aspect-auto")}>
              <button type="button" onClick={() => setViewer(i)} className="group block size-full"
                aria-label={`Open photo ${i + 1} of ${images.length}: ${img.alt}`}>
                <Media src={img.src} alt={img.alt} className="size-full transition duration-500 group-hover:scale-105" />
                {i === preview.length - 1 && extra > 0 && (
                  <span className="absolute inset-0 grid place-items-center bg-ink-900/55 font-display text-3xl font-extrabold text-white">+{extra}</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <Lightbox images={images} index={viewer} onIndexChange={setViewer} onClose={() => setViewer(null)} />
    </Section>
  );
}
