import { FEATURED, PRIORITY_SLUGS } from "../data/site";

/** Put the priority communities first, hide the featured one (it already has its own section).
 *  Everything else keeps the order the API gave us (sort_order, then name). */
export function arrangeCommunities<T extends { slug: string }>(list: T[]): T[] {
  const rank = (slug: string) => {
    const i = PRIORITY_SLUGS.indexOf(slug);
    return i === -1 ? PRIORITY_SLUGS.length : i; // not in the list -> after the priority ones
  };
  return list.filter((p) => p.slug !== FEATURED.slug).sort((a, b) => rank(a.slug) - rank(b.slug));
}

/** 3-column desktop grid looks balanced only with 3, 6, 9... cards. 5 cards -> 3. */
export function trimToRows<T>(list: T[], perRow = 3): T[] {
  const full = Math.floor(list.length / perRow) * perRow;
  return full === 0 ? list : list.slice(0, full);
}
