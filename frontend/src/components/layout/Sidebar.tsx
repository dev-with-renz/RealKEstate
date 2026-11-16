import { NavLink } from "react-router-dom";
import { useQuote } from "../../context/quote";
import { CONTACT, NAV } from "../../data/site";
import { cn } from "../../lib/cn";
import Logo from "../Logo";
import Icon from "../ui/Icon";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

/** Mobile/tablet drawer only. `lg:hidden` hides it on desktop, where <Navbar /> shows the links. */
export default function Sidebar({ open, onClose }: SidebarProps) {
  const { openQuote } = useQuote();
  const phone = CONTACT.phones[0];

  return (
    <>
      <div onClick={onClose} aria-hidden="true"
        className={cn("fixed inset-0 z-40 bg-ink-950/50 backdrop-blur-sm transition-opacity lg:hidden", open ? "opacity-100" : "pointer-events-none opacity-0")} />

      <aside id="site-sidebar" aria-label="Main menu"
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[86%] max-w-80 flex-col gap-8 overflow-y-auto bg-white p-6 text-ink-900 shadow-lift transition-[transform,visibility] duration-300 lg:hidden",
          open ? "visible translate-x-0" : "invisible -translate-x-full",
        )}>
        <div className="flex items-center justify-between">
          <Logo />
          <button type="button" onClick={onClose} aria-label="Close menu" className="grid size-10 place-items-center rounded-full bg-blush text-deca-700">
            <Icon name="close" />
          </button>
        </div>

        <nav aria-label="Primary">
          <ul className="grid gap-1.5">
            {NAV.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to} end={item.end} onClick={onClose}
                  className={({ isActive }) =>
                    cn("flex items-center gap-3 rounded-2xl px-4 py-3 text-[0.95rem] font-semibold transition",
                      isActive ? "bg-deca-600 text-white shadow-glow" : "text-ink-700 hover:bg-blush")}>
                  <Icon name={item.icon} />
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* "Not sure where to start?" lives only here, so it is a mobile-only extra */}
        <div className="mt-auto rounded-leaf-sm bg-blush p-5">
          <p className="font-display text-xl font-bold">Not sure where to start?</p>
          <p className="mt-1 text-sm text-ink-600">Get a free estimate for the unit you have in mind.</p>
          <button type="button" className="btn btn-primary mt-4 w-full" onClick={() => { onClose(); openQuote(); }}>
            Get a free quote
          </button>
          <a href={phone.href} className="mt-4 flex items-center justify-center gap-2 text-sm font-semibold text-deca-700 hover:text-deca-500">
            <Icon name="phone" className="size-4" /> {phone.value}
          </a>
        </div>
      </aside>
    </>
  );
}
