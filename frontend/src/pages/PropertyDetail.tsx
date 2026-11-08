import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import InquirySection from "../components/InquirySection";
import Carousel from "../components/ui/Carousel";
import Icon, { type IconName } from "../components/ui/Icon";
import Pill from "../components/ui/Pill";
import Section from "../components/ui/Section";
import StateMessage from "../components/ui/StateMessage";
import { useQuote } from "../context/quote";
import { useRemote } from "../hooks/useRemote";
import { fetchProperty } from "../lib/api";
import { cn } from "../lib/cn";
import { formatPeso, formatPesoCompact } from "../lib/format";
import type { PropertyDetail as PropertyData } from "../types";

type Stage = "property" | "building" | "unit";

const NEARBY_ICONS: Record<string, IconName> = {
  Schools: "school",
  Hospitals: "hospital",
  "Government Agencies": "landmark",
  "Primary Needs": "cart",
  Malls: "bag",
};

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

function StageTab({ label, value, active, disabled, onClick }: { label: string; value: string; active: boolean; disabled?: boolean; onClick: () => void }) {
  return (
    <button type="button" role="tab" aria-selected={active} disabled={disabled} onClick={onClick}
      className={cn("min-w-0 flex-1 rounded-xl px-3 py-2 text-left transition disabled:opacity-40", active ? "bg-linear-to-r from-deca-500 to-ember-500 text-white shadow-glow" : "hover:bg-blush")}>
      <span className={cn("block text-xs", active ? "text-white/80" : "text-ink-500")}>{label}</span>
      <span className="block truncate text-sm font-bold">{value}</span>
    </button>
  );
}

