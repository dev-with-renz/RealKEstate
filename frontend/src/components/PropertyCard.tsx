import { Link } from "react-router-dom"
import { formatPesoCompact, unitShort } from "../lib/format"
import type { PropertySummary } from "../types"
import Icon from "./ui/Icon"
import Media from "./ui/Media"

export default function PropertyCard({ property: p }: { property: PropertySummary }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-leaf bg-white shadow-soft ring-1 ring-ink-900/5">
      <Link to={`/properties/${p.slug}`} className="relative block aspect-[4/3]" aria-label={`View ${p.name}`}>
        <Media src={p.cover_image} alt={`${p.name} exterior`} className="size-full" />
        <ul className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {p.vibes.slice(0, 2).map((v) => (
            <li key={v} className="chip bg-white/90 capitalize text-deca-700 backdrop-blur">{v}</li>
          ))}
        </ul>
        {p.price_from != null && (
          <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-ink-950/85 to-transparent px-5 pb-4 pt-12 text-white">
            <span className="text-xs text-ink-200">Starting at</span>
            <span className="block font-display text-2xl font-extrabold">{formatPesoCompact(p.price_from)}</span>
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <h3 className="font-display text-xl font-bold leading-tight">
            <Link to={`/properties/${p.slug}`} className="hover:text-deca-600">{p.name}</Link>
          </h3>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-ink-500">
            <Icon name="pin" className="size-4 shrink-0" /> {p.location}
          </p>
        </div>
        {p.tagline && <p className="text-sm text-ink-600">{p.tagline}</p>}
        <ul className="mt-auto flex flex-wrap items-center gap-2 pt-1">
          {p.bedrooms.map((b) => (
            <li key={b} className="chip bg-blush text-deca-700">{unitShort(b)}</li>
          ))}
          {p.available_units > 0 && (
            <li className="chip bg-lagoon-400/15 text-ink-800">
              <span className="size-1.5 rounded-full bg-lagoon-500" /> {p.available_units} available
            </li>
          )}
        </ul>
      </div>
    </article>
  );
}
