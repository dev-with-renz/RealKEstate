import Icon, { type IconName } from "../ui/Icon";
import Section from "../ui/Section";

// The order the groups appear in, and an icon for each. The names must match what the API sends
// (NEARBY_LABELS in backend services/catalog.py). Unknown groups go last with a pin icon.
const ORDER = ["Transit & Major Road Access", "Primary Needs", "Malls", "Schools", "Hospitals", "Government Agencies"];
const ICONS: Record<string, IconName> = {
  "Transit & Major Road Access": "bus",
  "Primary Needs": "cart",
  Malls: "bag",
  Schools: "school",
  Hospitals: "hospital",
  "Government Agencies": "landmark",
};

const rank = (group: string) => {
  const i = ORDER.indexOf(group);
  return i === -1 ? ORDER.length : i;
};

/** One dropdown per category (native <details>, no state needed). All closed until the visitor opens one. */
export default function NearbyDropdowns({ nearby }: { nearby: Record<string, string[]> }) {
  const groups = Object.entries(nearby).sort(([a], [b]) => rank(a) - rank(b));
  if (groups.length === 0) return null;

  return (
    <Section className="pt-0 sm:pt-0">
      <h2 className="font-display text-2xl font-bold sm:text-3xl">Nearby Locations</h2>
      {/* Phones: one column. Desktop: two columns; items-start keeps a closed card from stretching to its open neighbour. */}
      <div className="mt-6 grid gap-3 lg:grid-cols-2 lg:items-start">
        {groups.map(([group, places]) => (
          <details key={group} className="group rounded-2xl bg-white p-4 shadow-soft ring-1 ring-ink-900/5 open:ring-deca-300 sm:p-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
              <span className="flex items-center gap-3 font-display text-lg font-bold">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-blush text-deca-600"><Icon name={ICONS[group] ?? "pin"} className="size-5" /></span>
                {group}
                <span className="chip bg-ink-50 text-ink-600">{places.length}</span>
              </span>
              <Icon name="chevron-down" className="size-5 shrink-0 text-deca-600 transition group-open:rotate-180" />
            </summary>
            <ul className="mt-4 grid gap-2 border-t border-ink-900/10 pt-4 text-ink-700">
              {places.map((place) => <li key={place} className="flex items-start gap-3"><span className="mt-2 size-1.5 shrink-0 rounded-full bg-deca-500" />{place}</li>)}
            </ul>
          </details>
        ))}
      </div>
    </Section>
  );
}
