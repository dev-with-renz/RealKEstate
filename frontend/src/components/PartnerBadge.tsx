import type { Partner } from "../data/site";

export default function PartnerBadge({ partner }: { partner: Partner }) {
  return (
    <li className="flex min-h-24 flex-col items-center justify-center gap-1 rounded-leaf-sm bg-white px-4 py-5 text-center shadow-soft ring-1 ring-ink-900/5">
      {partner.logo ? (
        <img src={partner.logo} alt={partner.name} loading="lazy" className="h-9 w-auto object-contain" />
      ) : (
        <span className="font-display text-xl font-extrabold text-ink-800">{partner.name}</span>
      )}
      <span className="text-xs text-ink-500">{partner.kind}</span>
    </li>
  );
}
