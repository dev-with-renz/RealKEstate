import { KRIZA } from "../../data/site";

/** Shows Kriza's real photo when KRIZA.photo is set in data/site.ts, otherwise a friendly cartoon. */
export default function KrizaPortrait({ className }: { className?: string }) {
  if (KRIZA.photo) {
    return <img src={KRIZA.photo} alt={`${KRIZA.name}, real estate agent`} className={className} loading="lazy" />;
  }
  return (
    <svg viewBox="0 0 320 360" role="img" aria-label="Illustration of Kriza smiling and waving, wearing a charcoal blazer and white top" className={className}>
      <circle cx="160" cy="185" r="150" fill="#FDECEC" />

      {/* Hair, back layer: chin-length bob (head is scaled up and moved down to shorten the neck) */}
      <g transform="translate(0 16) translate(160 200) scale(1.18) translate(-160 -200)">
        <path d="M160 48C112 48 100 96 104 140C106 175 100 200 112 214C126 224 140 214 146 200L174 200C180 214 196 224 214 214C226 204 216 175 218 140C222 96 208 48 160 48Z" fill="#2B1F1C" />
      </g>

      {/* Short neck */}
      <path d="M145 196H175L178 242H142Z" fill="#F7D9C4" />

      {/* Blazer (charcoal), narrower torso */}
      <path d="M62 360L64 292Q68 256 100 246L142 232H178L220 246Q252 256 256 292L258 360Z" fill="#3E434B" />
      {/* Chest skin and white top */}
      <path d="M142 232H178L194 282H126Z" fill="#F7D9C4" />
      <ellipse cx="160" cy="236" rx="20" ry="6" fill="#ffc0ad" opacity=".55" />
      <path d="M124 280Q160 291 196 280L204 360H116Z" fill="#FBF7F2" />
      <path d="M168 294Q192 290 199 301Q187 301 180 313Q174 304 168 294Z" fill="#EDE5DC" />
      <path d="M126 298Q137 304 142 316" stroke="#E4DBD1" strokeWidth="3" strokeLinecap="round" fill="none" />
      {/* Lapels */}
      <path d="M142 230L126 284L102 254L124 238Z" fill="#2D3138" />
      <path d="M178 230L194 284L218 254L196 238Z" fill="#2D3138" />
      <path d="M126 284L102 254M194 284L218 254" stroke="#565C66" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M66 302Q64 332 67 360M254 302Q256 332 253 360" stroke="#565C66" strokeWidth="2" strokeLinecap="round" fill="none" opacity=".6" />

      {/* Forearm, cuff and watch */}
      <path d="M252 254H274L281 350H260Z" fill="#F7D9C4" />
      <path d="M256 338H286L289 360H254Z" fill="#3E434B" />
      {/* Smaller hand, tilted 20 degrees to the right, waving from the wrist */}
      <g transform="translate(263 254) rotate(14) scale(0.8) translate(-263 -254)" fill="#F7D9C4">
        <rect x="244" y="168" width="12" height="52" rx="6" />
        <rect x="257" y="160" width="12" height="60" rx="6" />
        <rect x="270" y="166" width="12" height="54" rx="6" />
        <rect x="283" y="180" width="11" height="44" rx="10" transform="rotate(3 234 222)"/>
        <rect x="228" y="204" width="12" height="36" rx="6" transform="rotate(-38 234 222)" />
        <rect x="240" y="206" width="52" height="54" rx="20" />
      </g>
      <rect x="250" y="280" width="30" height="11" rx="3" fill="#D4A63A" stroke="#B88A1E" strokeWidth="1.4" transform="rotate(-4 265 285)" />
      <rect x="260" y="281" width="11" height="9" rx="2.5" fill="#EBCB6B" stroke="#B88A1E" strokeWidth="1.1" transform="rotate(-4 265 285)" />

      {/* Face and features, same scale as the hair */}
      <g transform="translate(0 16) translate(160 200) scale(1.18) translate(-160 -200)">
        <path d="M118 132C118 98 138 90 160 90C182 90 202 98 202 132C202 170 184 194 160 194C136 194 118 170 118 132Z" fill="#F7D9C4" />
        <circle cx="134" cy="164" r="6" fill="#F4A6A0" opacity=".45" />
        <circle cx="186" cy="164" r="6" fill="#F4A6A0" opacity=".45" />
        {/* Brows */}
        <path d="M131 133Q143 126 154 131M166 131Q177 126 189 133" stroke="#2B1F1C" strokeWidth="3" strokeLinecap="round" fill="none" />
        {/* Smiling, narrowed eyes: slim lens, flattened iris, lifted lower lid */}
        <ellipse cx="143" cy="142.5" rx="8" ry="3.1" fill="#fff" />
        <ellipse cx="177" cy="142.5" rx="8" ry="3.1" fill="#fff" />
        <ellipse cx="143" cy="142.6" rx="4" ry="2.9" fill="#3B2A25" />
        <ellipse cx="177" cy="142.6" rx="4" ry="2.9" fill="#3B2A25" />
        <circle cx="144.4" cy="141.6" r="1.1" fill="#fff" />
        <circle cx="178.4" cy="141.6" r="1.1" fill="#fff" />
        <path d="M133 145Q143 138 153 145M167 145Q177 138 187 145" transform="translate(0, -6.0)" stroke="#2B1F1C" strokeWidth="1.9" strokeLinecap="round" fill="none" />
        {/* Nose and smile */}
        <path d="M160 151Q156 161 160 164" transform="translate(0, -4.0)" stroke="#DDAE8C" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M144.2 171.7Q153 167.3 160 170Q167 167.3 175.8 171.7Q167.9 186.7 160 186.7Q152.1 186.7 144.2 171.7Z" transform="translate(0, -2.8)" fill="#C8201F" />
        <path d="M149.4 173.5Q160 177.9 170.6 173.5Q167 181.4 160 182.3Q153 181.4 149.4 173.5Z" transform="translate(0, -3.0)" fill="#fff" />
        {/* Fringe: side-swept to one side, part on the other */}
        <path d="M112 140C106 86 132 54 164 54C198 54 214 86 208 134C204 112 196 100 182 94C170 112 140 112 124 128C118 132 114 136 112 140Z" fill="#2B1F1C" />
        <path d="M126 100C136 74 160 66 184 76M190 70C200 80 204 96 204 112" stroke="#4A3834" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      </g>
    </svg>
  );
}