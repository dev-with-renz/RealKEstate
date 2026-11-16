const peso = new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP", maximumFractionDigits: 0 });

export const formatPeso = (n: number) => peso.format(n);

/** 2,650,000 -> "₱2.65M" */
export function formatPesoCompact(n: number): string {
  if (n >= 1_000_000) return `₱${(n / 1_000_000).toFixed(2).replace(/\.?0+$/, "")}M`;
  if (n >= 1_000) return `₱${Math.round(n / 1_000)}K`;
  return formatPeso(n);
}

export const unitLabel = (bedrooms: number) => (bedrooms === 0 ? "Studio" : `${bedrooms} Bedroom`);
export const unitShort = (bedrooms: number) => (bedrooms === 0 ? "Studio" : `${bedrooms}BR`);

/** (24, 24) -> "24 sqm"   (24, 27.5) -> "24 to 27.5 sqm"   (null, null) -> null */
export function formatArea(min: number | null, max: number | null): string | null {
  if (min == null && max == null) return null;
  const lo = min ?? max!;
  const hi = max ?? min!;
  return lo === hi ? `${lo} sqm` : `${lo} to ${hi} sqm`;
}