function Detail({ property: p }: { property: PropertyData }) {
  const { openQuote } = useQuote();
  const [stage, setStage] = useState<Stage>("property");
  const [buildingId, setBuildingId] = useState<number | undefined>(p.buildings[0]?.id);
  const building = p.buildings.find((item) => item.id === buildingId) ?? p.buildings[0];
  const [unitTypeId, setUnitTypeId] = useState<number | undefined>(building?.unit_types[0]?.id);
  const unit = building?.unit_types.find((item) => item.id === unitTypeId) ?? building?.unit_types[0];

  const gallery = stage === "property" ? p.images : stage === "building" ? (building?.images ?? []) : (unit?.images ?? []);
  const galleryAlt = stage === "property" ? p.name : stage === "building" ? `${p.name}, ${building?.name}` : `${p.name}, ${building?.name}, ${unit?.name}`;
  const nearby = Object.entries(p.nearby);

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
        <h2 className="font-display text-2xl font-bold sm:text-3xl">About this community</h2>
        <p className="mt-3 max-w-3xl whitespace-pre-line text-ink-700">{p.description}</p>
        {p.amenities.length > 0 && (
          <>
            <h3 className="mt-6 font-display text-lg font-bold">Community amenities</h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {p.amenities.map((a) => <li key={a} className="chip bg-blush text-deca-700">{a}</li>)}
            </ul>
          </>
        )}
      </Section>

      {/* Property > Building > Unit explorer: each level has its own swipeable pictures */}
      <Section className="pt-0 sm:pt-0">
        <div className="grid gap-6 lg:grid-cols-[3fr_2fr]">
          <Carousel key={`${stage}-${building?.id}-${unit?.id}`} images={gallery} alt={galleryAlt} aspect="aspect-[4/3] sm:aspect-[16/10]" />

          <div className="flex flex-col gap-4">
            <div role="tablist" aria-label="Browse by level" className="flex gap-1 rounded-2xl bg-white p-1.5 shadow-soft ring-1 ring-ink-900/5">
              <StageTab label="Property" value={p.name} active={stage === "property"} onClick={() => setStage("property")} />
              <StageTab label="Building" value={building?.name ?? "None"} active={stage === "building"} disabled={!building} onClick={() => setStage("building")} />
              <StageTab label="Unit" value={unit?.name ?? "None"} active={stage === "unit"} disabled={!unit} onClick={() => setStage("unit")} />
            </div>

            {stage !== "property" && p.buildings.length > 1 && (
              <div className="flex flex-wrap gap-2" role="group" aria-label="Choose a building">
                {p.buildings.map((item) => (
                  <Pill key={item.id} active={item.id === building?.id} onClick={() => { setBuildingId(item.id); setUnitTypeId(item.unit_types[0]?.id); }}>{item.name}</Pill>
                ))}
              </div>
            )}
            {stage === "unit" && building && (
              <div className="flex flex-wrap gap-2" role="group" aria-label="Choose a unit type">
                {building.unit_types.map((u) => <Pill key={u.id} active={u.id === unit?.id} onClick={() => setUnitTypeId(u.id)}>{u.name}</Pill>)}
              </div>
            )}

            <div className="rounded-leaf-sm bg-blush p-5">
              {stage === "property" && (
                <dl className="grid grid-cols-3 gap-3 text-center">
                  <div><dt className="text-xs text-ink-500">Buildings</dt><dd className="font-display text-2xl font-extrabold">{p.building_count}</dd></div>
                  <div><dt className="text-xs text-ink-500">Available</dt><dd className="font-display text-2xl font-extrabold">{p.available_units}</dd></div>
                  <div><dt className="text-xs text-ink-500">From</dt><dd className="font-display text-2xl font-extrabold">{p.price_from != null ? formatPesoCompact(p.price_from) : "N/A"}</dd></div>
                </dl>
              )}
              {stage === "building" && building && (
                <>
                  <h3 className="font-display text-xl font-bold">{building.name}</h3>
                  <p className="mt-2 text-ink-700">{building.description}</p>
                  {building.floors && <p className="mt-3 text-sm font-semibold text-deca-700">{building.floors} floors</p>}
                </>
              )}
              {stage === "unit" && unit && (
                <>
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="font-display text-xl font-bold">{unit.name}</h3>
                    <p className="font-display text-xl font-extrabold text-deca-600">{unit.price != null ? formatPeso(unit.price) : "Ask for price"}</p>
                  </div>
                  <p className="mt-2 text-ink-700">{unit.description}</p>
                  <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm font-semibold text-deca-700">
                    {unit.floor_area_sqm && <span>{unit.floor_area_sqm} sqm</span>}
                    <span>{unit.bathrooms} bath</span>
                    <span>{unit.available_units} available</span>
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </Section>

      {building && unit && (
        <Section className="pt-0 sm:pt-0">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">Amenities</h2>
          <p className="mt-2 text-ink-600">Pick a unit type to see what comes with it.</p>
          <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Unit type amenities">
            {building.unit_types.map((u) => <Pill key={u.id} active={u.id === unit.id} onClick={() => setUnitTypeId(u.id)}>{u.name}</Pill>)}
          </div>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {unit.amenities.map((a) => (
              <li key={a} className="flex items-start gap-3 rounded-2xl bg-white p-4 shadow-soft ring-1 ring-ink-900/5">
                <Icon name="check" className="mt-0.5 size-5 shrink-0 text-lagoon-500" strokeWidth={2.4} />
                {a}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {nearby.length > 0 && (
        <Section className="pt-0 sm:pt-0">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">Nearby locations</h2>
          <div className="mt-6 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {nearby.map(([group, places]) => (
              <div key={group}>
                <h3 className="flex items-center gap-2 font-display text-xl font-bold">
                  <span className="grid size-9 place-items-center rounded-full bg-blush text-deca-600"><Icon name={NEARBY_ICONS[group] ?? "pin"} className="size-5" /></span>
                  {group}
                </h3>
                <ul className="mt-3 grid gap-2 border-l-2 border-deca-200 pl-4 text-ink-700">
                  {places.map((place) => <li key={place}>{place}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </Section>
      )}

      <InquirySection propertySlug={p.slug} propertyName={p.name} />
    </>
  );
}
