import { Link } from "react-router-dom";
import Section from "../components/ui/Section";
import { ABOUT } from "../data/site";

export default function About() {
  return (
    <>
      <section className="relative isolate overflow-hidden rounded-b-[2.5rem] text-white lg:rounded-b-[3.5rem]">
        <img src="/images/about-community.svg" alt="A DECA HOMES community at sunrise" className="absolute inset-0 -z-10 size-full object-cover" />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-t from-ink-950/85 via-ink-950/30 to-ink-950/20" />
        <div className="mx-auto max-w-6xl px-4 pb-16 pt-40 sm:px-8 sm:pt-56">
          <h1 className="font-display text-4xl font-extrabold sm:text-6xl">About DECA HOMES</h1>
          <p className="mt-3 max-w-xl text-lg text-ink-100">{ABOUT.tagline}</p>
        </div>
      </section>

      <Section>
        <p className="max-w-3xl font-display text-2xl font-bold leading-snug sm:text-3xl">{ABOUT.intro}</p>
        <dl className="mt-10 grid gap-8 md:grid-cols-3 md:gap-0 md:divide-x md:divide-ink-900/10">
          {ABOUT.pillars.map((p) => (
            <div key={p.title} className="md:px-8 md:first:pl-0 md:last:pr-0">
              <dt className="font-display text-2xl font-bold text-deca-600">{p.title}</dt>
              <dd className="mt-2 text-ink-700">{p.body}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section className="pt-0 sm:pt-0">
        <div className="bg-glow rounded-leaf p-7 text-white sm:p-12">
          <h2 className="font-display text-4xl font-extrabold sm:text-5xl">Our brand story</h2>
          <div className="mt-10 grid gap-10">
            {ABOUT.story.map((chapter) => (
              <article key={chapter.title} className="grid gap-3 md:grid-cols-[1fr_2fr] md:gap-10">
                <h3 className="font-display text-2xl font-bold text-ember-300">{chapter.title}</h3>
                <p className="border-l-2 border-ember-500/60 pl-5 text-lg text-ink-100">{chapter.body}</p>
              </article>
            ))}
          </div>
          <Link to="/properties" className="btn btn-primary mt-10">See our properties</Link>
        </div>
      </Section>
    </>
  );
}
