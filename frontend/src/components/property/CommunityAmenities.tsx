import { useEffect, useState } from "react";
import type { Amenity } from "../../types";
import Icon, { type IconName } from "../ui/Icon";
import Section from "../ui/Section";

// Amenity.icon (set in the database / seed) -> the drawing shown. Unknown or empty icons fall back to a sparkle.
const AMENITY_ICONS: Record<string, IconName> = {
  pool: "pool", court: "court", garden: "garden", gym: "gym", playground: "playground",
  shield: "shield", mall: "bag", home: "home", room: "building",
  park: "park", lagoon: "lagoon", clubhouse: "clubhouse", basketball: "basketball",
  "jogging-path": "jogging-path", "outdoor-gym": "outdoor-gym", "security-cctv": "security-cctv",
  commercial: "commercial", elevator: "elevator", cafeteria: "cafeteria",
  parking: "parking", concierge: "concierge",
};

/** How many tiles fit on one line at most: phones 2, tablets 3, desktop 4 (same breakpoints Tailwind uses: sm 640px, lg 1024px). */
function useMaxPerRow(): number {
  const read = () => (window.matchMedia("(min-width: 1024px)").matches ? 4 : window.matchMedia("(min-width: 640px)").matches ? 3 : 2);
  const [max, setMax] = useState(read);
  useEffect(() => {
    const queries = [window.matchMedia("(min-width: 640px)"), window.matchMedia("(min-width: 1024px)")];
    const update = () => setMax(read());
    queries.forEach((q) => q.addEventListener("change", update));
    return () => queries.forEach((q) => q.removeEventListener("change", update));
  }, []);
  return max;
}

/** Split the list into evenly filled rows instead of "full rows plus one leftover".
 *  Works out the fewest rows that fit, then shares the tiles between them (extra tiles go to the top rows):
 *    max 4 per row:  7 -> 4 + 3     6 -> 3 + 3     5 -> 3 + 2     8 -> 4 + 4     9 -> 3 + 3 + 3     4 -> 4 */
export function balanceRows<T>(items: T[], maxPerRow: number): T[][] {
  if (items.length === 0) return [];
  const rowCount = Math.ceil(items.length / maxPerRow);
  const base = Math.floor(items.length / rowCount);
  const extra = items.length % rowCount; // this many rows get one extra tile
  const rows: T[][] = [];
  let start = 0;
  for (let r = 0; r < rowCount; r++) {
    const size = base + (r < extra ? 1 : 0);
    rows.push(items.slice(start, start + size));
    start += size;
  }
  return rows;
}

/** Its own compact section right after the Property explorer. The heading sits outside the panel, on the left,
 *  at the same size as "How to Find Us". Hidden when the property has no amenities. */
export default function CommunityAmenities({ amenities }: { amenities: Amenity[] }) {
  const maxPerRow = useMaxPerRow();
  if (amenities.length === 0) return null;
  const rows = balanceRows(amenities, maxPerRow);

  return (
    <Section className="pt-0 sm:pt-0">
      <h2 className="font-display text-2xl font-bold sm:text-3xl">Community Amenities</h2>

      <div className="mt-6 grid gap-3 rounded-leaf-sm bg-lagoon-400/10 p-4 sm:gap-4 sm:p-6">
        {rows.map((row, r) => (
          // Each line is centered, so a shorter line sits in the middle under the longer one
          <ul key={r} className="flex justify-center gap-3 sm:gap-4">
            {row.map((a) => (
              // Icon on top, name right below it, both centered. Fixed width keeps every tile the same size.
              <li key={a.name} className="flex w-[7.5rem] flex-col items-center gap-2 rounded-2xl bg-white p-3 text-center shadow-soft ring-1 ring-ink-900/5 sm:w-36 sm:p-4 lg:w-44">
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-lagoon-500 text-white">
                  <Icon name={AMENITY_ICONS[a.icon ?? ""] ?? "sparkle"} className="size-5" />
                </span>
                <span className="text-sm font-semibold leading-snug text-ink-800">{a.name}</span>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </Section>
  );
}
