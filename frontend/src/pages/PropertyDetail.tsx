import { Link, useParams } from "react-router-dom";
import InquirySection from "../components/InquirySection";
import CommunityAmenities from "../components/property/CommunityAmenities";
import NearbyDropdowns from "../components/property/NearbyDropdowns";
import PropertyExplorer from "../components/property/PropertyExplorer";
import PropertyMap from "../components/property/PropertyMap";
import Icon from "../components/ui/Icon";
import Section from "../components/ui/Section";
import StateMessage from "../components/ui/StateMessage";
import { useQuote } from "../context/quote";
import { useRemote } from "../hooks/useRemote";
import { fetchProperty } from "../lib/api";
import { formatPesoCompact } from "../lib/format";
import type { PropertyDetail as PropertyData } from "../types";

export default function PropertyDetail() {
  const { slug = "" } = useParams();
  const { state, retry } = useRemote(() => fetchProperty(slug), [slug]);

  if (state.status === "loading") {
    return (
      <Section>
        <div aria-busy="true">
          <div className="h-10 w-2/3 animate-pulse rounded-full bg-ink-900/5" />
          <div className="mt-6 aspect-[16/10] animate-pulse rounded-leaf bg-ink-900/5" />
        </div>
      </Section>
    );
  }
  if (state.status === "error") {
    return (
      <Section>
        <StateMessage title="We couldn't open this property" message={state.message}
          action={<><button type="button" className="btn btn-dark" onClick={retry}>Try again</button><Link to="/properties" className="btn btn-ghost">All properties</Link></>} />
      </Section>
    );
  }
  return <Detail key={state.data.id} property={state.data} />;
}

function Detail({ property: p }: { property: PropertyData }) {
  const { openQuote } = useQuote();

  return (
    <>
      <div className="mx-auto w-full max-w-6xl px-4 pt-6 sm:px-8">
        <Link to="/properties" className="inline-flex items-center gap-1 text-sm font-semibold text-deca-700 hover:text-deca-500">
          <Icon name="chevron-left" className="size-4" /> All properties
        </Link>
      </div>

      <Section className="pb-6 pt-6 sm:pb-8 sm:pt-8">
        <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <ul className="flex flex-wrap gap-2">
              {p.vibes.map((v) => <li key={v} className="chip bg-blush capitalize text-deca-700">{v}</li>)}
            </ul>
            <h1 className="mt-3 font-display text-4xl font-extrabold sm:text-5xl">{p.name}</h1>
            <p className="mt-2 flex items-center gap-1.5 text-ink-600"><Icon name="pin" className="size-5" /> {p.address ?? p.location}</p>
            {p.tagline && <p className="mt-3 max-w-xl text-lg text-ink-700">{p.tagline}</p>}
          </div>
          <div className="rounded-leaf-sm bg-white p-5 shadow-soft ring-1 ring-ink-900/5">
            {p.price_from != null && (
              <>
                <p className="text-sm text-ink-500">Starting at</p>
                <p className="font-display text-3xl font-extrabold text-deca-600">{formatPesoCompact(p.price_from)}</p>
              </>
            )}
            <div className="mt-3 flex flex-wrap gap-2">
              <button type="button" className="btn btn-primary" onClick={() => openQuote({ slug: p.slug, name: p.name })}>Get a free quote</button>
              <a href="#inquire" className="btn btn-ghost">Send inquiry</a>
            </div>
          </div>
        </div>
      </Section>

      <Section className="pt-0 sm:pt-0">
        <h2 className="font-display text-2xl font-bold sm:text-3xl">About this Community</h2>
        <p className="mt-3 max-w-3xl whitespace-pre-line text-ink-700">{p.description}</p>
      </Section>

      {/* Order on the page: explorer, then community amenities, then the map and nearby places */}
      <PropertyExplorer property={p} />
      <CommunityAmenities amenities={p.amenities} />
      <PropertyMap name={p.name} address={p.address ?? p.location} latitude={p.latitude} longitude={p.longitude} />
      <NearbyDropdowns nearby={p.nearby} />

      <InquirySection propertySlug={p.slug} propertyName={p.name} />
    </>
  );
}
