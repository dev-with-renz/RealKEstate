import type { PropertyQuery } from "./api"
import { PRICE_KEYS, UNIT_KEYS, type SearchValues } from "./schemas"

export const UNIT_FILTERS = [
  { value: "any", label: "Any unit" },
  { value: "0", label: "Studio" },
  { value: "1", label: "1 Bedroom" },
  { value: "2", label: "2 Bedroom" },
] as const;

export const PRICE_RANGES = [
  { value: "any", label: "Any price" },
  { value: "lt2", label: "Below ₱2M", max: 2_000_000 },
  { value: "2to3", label: "₱2M to ₱3M", min: 2_000_000, max: 3_000_000 },
  { value: "3to5", label: "₱3M to ₱5M", min: 3_000_000, max: 5_000_000 },
  { value: "gt5", label: "₱5M and up", min: 5_000_000 },
] as const;

export const EMPTY_SEARCH: SearchValues = { query: "", location: "", unitType: "any", priceRange: "any" };

/** Form values -> URL (?q=&location=&bedrooms=&price=). The URL is the single source of truth,
 *  so results are shareable and the Back button works. */
export function toSearchParams(v: SearchValues): URLSearchParams {
  const sp = new URLSearchParams();
  if (v.query) sp.set("q", v.query);
  if (v.location) sp.set("location", v.location);
  if (v.unitType !== "any") sp.set("bedrooms", v.unitType);
  if (v.priceRange !== "any") sp.set("price", v.priceRange);
  return sp;
}

export function fromSearchParams(sp: URLSearchParams): SearchValues {
  const unit = sp.get("bedrooms");
  const price = sp.get("price");
  return {
    query: sp.get("q") ?? "",
    location: sp.get("location") ?? "",
    unitType: UNIT_KEYS.find((k) => k === unit) ?? "any",
    priceRange: PRICE_KEYS.find((k) => k === price) ?? "any",
  };
}

/** Form values -> the query the API understands. */
export function toApiQuery(v: SearchValues): PropertyQuery {
  const range = PRICE_RANGES.find((r) => r.value === v.priceRange);
  const query: PropertyQuery = {};
  if (v.query) query.q = v.query;
  if (v.location) query.location = v.location;
  if (v.unitType !== "any") query.bedrooms = Number(v.unitType);
  if (range && "min" in range) query.min_price = range.min;
  if (range && "max" in range) query.max_price = range.max;
  return query;
}
