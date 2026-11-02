import { Link } from "react-router-dom";
import PartnerBadge from "../components/PartnerBadge.tsx";
import PropertyCard from "../components/PropertyCard";
import SearchBar from "../components/SearchBar";
import VibeShowcase from "../components/VibeShowcase";
import Icon from "../components/ui/Icon";
import Section from "../components/ui/Section";
import StateMessage from "../components/ui/StateMessage";
import { useQuote } from "../context/quote";
import { CONTACT, PARTNERS, WHY } from "../data/site";
import { useRemote } from "../hooks/useRemote";
import { fetchProperties } from "../lib/api";
import { cn } from "../lib/cn";

const UNIT_TILES = [
  { to: "/properties?bedrooms=0", title: "Studio", note: "Smart and compact", tone: "rounded-leaf bg-linear-to-br from-deca-500 to-ember-500 text-white shadow-glow" },
  { to: "/properties?bedrooms=1", title: "1 Bedroom", note: "Space for two", tone: "neon-edge rounded-leaf-alt bg-ink-900 text-white" },
  { to: "/properties?bedrooms=2", title: "2 Bedroom", note: "Room to grow", tone: "rounded-leaf bg-blush text-deca-800" },
];

export default function Home() {
  const { openQuote } = useQuote();
  const featured = useRemote(() => fetchProperties({ limit: 6 }), []);

  return (
    <>
      {/* Hero: the one bold moment. Night skyline, glowing windows, search card riding over the edge. */}
      <section className="relative isolate overflow-hidden rounded-b-[2.5rem] bg-ink-900 text-white lg:rounded-b-[3.5rem]">
        <img src="/images/hero-skyline.svg" alt="" aria-hidden="true" className="absolute inset-0 -z-10 size-full object-cover" />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-b from-ink-950/70 via-ink-950/15 to-ink-950/85" />
        <div className="mx-auto max-w-6xl px-4 pb-44 pt-14 sm:px-8 sm:pb-52 sm:pt-24 lg:pt-32">
          <p className="animate-rise inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold text-ember-300 backdrop-blur">
            <span className="size-2 rounded-full bg-lagoon-400 shadow-[0_0_12px_var(--color-lagoon-400)]" />
            Now showing DECA HOMES communities
          </p>
          <h1 className="animate-rise mt-6 max-w-3xl font-display text-[2.7rem] font-extrabold leading-[1.02] sm:text-6xl lg:text-7xl" style={{ animationDelay: "0.1s" }}>
            Homes that fit your life and your budget.
          </h1>
          <p className="animate-rise mt-5 max-w-xl text-base text-ink-100 sm:text-lg" style={{ animationDelay: "0.2s" }}>
            Browse communities, compare studio, 1-bedroom and 2-bedroom units, and get a free quote in minutes.
          </p>
          <div className="animate-rise mt-8 flex flex-wrap gap-3" style={{ animationDelay: "0.3s" }}>
            <Link to="/properties" className="btn btn-primary">Browse properties</Link>
            <button type="button" className="btn btn-light" onClick={() => openQuote()}>Get a free quote</button>
          </div>
        </div>
      </section>

      <div className="relative z-10 -mt-32 px-4 sm:-mt-40 sm:px-8">
        <SearchBar />
      </div>

      <Section className="pb-4 sm:pb-6">
        <h2 className="font-display text-3xl font-extrabold sm:text-4xl">Start with the size you need</h2>
        <ul className="mt-6 grid gap-4 md:grid-cols-3">
          {UNIT_TILES.map((t) => (
            <li key={t.title}>
              <Link to={t.to} className={cn("relative flex min-h-40 flex-col justify-end overflow-hidden p-6 transition active:scale-[0.99]", t.tone)}>
                <Icon name="bed" className="absolute right-5 top-5 size-14 opacity-30" strokeWidth={1.4} />
                <span className="font-display text-3xl font-extrabold">{t.title}</span>
                <span className="text-sm opacity-80">{t.note}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <Section>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl font-extrabold sm:text-4xl">Featured communities</h2>
            <p className="mt-2 text-ink-600">Swipe to explore, then open one for photos, units and nearby places.</p>
          </div>
          <Link to="/properties" className="btn btn-ghost">View all properties</Link>
        </div>

        <div className="mt-8">
          {featured.state.status === "loading" && (
            <div className="grid gap-4 md:grid-cols-3" aria-busy="true">
              {[0, 1, 2].map((i) => <div key={i} className="h-96 animate-pulse rounded-leaf bg-ink-900/5" />)}
            </div>
          )}
          {featured.state.status === "error" && (
            <StateMessage title="We couldn't load properties" message={featured.state.message}
              action={<button type="button" className="btn btn-dark" onClick={featured.retry}>Try again</button>} />
          )}
          {featured.state.status === "ready" && featured.state.data.length === 0 && (
            <StateMessage title="No properties yet" message="Check back soon, new communities are on the way." />
          )}
          {featured.state.status === "ready" && featured.state.data.length > 0 && (
            <ul className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:-mx-8 sm:px-8 lg:mx-0 lg:grid lg:grid-cols-3 lg:overflow-visible lg:px-0">
              {featured.state.data.map((p) => (
                <li key={p.id} className="w-[82%] shrink-0 snap-center sm:w-[52%] lg:w-auto">
                  <PropertyCard property={p} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </Section>

      <VibeShowcase />

      <Section>
        <div className="grid gap-8 lg:grid-cols-[5fr_6fr] lg:items-center">
          <div className="bg-glow rounded-leaf p-8 text-white sm:p-12">
            <h2 className="font-display text-4xl font-extrabold sm:text-5xl">Good homes should not be out of reach.</h2>
            <p className="mt-4 text-ink-200">DECA HOMES plans communities around real budgets and real routines.</p>
            <Link to="/about" className="btn btn-primary mt-7">About DECA HOMES</Link>
          </div>
          <ul className="divide-y divide-ink-900/10">
            {WHY.map((w) => (
              <li key={w.title} className="flex gap-4 py-6 first:pt-0 last:pb-0">
                <span className="grid size-12 shrink-0 place-items-center rounded-leaf-sm bg-blush text-deca-600">
                  <Icon name={w.icon} className="size-6" />
                </span>
                <div>
                  <h3 className="font-display text-xl font-bold">{w.title}</h3>
                  <p className="mt-1 text-ink-600">{w.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl font-extrabold sm:text-4xl">Pay your way</h2>
            <p className="mt-2 max-w-lg text-ink-600">Pay through our partner banks and e-wallets.</p>
          </div>
          <Link to="/payment-guide" className="btn btn-dark">Read the payment guide</Link>
        </div>
        <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {PARTNERS.map((p) => <PartnerBadge key={p.name} partner={p} />)}
        </ul>
      </Section>

      <Section className="pb-8 sm:pb-8">
        <div className="bg-glow neon-edge rounded-leaf-alt p-8 text-white sm:p-12">
          <h2 className="max-w-2xl font-display text-3xl font-extrabold sm:text-5xl">Not sure which unit fits? Get a free estimate.</h2>
          <p className="mt-3 max-w-xl text-ink-200">Share your budget and preferred location. We will do the math with you, no obligation.</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <button type="button" className="btn btn-primary" onClick={() => openQuote()}>Get a free quote</button>
            <a href={CONTACT.phoneHref} className="btn btn-light"><Icon name="phone" className="size-5" /> {CONTACT.phone}</a>
          </div>
        </div>
      </Section>
    </>
  );
}
