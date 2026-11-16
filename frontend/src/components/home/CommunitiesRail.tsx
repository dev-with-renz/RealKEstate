import { Link } from "react-router-dom";
import { useRemote } from "../../hooks/useRemote";
import { fetchProperties } from "../../lib/api";
import { arrangeCommunities, trimToRows } from "../../lib/properties";
import PropertyCard from "../PropertyCard";
import Section from "../ui/Section";
import StateMessage from "../ui/StateMessage";

export default function CommunitiesRail() {
  // 1) ask the API for up to 12 properties
  const { state, retry } = useRemote(() => fetchProperties({ limit: 12 }), []);

  // 2) UDH Cubao + UDH Manila first, hide the featured one, keep at most 6, make rows of 3 balanced
  const list = state.status === "ready" ? trimToRows(arrangeCommunities(state.data).slice(0, 6)) : [];

  return (
    <Section>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl font-extrabold sm:text-4xl">Our communities</h2>
          <p className="mt-2 text-ink-600">Swipe to explore, then open one for photos, units and nearby places.</p>
        </div>
        <Link to="/properties" className="btn btn-ghost">View all properties</Link>
      </div>

      <div className="mt-8">
        {state.status === "loading" && (
          <div className="grid gap-4 md:grid-cols-3" aria-busy="true">
            {[0, 1, 2].map((i) => <div key={i} className="h-96 animate-pulse rounded-leaf bg-ink-900/5" />)}
          </div>
        )}
        {state.status === "error" && (
          <StateMessage title="We couldn't load properties" message={state.message}
            action={<button type="button" className="btn btn-dark" onClick={retry}>Try again</button>} />
        )}
        {state.status === "ready" && list.length === 0 && (
          <StateMessage title="No properties yet" message="Check back soon, new communities are on the way." />
        )}
        {list.length > 0 && (
          /* Phones: one horizontal row you swipe (flex + overflow-x-auto + snap).
             Desktop (lg): the SAME list becomes a 3-column grid with equal gaps and no scrolling. */
          <ul className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:-mx-8 sm:px-8 lg:mx-0 lg:grid lg:grid-cols-3 lg:gap-6 lg:overflow-visible lg:px-0 lg:pb-0">
            {list.map((p) => (
              <li key={p.id} className="w-[82%] shrink-0 snap-center sm:w-[52%] lg:w-auto">
                <PropertyCard property={p} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </Section>
  );
}
