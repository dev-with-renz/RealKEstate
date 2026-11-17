import PageHeader from "../components/ui/PageHeader";
import Section from "../components/ui/Section";
import { DATA_PRIVACY } from "../data/site";

// SAMPLE text. Have your lawyer or Data Protection Officer review it before launch.
const SECTIONS = [
  { title: "What we collect", body: "Your name, email address, mobile number, your message, the unit type you like and the property you were viewing. We ask only for what we need." },
  { title: "Why we collect it", body: "To answer your inquiry, prepare your free quotation, schedule viewings and connect you with the sales agent assigned to you." },
  { title: "Who can see it", body: "The DECA HOMES sales team and your assigned agent. Partner banks or Pag-IBIG only see your details when you choose to apply for financing. We do not sell your personal data." },
  { title: "How long we keep it", body: "Only as long as needed for the purpose above or as the law requires. After that we securely delete or anonymise it." },
  { title: "Your rights", body: "Under the Data Privacy Act of 2012 (Republic Act No. 10173) you have the right to be informed, to access your data, to object, to correct it, to ask for it to be erased or blocked, to data portability, to claim damages, and to file a complaint with the National Privacy Commission (privacy.gov.ph)." },
];

export default function Privacy() {
  return (
    <>
      <PageHeader title="Privacy Notice">How RealKEstate and DECA HOMES handle your personal information.</PageHeader>
      <Section>
        <div className="grid max-w-3xl gap-8">
          <p className="rounded-2xl bg-blush px-4 py-3 text-sm text-deca-800">Sample notice. Please have it reviewed by your legal counsel or Data Protection Officer before launch.</p>
          {SECTIONS.map((s) => (
            <div key={s.title}>
              <h2 className="font-display text-2xl font-bold text-deca-600">{s.title}</h2>
              <p className="mt-2 text-ink-700">{s.body}</p>
            </div>
          ))}
          <div>
            <h2 className="font-display text-2xl font-bold text-deca-600">Contact our Data Protection Officer</h2>
            <p className="mt-2 text-ink-700">
              Questions or requests about your data? Email <a className="font-semibold text-deca-700 underline underline-offset-2" href={`mailto:${DATA_PRIVACY.dpoEmail}`}>{DATA_PRIVACY.dpoEmail}</a>.
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}
