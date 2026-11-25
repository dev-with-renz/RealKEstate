import { FEATURED, PRIORITY_SLUGS } from "../data/site";

/** Put Ortigas in the featured section only, then Cubao and Manila before other communities. */
export function arrangeCommunities<
  T extends { slug: string; name?: string; location?: string },
>(list: T[]): T[] {
  const matches = (property: T, term: string) =>
    `${property.slug} ${property.name ?? ""} ${property.location ?? ""}`
      .toLowerCase()
      .includes(term);
  const isFeatured = (property: T) =>
    property.slug === FEATURED.slug || (matches(property, "ortigas") && matches(property, "urban deca"));
  const rank = (property: T) => {
    const i = PRIORITY_SLUGS.indexOf(property.slug);
    return i === -1 ? PRIORITY_SLUGS.length : i; // not in the list -> after the priority ones
  };
  return list
    .filter((property) => !isFeatured(property))
    .sort((a, b) => {
      const priority = (property: T) => {
        if (rank(property) < PRIORITY_SLUGS.length) return rank(property);
        if (matches(property, "cubao")) return 0;
        if (matches(property, "manila")) return 1;
        return PRIORITY_SLUGS.length;
      };
      return priority(a) - priority(b);
    });
}

/** 3-column desktop grid looks balanced only with 3, 6, 9... cards. 5 cards -> 3. */
export function trimToRows<T>(list: T[], perRow = 3): T[] {
  const full = Math.floor(list.length / perRow) * perRow;
  return full === 0 ? list : list.slice(0, full);
}
