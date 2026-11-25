import { Link } from "react-router-dom";
import AgencyDropdowns from "../components/about/AgencyDropdowns";
import PageHeader from "../components/ui/PageHeader";
import Section from "../components/ui/Section";
import { ABOUT } from "../data/site";

export default function About() {
  return (
    <>
      <PageHeader title="About DECA HOMES">{ABOUT.tagline}</PageHeader>

      <Section className="pb-0 sm:pb-0">
        <p className="max-w-1xl font-display text-2xl font-bold leading-snug sm:text-3xl">{ABOUT.intro}</p>
        <p className="max-w-1xl font-display text-lg leading-snug sm:text-2xl">{ABOUT.subIntro}</p>
      </Section>

      {/* Replaces <VibeShowcase />: Meet Kriza, 8990 Holdings, XUR Homes Realty */}
      <AgencyDropdowns />

      <Section className="pt-0 sm:pt-0">
        <div className="rounded-leaf bg-white p-7 shadow-soft ring-1 ring-ink-900/5 sm:p-12">
          <h2 className="font-display text-4xl font-extrabold sm:text-5xl">Our brand story</h2>
          <div className="mt-10 grid gap-10">
            {ABOUT.story.map((chapter) => (
              <article key={chapter.title} className="grid gap-3 md:grid-cols-[1fr_2fr] md:gap-10">
                <h3 className="font-display text-2xl font-bold text-deca-600">{chapter.title}</h3>
                <p className="border-l-2 border-deca-200 pl-5 text-lg text-ink-700">{chapter.body}</p>
              </article>
            ))}
          </div>
          <Link to="/properties" className="btn btn-primary mt-10">See our properties</Link>
        </div>
      </Section>
    </>
  );
}
