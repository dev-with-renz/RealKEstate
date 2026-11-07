import InquirySection from "../components/InquirySection";
import Icon, { type IconName } from "../components/ui/Icon";
import PageHeader from "../components/ui/PageHeader";
import Section from "../components/ui/Section";
import { CONTACT, SOCIALS } from "../data/site";

const METHODS: { icon: IconName; label: string; value: string; href?: string }[] = [
  { icon: "phone", label: "Call or text", value: CONTACT.phone, href: CONTACT.phoneHref },
  { icon: "mail", label: "Email", value: CONTACT.email, href: `mailto:${CONTACT.email}` },
  { icon: "pin", label: "Visit our sales gallery", value: CONTACT.address },
  { icon: "clock", label: "Office hours", value: CONTACT.hours },
];

export default function Contact() {
  return (
    <>
      <PageHeader title="Contact us">Questions about a unit, a payment or a viewing? Reach us any way you like.</PageHeader>

      <Section>
        <div className="grid gap-10 lg:grid-cols-[3fr_2fr]">
          <ul className="grid gap-2">
            {METHODS.map((m) => {
              const body = (
                <>
                  <span className="grid size-12 shrink-0 place-items-center rounded-leaf-sm bg-blush text-deca-600"><Icon name={m.icon} className="size-6" /></span>
                  <span>
                    <span className="block text-sm text-ink-500">{m.label}</span>
                    <span className="block font-display text-xl font-bold">{m.value}</span>
                  </span>
                </>
              );
              return (
                <li key={m.label}>
                  {m.href ? (
                    <a href={m.href} className="flex items-center gap-4 rounded-2xl p-3 transition hover:bg-white">{body}</a>
                  ) : (
                    <div className="flex items-center gap-4 p-3">{body}</div>
                  )}
                </li>
              );
            })}
          </ul>

          <div className="bg-glow neon-edge self-start rounded-leaf-alt p-7 text-white">
            <h2 className="font-display text-2xl font-bold">Follow DECA HOMES</h2>
            <p className="mt-1 text-sm text-ink-300">News, tours and updates on our communities.</p>
            <ul className="mt-5 grid gap-2">
              {SOCIALS.map((s) => (
                <li key={s.label}>
                  <a href={s.href} className="flex items-center gap-3 rounded-2xl bg-white/10 p-3 font-semibold transition hover:bg-deca-500">
                    <span className="grid size-9 place-items-center rounded-full bg-white/15 text-sm font-bold">{s.short}</span>
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <InquirySection />
    </>
  );
}
