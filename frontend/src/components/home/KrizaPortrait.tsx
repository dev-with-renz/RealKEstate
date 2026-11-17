import { KRIZA } from "../../data/site";

/** Shows Kriza's real photo when KRIZA.photo is set in data/site.ts, otherwise a friendly cartoon. */
export default function KrizaPortrait({ className }: { className?: string }) {
  if (KRIZA.photo) {
    return <img src={KRIZA.photo} alt={`${KRIZA.name}, real estate agent`} className={className} loading="lazy" />;
  }
  return (
    <svg viewBox="0 0 320 360" role="img" aria-label="Cartoon of Kriza waving hello" className={className}>
      <circle cx="160" cy="185" r="150" fill="#FDECEC" />
      <path d="M104 130c-8-76 104-76 112 0 6 50 14 112-6 148H110c-20-36-12-98-6-148z" fill="#3B2A25" />
      <path d="M70 360c0-62 36-100 90-100s90 38 90 100z" fill="#B30006" />
      <path d="M136 262l24 44 24-44z" fill="#fff" />
      <path d="M84 300c-6 24-8 40-8 60" stroke="#B30006" strokeWidth="34" strokeLinecap="round" fill="none" />
      <path d="M236 292c26-10 40-40 40-84" stroke="#B30006" strokeWidth="34" strokeLinecap="round" fill="none" />
      <g fill="#F5CBA7">
        <circle cx="276" cy="196" r="20" />
        <rect x="258" y="160" width="9" height="28" rx="4.5" />
        <rect x="270" y="154" width="9" height="30" rx="4.5" />
        <rect x="282" y="158" width="9" height="28" rx="4.5" />
        <rect x="143" y="212" width="34" height="46" rx="12" fill="#EBB88F" />
        <ellipse cx="160" cy="152" rx="46" ry="56" />
      </g>
      <path d="M110 150C104 76 140 54 166 54 196 54 224 76 212 150 206 118 192 102 166 104 140 106 118 124 110 150z" fill="#3B2A25" />
      <path d="M134 128q12-8 24-2M182 126q12-6 24 2" stroke="#3B2A25" strokeWidth="3" strokeLinecap="round" fill="none" />
      <ellipse cx="146" cy="146" rx="13" ry="9" fill="#fff" />
      <ellipse cx="190" cy="146" rx="13" ry="9" fill="#fff" />
      <circle cx="147" cy="147" r="7" fill="#5B3A29" />
      <circle cx="189" cy="147" r="7" fill="#5B3A29" />
      <circle cx="147" cy="147" r="3.2" fill="#111" />
      <circle cx="189" cy="147" r="3.2" fill="#111" />
      <circle cx="150" cy="144" r="2" fill="#fff" />
      <circle cx="192" cy="144" r="2" fill="#fff" />
      <path d="M132 144q14-14 28 0M176 144q14-14 28 0" stroke="#3B2A25" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M168 158q-3 10 2 12" stroke="#D9A07A" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M148 182q20 18 40 0" stroke="#B30006" strokeWidth="3.5" strokeLinecap="round" fill="none" />
      <circle cx="130" cy="170" r="8" fill="#F4A9AB" opacity=".45" />
      <circle cx="206" cy="170" r="8" fill="#F4A9AB" opacity=".45" />
      <path d="M298 160q14 8 14 26M306 148q22 14 22 40" stroke="#00897B" strokeWidth="4" strokeLinecap="round" fill="none" />
    </svg>
  );
}
