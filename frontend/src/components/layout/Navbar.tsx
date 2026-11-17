import { NavLink } from "react-router-dom";
import { useQuote } from "../../context/quote";
import { NAV } from "../../data/site";
import { cn } from "../../lib/cn";
import Logo from "../Logo";
import Icon from "../ui/Icon";

interface NavbarProps {
  menuOpen: boolean;
  onMenu: () => void;
}

/** ONE header, two looks:
 *  - lg and up (desktop): logo, links in a row, "Free quote" button.
 *  - below lg (mobile/tablet): logo and a hamburger button that opens <Sidebar />.
 *  Tailwind decides which part is visible: `hidden lg:block` = hidden on mobile, visible from lg up;
 *  `lg:hidden` = the opposite. */
export default function Navbar({ menuOpen, onMenu }: NavbarProps) {
  const { openQuote } = useQuote();

  return (
    <header className="sticky top-0 z-30 bg-deca-600 text-white shadow-soft">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-4 sm:px-8 lg:h-20">
        <Logo onDark />

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to} end={item.end}
                  className={({ isActive }) =>
                    cn("rounded-full px-4 py-2 text-[0.95rem] font-semibold transition",
                      isActive ? "bg-white text-deca-700" : "text-white/90 hover:bg-white/15 hover:text-white")}>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <button type="button" className="btn btn-light hidden lg:inline-flex" onClick={() => openQuote()}>
          Get a free quote
        </button>

        <button type="button" onClick={onMenu} aria-label="Open menu" aria-expanded={menuOpen} aria-controls="site-sidebar"
          className="grid size-11 place-items-center rounded-full bg-white/15 lg:hidden">
          <Icon name="menu" />
        </button>
      </div>
    </header>
  );
}
