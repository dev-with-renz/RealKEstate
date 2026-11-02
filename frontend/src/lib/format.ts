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
