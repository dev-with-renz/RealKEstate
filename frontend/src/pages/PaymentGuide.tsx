import { Link } from "react-router-dom";
import PartnerBadge from "../components/PartnerBadge";
import Icon from "../components/ui/Icon";
import PageHeader from "../components/ui/PageHeader";
import Section from "../components/ui/Section";
import { COSIGNING, DOCUMENTS, FAQS, PAGIBIG, PARTNERS, PAYMENT_STEPS } from "../data/site";

type Guide = typeof PAGIBIG;

function GuideCard({ id, guide }: { id: string; guide: Guide }) {
  return (
    <article id={id} className="scroll-mt-24 rounded-leaf-sm bg-white p-6 shadow-soft ring-1 ring-ink-900/5 sm:p-8">
      <h3 className="font-display text-2xl font-bold text-deca-600">{guide.title}</h3>
      <p className="mt-2 text-ink-700">{guide.intro}</p>
      <ol className="mt-5 grid gap-3">
        {guide.steps.map((step, i) => (
          <li key={step} className="flex gap-3">
            <span className="grid size-7 shrink-0 place-items-center rounded-full bg-deca-600 text-sm font-bold text-white">{i + 1}</span>
            <span className="text-ink-700">{step}</span>
          </li>
        ))}
      </ol>
      <p className="mt-5 rounded-2xl bg-blush px-4 py-3 text-sm text-deca-800">{guide.note}</p>
    </article>
  );
}

export default function PaymentGuide() {
  const banks = PARTNERS.filter((p) => p.kind === "Bank");
  const wallets = PARTNERS.filter((p) => p.kind === "E-wallet");

  return (
    <>
      <PageHeader title="Payment guide">From reservation to move-in, here is how paying for your DECA HOMES unit works.</PageHeader>

      <Section>
        <h2 className="font-display text-3xl font-extrabold sm:text-4xl">How it works</h2>
        <p className="mt-2 max-w-xl text-sm text-ink-500">Sample steps. Your sales representative will confirm the exact terms for your unit.</p>
        <ol className="mt-8 grid gap-8">
          {PAYMENT_STEPS.map((step, i) => (
            <li key={step.title} className="relative pl-16">
              <span className="absolute left-0 top-0 grid size-11 place-items-center rounded-full bg-linear-to-br from-deca-500 to-ember-500 font-display text-lg font-extrabold text-white shadow-glow">{i + 1}</span>
              {i < PAYMENT_STEPS.length - 1 && <span aria-hidden="true" className="absolute -bottom-8 left-[1.3rem] top-12 w-0.5 bg-deca-200" />}
              <h3 className="font-display text-xl font-bold">{step.title}</h3>
              <p className="mt-1 max-w-2xl text-ink-600">{step.body}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* Mildly separated: its own tinted band so Pag-IBIG and co-signing stand out */}
      <section className="bg-white py-4">
        <Section>
          <h2 className="font-display text-3xl font-extrabold sm:text-4xl">Financing your unit</h2>
          <div className="mt-8 grid gap-6 lg:grid-cols-2 lg:items-start">
            <GuideCard id="pag-ibig" guide={PAGIBIG} />
            <GuideCard id="co-signing" guide={COSIGNING} />
          </div>
        </Section>
      </section>

      <Section>
        <h2 className="font-display text-3xl font-extrabold sm:text-4xl">Pay through our partners</h2>
        {banks.length > 0 && (
          <>
            <h3 className="mt-6 font-display text-xl font-bold">Banks</h3>
            <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">{banks.map((p) => <PartnerBadge key={p.name} partner={p} />)}</ul>
          </>
        )}
        {wallets.length > 0 && (
          <>
            <h3 className="mt-8 font-display text-xl font-bold">E-wallets</h3>
            <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">{wallets.map((p) => <PartnerBadge key={p.name} partner={p} />)}</ul>
          </>
        )}
      </Section>

      <Section className="pt-0 sm:pt-0">
        <h2 className="font-display text-3xl font-extrabold sm:text-4xl">Documents</h2>
        <div className="mt-6 grid max-w-3xl gap-3">
          {DOCUMENTS.map((d) => (
            <details key={d.name} className="group rounded-2xl bg-white p-5 shadow-soft ring-1 ring-ink-900/5 open:ring-deca-300">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                <span>
                  <span className="block font-display text-lg font-bold">{d.name}</span>
                  <span className="block text-sm text-ink-500">{d.note}</span>
                </span>
                <Icon name="chevron-down" className="size-5 shrink-0 text-deca-600 transition group-open:rotate-180" />
              </summary>
              <ul className="mt-4 grid gap-2 border-t border-ink-900/10 pt-4">
                {d.items.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-ink-700">
                    <Icon name="check" className="mt-0.5 size-5 shrink-0 text-lagoon-500" strokeWidth={2.4} />
                    {item}
                  </li>
                ))}
              </ul>
            </details>
          ))}
        </div>
        <p className="mt-6 max-w-3xl text-sm text-ink-600">
          Prefer to receive the files by email? <Link to="/contact#inquire" className="font-semibold text-deca-700 underline underline-offset-4">Send us an inquiry</Link> and we will send them to you.
        </p>
      </Section>

      <Section className="pt-0 sm:pt-0">
        <h2 className="font-display text-3xl font-extrabold sm:text-4xl">Common questions</h2>
        <div className="mt-6 grid max-w-3xl gap-3">
          {FAQS.map((f) => (
            <details key={f.q} className="group rounded-2xl bg-white p-5 shadow-soft ring-1 ring-ink-900/5 open:ring-deca-300">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
                {f.q}
                <Icon name="chevron-down" className="size-5 shrink-0 text-deca-600 transition group-open:rotate-180" />
              </summary>
              <p className="mt-3 text-ink-600">{f.a}</p>
            </details>
          ))}
        </div>
      </Section>
    </>
  );
}
