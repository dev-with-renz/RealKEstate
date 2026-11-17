import { Link } from "react-router-dom";
import { CONTACT, DATA_PRIVACY, SOCIALS } from "../../data/site";
import MeetKriza from "../home/MeetKriza";
import Logo from "../Logo";
import { FacebookIcon } from "../ui/Icon";

const YEAR = new Date().getFullYear();

export default function Footer({ withAgent = false }: { withAgent?: boolean }) {
  return (
    <>
      {withAgent && <MeetKriza />}
      <footer className="bg-ink-900 px-4 pb-28 pt-12 text-ink-200 sm:px-8 lg:pb-12">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1.3fr_1fr_1fr]">
          <div>
            <Logo onDark />
            <p className="mt-4 max-w-sm text-sm text-ink-300">
              Explore DECA HOMES communities, compare units and get a free quote, all from your phone or computer.
            </p>
            <p className="mt-6 font-display text-lg font-bold text-white">Follow Us</p>
            <ul className="mt-3 grid gap-2 text-sm">
              {SOCIALS.map((s) => (
                <li key={s.label}>
                  <a href={s.href} className="inline-flex items-center gap-3 hover:text-white">
                    <span className="grid size-10 place-items-center rounded-full bg-white/10 text-white"><FacebookIcon /></span>
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-display text-lg font-bold text-white">Talk to us</p>
            <ul className="mt-3 grid gap-2 text-sm">
              {CONTACT.phones.map((p) => <li key={p.value}><a href={p.href} className="hover:text-white">{p.value}</a></li>)}
              {CONTACT.emails.map((e) => <li key={e.value}><a href={e.href} className="hover:text-white">{e.value}</a></li>)}
              <li>{CONTACT.hours}</li>
            </ul>
          </div>

          <div>
            <p className="font-display text-lg font-bold text-white">Data privacy</p>
            <p className="mt-3 text-sm">{DATA_PRIVACY.footer}</p>
            <Link to="/privacy" className="mt-3 inline-block text-sm font-semibold text-white underline underline-offset-4">Read our Privacy Notice</Link>
          </div>
        </div>
        <p className="mx-auto mt-10 max-w-6xl border-t border-white/10 pt-6 text-xs text-ink-300">
          © {YEAR} RealKEstate. Prices, floor areas and availability are subject to change without prior notice.
        </p>
      </footer>
    </>
  );
}
