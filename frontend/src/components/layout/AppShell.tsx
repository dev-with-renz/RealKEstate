import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useQuote } from "../../context/quote";
import Icon from "../ui/Icon";
import Footer from "./Footer";
import Navbar from "./Navbar";
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
    <div className="flex min-h-dvh flex-col">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-white focus:px-4 focus:py-2">
        Skip to content
      </a>

      <Navbar menuOpen={menuOpen} onMenu={() => setMenuOpen(true)} />
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />

      <main id="main" className="flex-1">
        <Outlet />
      </main>

      {/* The "Meet Kriza" block is part of the footer, but only the homepage asks for it */}
      <Footer withAgent={pathname === "/"} />

      {/* Floating quote button: phones/tablets only (desktop has one in the navbar) */}
      <button type="button" onClick={() => openQuote()}
        className="btn btn-primary fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-30 h-14 px-5 shadow-neon sm:right-6 lg:hidden">
        <Icon name="sparkle" className="size-5" />
        Free quote
      </button>
    </div>
  );
}
