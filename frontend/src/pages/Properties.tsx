import { Link, useSearchParams } from "react-router-dom";
import PropertyCard from "../components/PropertyCard";
import SearchBar from "../components/SearchBar";
import PageHeader from "../components/ui/PageHeader";
import Section from "../components/ui/Section";
import StateMessage from "../components/ui/StateMessage";
import { useRemote } from "../hooks/useRemote";
import { fetchProperties } from "../lib/api";
import { fromSearchParams, toApiQuery } from "../lib/search";

export default function Properties() {
  const [params] = useSearchParams();
  const key = params.toString();
  const values = fromSearchParams(params);
  const { state, retry } = useRemote(() => fetchProperties(toApiQuery(values)), [key]);

  return (
    <>
      <PageHeader title="Properties">Search by name, building, unit, location or price. Results update as you search.</PageHeader>
      <div className="relative z-10 -mt-8 px-4 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <SearchBar key={key} defaults={values} variant="inline" />
        </div>
      </div>

      <Section>
        {state.status === "loading" && (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3" aria-busy="true">
            {[0, 1, 2].map((i) => <div key={i} className="h-96 animate-pulse rounded-leaf bg-ink-900/5" />)}
          </div>
        )}
        {state.status === "error" && (
          <StateMessage title="We couldn't load properties" message={state.message}
            action={<button type="button" className="btn btn-dark" onClick={retry}>Try again</button>} />
        )}
        {state.status === "ready" && state.data.length === 0 && (
          <StateMessage title="No matches yet" message="Try a different location, unit type or price range."
            action={<Link to="/properties" className="btn btn-dark">Clear search</Link>} />
        )}
        {state.status === "ready" && state.data.length > 0 && (
          <>
            <p className="mb-6 text-sm font-semibold text-ink-600" aria-live="polite">
              {state.data.length} {state.data.length === 1 ? "property" : "properties"} found
            </p>
            <ul className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {state.data.map((p) => <li key={p.id}><PropertyCard property={p} /></li>)}
            </ul>
          </>
        )}
      </Section>
    </>
  );
}
