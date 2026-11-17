import { Link } from "react-router-dom";
import { PROCESSES } from "../../data/site";
import { cn } from "../../lib/cn";
import Icon from "../ui/Icon";
import Section from "../ui/Section";

export default function ProcessTiles() {
  return (
    <Section className="pb-4 sm:pb-6">
      <h2 className="font-display text-3xl font-extrabold sm:text-4xl">Your path to a DECA home</h2>
      <p className="mt-2 max-w-xl text-ink-600">Three ways to get started. Pick the one that fits your plans.</p>
      <ul className="mt-8 grid gap-4 md:grid-cols-3">
        {PROCESSES.map((p) => (
          <li key={p.title}>
            <Link to={p.to}
              className={cn("group flex h-full flex-col gap-3 rounded-2xl border-t-4 bg-white p-6 shadow-soft ring-1 ring-ink-900/5 transition hover:-translate-y-1 hover:shadow-lift", p.accent)}>
              <span className="grid size-12 place-items-center rounded-leaf-sm bg-blush text-deca-600"><Icon name={p.icon} className="size-6" /></span>
              <h3 className="font-display text-2xl font-bold">{p.title}</h3>
              <p className="text-ink-600">{p.body}</p>
              <span className="mt-auto inline-flex items-center gap-2 pt-2 text-sm font-semibold text-deca-700">
                {p.cta} <Icon name="arrow-right" className="size-4 transition group-hover:translate-x-1" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}
