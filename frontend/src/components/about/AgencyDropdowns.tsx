import { useEffect, useState, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { HOLDINGS, KRIZA_ID, KRIZA_INTRO, XUR, type Agency } from "../../data/agency";
import { cn } from "../../lib/cn";
import KrizaPortrait from "../home/KrizaPortrait";
import Icon, { type IconName } from "../ui/Icon";
import Section from "../ui/Section";
import PillarsDialog from "./PillarsDialog";

/* All three cards share ONE height. When the words don't fit, the card scrolls inside itself.
   h-[26rem] on phones, h-[30rem] from the lg breakpoint up. */
const CARD = "h-[26rem] overflow-y-auto overscroll-contain rounded-leaf-sm bg-white p-6 shadow-soft ring-1 ring-ink-900/5 lg:h-[30rem]";
const ROW = "flex w-full items-center gap-3 rounded-2xl bg-ink-50 p-3 text-left transition hover:bg-blush";

function Dropdown({ id, title, open, onToggle, children }: { id: string; title: string; open: boolean; onToggle: () => void; children: ReactNode }) {
  return (
    <div id={id} className="scroll-mt-24">
      <button type="button" aria-expanded={open} aria-controls={`${id}-card`} onClick={onToggle}
        className={cn("flex w-full items-center justify-between gap-4 rounded-2xl bg-white px-5 py-4 text-left font-display text-xl font-bold shadow-soft ring-1 transition",
          open ? "text-deca-600 ring-deca-300" : "ring-ink-900/5 hover:ring-deca-200")}>
        {title}
        <Icon name="chevron-down" className={cn("size-5 shrink-0 text-deca-600 transition", open && "rotate-180")} />
      </button>
      {open && (
        <div id={`${id}-card`} role="region" aria-label={title} tabIndex={0} className={cn("mt-3", CARD)}>
          {children}
        </div>
      )}
    </div>
  );
}

function IconBox({ name }: { name: IconName }) {
  return <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white text-deca-600"><Icon name={name} className="size-5" /></span>;
}

function AgencyCard({ agency, onPillars }: { agency: Agency; onPillars: () => void }) {
  return (
    <>
      <img src={agency.logo} alt={agency.logoAlt} className="mx-auto h-14 w-auto max-w-[70%] object-contain" />
      <div className="mt-5 grid gap-3 text-ink-700">
        {agency.pitch.map((p) => <p key={p}>{p}</p>)}
      </div>
      <ul className="mt-4 grid gap-2">
        {agency.highlights.map((h) => (
          <li key={h} className="flex items-start gap-3 text-ink-800">
            <Icon name="check" className="mt-0.5 size-5 shrink-0 text-lagoon-500" strokeWidth={2.4} />
            {h}
          </li>
        ))}
      </ul>

      <p className="mt-6 font-display text-lg font-bold">Learn more:</p>
      <ul className="mt-2 grid gap-2">
        <li>
          <a href={agency.website.href} target="_blank" rel="noopener noreferrer" className={ROW}>
            <IconBox name="building" />
            <span className="min-w-0 break-words font-semibold text-deca-700 underline underline-offset-2">
              {agency.website.label}<span className="sr-only"> (opens in a new tab)</span>
            </span>
          </a>
        </li>
        <li>
          <button type="button" onClick={onPillars} className={ROW}>
            <IconBox name="pillars" />
            <span className="min-w-0 font-semibold text-deca-700 underline underline-offset-2">{agency.pillarsLabel}</span>
          </button>
        </li>
      </ul>
    </>
  );
}

export default function AgencyDropdowns() {
  const { hash } = useLocation(); // e.g. "#meet-kriza"
  // Which dropdowns are open. Starts with the one named in the URL hash (if any).
  const [open, setOpen] = useState<Record<string, boolean>>(() => (hash ? { [hash.slice(1)]: true } : {}));
  const [pillarsOf, setPillarsOf] = useState<Agency | null>(null);

  // If we are already on /about and the hash changes (or the user comes back to it), open that dropdown too.
  useEffect(() => {
    if (hash) setOpen((o) => ({ ...o, [hash.slice(1)]: true }));
  }, [hash]);

  const toggle = (id: string) => setOpen((o) => ({ ...o, [id]: !o[id] }));

  return (
    <Section>
      <div className="max-w-2xl">
        <h2 className="font-display text-4xl font-extrabold sm:text-5xl">The people behind your home</h2>
        <p className="mt-3 text-ink-600">Tap a name to learn who is helping you from the first question to move-in day.</p>
      </div>

      {/* Phones: stacked (1 column). Desktop: one row of 3. items-start keeps the closed ones from stretching. */}
      <div className="mt-8 grid gap-4 lg:grid-cols-3 lg:items-start">
        <Dropdown id={KRIZA_ID} title="Meet Kriza" open={!!open[KRIZA_ID]} onToggle={() => toggle(KRIZA_ID)}>
          <KrizaPortrait className="mx-auto w-28" />
          <div className="mt-4 grid gap-3 text-ink-700">
            {KRIZA_INTRO.map((p) => <p key={p}>{p}</p>)}
          </div>
        </Dropdown>

        {[HOLDINGS, XUR].map((agency) => (
          <Dropdown key={agency.id} id={agency.id} title={agency.title} open={!!open[agency.id]} onToggle={() => toggle(agency.id)}>
            <AgencyCard agency={agency} onPillars={() => setPillarsOf(agency)} />
          </Dropdown>
        ))}
      </div>

      <PillarsDialog agency={pillarsOf} onClose={() => setPillarsOf(null)} />
    </Section>
  );
}
