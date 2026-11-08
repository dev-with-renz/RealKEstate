import { NavLink } from "react-router-dom";
import { useQuote } from "../../context/quote";
import { CONTACT, NAV } from "../../data/site";
import { cn } from "../../lib/cn";
import Icon from "../ui/Icon";
import Logo from "../Logo";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

/** Off-canvas drawer on phones and tablets, permanent left rail on desktop (lg and up). */
export default function Sidebar({ open, onClose }: SidebarProps) {
  const { openQuote } = useQuote();

  return (
    <>
      <div onClick={onClose} aria-hidden="true"
        className={cn("fixed inset-0 z-40 bg-ink-950/60 backdrop-blur-sm transition-opacity lg:hidden", open ? "opacity-100" : "pointer-events-none opacity-0")} />

      <aside id="site-sidebar" aria-label="Main menu"
        className={cn(
          "bg-glow fixed inset-y-0 left-0 z-50 flex w-[86%] max-w-80 flex-col gap-8 overflow-y-auto p-6 text-white transition-[transform,visibility] duration-300",
          "lg:sticky lg:top-0 lg:z-20 lg:h-dvh lg:w-72 lg:max-w-none lg:shrink-0 lg:translate-x-0 lg:visible",
          open ? "visible translate-x-0" : "invisible -translate-x-full",
        )}>
        <div className="flex items-center justify-between">
          <Logo onDark />
          <button type="button" onClick={onClose} aria-label="Close menu" className="grid size-10 place-items-center rounded-full bg-white/10 lg:hidden">
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
                      isActive ? "bg-linear-to-r from-deca-500 to-ember-500 text-white shadow-glow" : "text-ink-200 hover:bg-white/10 hover:text-white")}>
                  <Icon name={item.icon} />
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="neon-edge mt-auto rounded-leaf-sm bg-ink-800/70 p-5">
          <p className="font-display text-xl font-bold">Not sure where to start?</p>
          <p className="mt-1 text-sm text-ink-300">Get a free estimate for the unit you have in mind.</p>
          <button type="button" className="btn btn-primary mt-4 w-full" onClick={() => { onClose(); openQuote(); }}>
            Get a free quote
          </button>
          <a href={CONTACT.phoneHref} className="mt-4 flex items-center justify-center gap-2 text-sm font-semibold text-ember-300 hover:text-white">
            <Icon name="phone" className="size-4" /> {CONTACT.phone}
          </a>
        </div>
      </aside>
    </>
  );
}
