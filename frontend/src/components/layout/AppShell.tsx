import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useQuote } from "../../context/quote";
import Icon from "../ui/Icon";
import Logo from "../Logo";
import Footer from "./Footer";
import Sidebar from "./Sidebar";

export default function AppShell() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { openQuote } = useQuote();
  const { pathname, hash } = useLocation();

  // New page: scroll to top, or to the #anchor if the link had one (e.g. /contact#inquire)
  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView();
    else window.scrollTo(0, 0);
  }, [pathname, hash]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <div className="min-h-dvh lg:flex">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-white focus:px-4 focus:py-2">
        Skip to content
      </a>
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center justify-between bg-cream/85 px-4 py-3 backdrop-blur-xl lg:hidden">
          <Logo />
          <button type="button" onClick={() => setMenuOpen(true)} aria-label="Open menu" aria-expanded={menuOpen} aria-controls="site-sidebar"
            className="grid size-11 place-items-center rounded-full bg-ink-900 text-white">
            <Icon name="menu" />
          </button>
        </header>

        <main id="main" className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>

      <button type="button" onClick={() => openQuote()}
        className="btn btn-primary fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-30 h-14 px-5 shadow-neon sm:right-6">
        <Icon name="sparkle" className="size-5" />
        <span className="sm:hidden">Free quote</span>
        <span className="hidden sm:inline">Get a free quote</span>
      </button>
    </div>
  );
}
