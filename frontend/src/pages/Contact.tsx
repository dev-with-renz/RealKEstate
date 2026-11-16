import InquirySection from "../components/InquirySection";
import Icon, { FacebookIcon, type IconName } from "../components/ui/Icon";
import PageHeader from "../components/ui/PageHeader";
import Section from "../components/ui/Section";
import { CONTACT, SOCIALS } from "../data/site";
import { cn } from "../lib/cn";

interface Reach { value: string; href: string }

/** A group of phones or emails. The FIRST item is big, the rest are smaller. */
function ReachGroup({ icon, label, items }: { icon: IconName; label: string; items: Reach[] }) {
  return (
    <li className="flex items-start gap-4 p-3">
      <span className="grid size-12 shrink-0 place-items-center rounded-leaf-sm bg-blush text-deca-600"><Icon name={icon} className="size-6" /></span>
      <div className="min-w-0">
        <p className="text-sm text-ink-500">{label}</p>
        {items.map((item, i) => (
          <a key={item.value} href={item.href}
            className={cn("block break-words font-display font-bold hover:text-deca-600", i === 0 ? "text-2xl sm:text-3xl" : "mt-1 text-lg text-ink-600")}>
            {item.value}
          </a>
        ))}
      </div>
    </li>
  );
}

function Info({ icon, label, value }: { icon: IconName; label: string; value: string }) {
  return (
    <li className="flex items-start gap-4 p-3">
      <span className="grid size-12 shrink-0 place-items-center rounded-leaf-sm bg-blush text-deca-600"><Icon name={icon} className="size-6" /></span>
      <div>
        <p className="text-sm text-ink-500">{label}</p>
        <p className="font-display text-xl font-bold">{value}</p>
      </div>
    </li>
  );
}

export default function Contact() {
  return (
    <>
      <PageHeader title="Contact us">Questions about a unit, a payment or a viewing? Reach us any way you like.</PageHeader>

      <Section>
        <div className="grid gap-10 lg:grid-cols-[3fr_2fr]">
          <ul className="grid gap-2">
            <ReachGroup icon="phone" label="Call or text" items={CONTACT.phones} />
            <ReachGroup icon="mail" label="Email" items={CONTACT.emails} />
            <Info icon="pin" label="Visit our sales gallery" value={CONTACT.address} />
            <Info icon="clock" label="Office hours" value={CONTACT.hours} />
          </ul>

          <div className="bg-glow self-start rounded-leaf-alt p-7 text-white">
            <h2 className="font-display text-2xl font-bold">Follow Us</h2>
            <p className="mt-1 text-sm text-white/90">News, tours and updates on our communities.</p>
            <ul className="mt-5 grid gap-2">
              {SOCIALS.map((s) => (
                <li key={s.label}>
                  <a href={s.href} className="flex items-center gap-3 rounded-2xl bg-white/15 p-3 font-semibold transition hover:bg-white/25">
                    <span className="grid size-9 place-items-center rounded-full bg-white text-deca-600"><FacebookIcon className="size-5" /></span>
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
