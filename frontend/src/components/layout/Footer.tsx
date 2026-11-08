import { Link } from "react-router-dom";
import { CONTACT, NAV, SOCIALS } from "../../data/site";
import Logo from "../Logo";

const YEAR = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="mt-8 rounded-t-[2.5rem] bg-ink-900 px-4 pb-28 pt-12 text-ink-200 sm:px-8 lg:rounded-t-[3.5rem] lg:pb-12">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo onDark />
          <p className="mt-4 max-w-sm text-sm text-ink-300">
            Explore DECA HOMES communities, compare units and get a free quote, all from your phone or computer.
          </p>
          <ul className="mt-5 flex flex-wrap gap-2">
            {SOCIALS.map((s) => (
              <li key={s.label}>
                <a href={s.href} aria-label={s.label} className="grid size-10 place-items-center rounded-full bg-white/10 text-sm font-bold text-white transition hover:bg-deca-500">
                  {s.short}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <nav aria-label="Footer">
          <p className="font-display text-lg font-bold text-white">Explore</p>
          <ul className="mt-3 grid gap-2 text-sm">
            {NAV.map((n) => (
              <li key={n.to}><Link to={n.to} className="hover:text-white">{n.label}</Link></li>
            ))}
          </ul>
        </nav>
        <div>
          <p className="font-display text-lg font-bold text-white">Talk to us</p>
          <ul className="mt-3 grid gap-2 text-sm">
            <li><a href={CONTACT.phoneHref} className="hover:text-white">{CONTACT.phone}</a></li>
            <li><a href={`mailto:${CONTACT.email}`} className="hover:text-white">{CONTACT.email}</a></li>
            <li>{CONTACT.hours}</li>
          </ul>
        </div>
      </div>
      <p className="mx-auto mt-10 max-w-6xl border-t border-white/10 pt-6 text-xs text-ink-400">
        © {YEAR} RealKEstate. Prices, floor areas and availability are subject to change without prior notice.
      </p>
    </footer>
  );
}
