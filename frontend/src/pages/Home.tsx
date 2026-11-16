import { Link } from "react-router-dom";
import CommunitiesRail from "../components/home/CommunitiesRail";
import FeaturedCommunity from "../components/home/FeaturedCommunity";
import ProcessTiles from "../components/home/ProcessTiles";
import SearchBar from "../components/SearchBar";
import { useQuote } from "../context/quote";
import { FEATURED } from "../data/site";

export default function Home() {
  const { openQuote } = useQuote();
  const cover = FEATURED.images[0]; // the first featured photo is the hero cover

  return (
    <>
      {/* 2. Hero: your photo, a LIGHT white fade on the text side (no dark overlay), search card riding over the edge */}
      <section className="relative isolate overflow-hidden rounded-b-[2.5rem] lg:rounded-b-[3.5rem]">
        <img src={cover.src} alt="" aria-hidden="true" fetchPriority="high" className="absolute inset-0 -z-10 size-full object-cover object-right" />
        <div aria-hidden="true"
          className="absolute inset-0 -z-10 bg-linear-to-b from-white/90 via-white/75 to-white/30 lg:bg-linear-to-r lg:from-white/95 lg:via-white/75 lg:to-white/0" />
        <div className="mx-auto max-w-6xl px-4 pb-44 pt-12 sm:px-8 sm:pb-52 sm:pt-20 lg:pt-28">
          <p className="animate-rise chip bg-deca-600 px-4 py-1.5 text-sm text-white">Start your journey</p>
          <h1 className="animate-rise mt-5 max-w-2xl font-display text-[2.7rem] font-extrabold leading-[1.02] text-ink-900 sm:text-6xl lg:text-7xl" style={{ animationDelay: "0.1s" }}>
            Home, built around your <span className="text-deca-600">family.</span>
          </h1>
          <p className="animate-rise mt-5 max-w-xl text-base text-ink-700 sm:text-lg" style={{ animationDelay: "0.2s" }}>
            Browse DECA HOMES communities, compare studio to 3-bedroom units, and get a free quote in minutes.
          </p>
          <div className="animate-rise mt-8 flex flex-wrap gap-3" style={{ animationDelay: "0.3s" }}>
            <button type="button" className="btn btn-primary" onClick={() => openQuote()}>Get a free quote</button>
            <Link to="/properties" className="btn btn-ghost">Browse properties</Link>
          </div>
        </div>
      </section>

      <div className="relative z-10 -mt-32 px-4 sm:-mt-40 sm:px-8">
        <SearchBar />
      </div>

      {/* 3. Processes  4. Featured community  5. Communities.  (6. Meet Kriza lives in the Footer) */}
      <ProcessTiles />
      <FeaturedCommunity />
      <CommunitiesRail />
    </>
  );
}
