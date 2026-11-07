import { Link } from "react-router-dom";
import PartnerBadge from "../components/PartnerBadge";
import Icon from "../components/ui/Icon";
import PageHeader from "../components/ui/PageHeader";
import Section from "../components/ui/Section";
import { DOCUMENTS, FAQS, PARTNERS, PAYMENT_STEPS } from "../data/site";

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

      <Section className="pt-0 sm:pt-0">
        <h2 className="font-display text-3xl font-extrabold sm:text-4xl">Pay through our partners</h2>
        <h3 className="mt-6 font-display text-xl font-bold">Banks</h3>
        <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">{banks.map((p) => <PartnerBadge key={p.name} partner={p} />)}</ul>
        <h3 className="mt-8 font-display text-xl font-bold">E-wallets</h3>
        <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">{wallets.map((p) => <PartnerBadge key={p.name} partner={p} />)}</ul>
      </Section>

      <Section className="pt-0 sm:pt-0">
        <div className="bg-glow rounded-leaf p-6 text-white sm:p-10">
          <h2 className="font-display text-3xl font-extrabold sm:text-4xl">Documents you can download</h2>
          <ul className="mt-6 divide-y divide-white/10">
            {DOCUMENTS.map((d) => (
              <li key={d.name} className="flex flex-wrap items-center justify-between gap-4 py-4">
                <div className="flex items-center gap-4">
                  <span className="grid size-12 shrink-0 place-items-center rounded-leaf-sm bg-white/10 text-ember-300"><Icon name="file" className="size-6" /></span>
                  <div>
                    <p className="font-display text-lg font-bold">{d.name}</p>
                    <p className="text-sm text-ink-300">{d.note}</p>
                  </div>
                </div>
                <a href={d.href} download className="btn btn-primary"><Icon name="download" className="size-5" /> Download</a>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-ink-300">
            Prefer to receive the files by email? <Link to="/contact#inquire" className="font-semibold text-ember-300 underline underline-offset-4">Send us an inquiry</Link> and we will send them to you.
          </p>
        </div>
      </Section>

      <Section className="pt-0 sm:pt-0">
        <h2 className="font-display text-3xl font-extrabold sm:text-4xl">Common questions</h2>
        <div className="mt-6 grid max-w-3xl gap-3">
          {FAQS.map((f) => (
            <details key={f.q} className="group rounded-2xl bg-white p-5 shadow-soft ring-1 ring-ink-900/5 open:ring-deca-300">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
                {f.q}
                <Icon name="chevron-down" className="size-5 shrink-0 text-deca-500 transition group-open:rotate-180" />
              </summary>
              <p className="mt-3 text-ink-600">{f.a}</p>
            </details>
          ))}
        </div>
      </Section>
    </>
  );
}
