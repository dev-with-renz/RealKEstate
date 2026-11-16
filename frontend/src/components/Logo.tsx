import { Link } from "react-router-dom";
import { cn } from "../lib/cn";
import Icon from "./ui/Icon";

/** onDark = the logo sits on a red or slate background (navbar, footer): white text and a white mark. */
export default function Logo({ onDark = false, className }: { onDark?: boolean; className?: string }) {
  return (
    <Link to="/" className={cn("flex items-center gap-3", className)} aria-label="RealKEstate by DECA HOMES, home">
      <span className={cn("grid size-11 place-items-center rounded-leaf-sm", onDark ? "bg-white text-deca-600" : "bg-deca-600 text-white shadow-glow")}>
        <Icon name="home" className="size-6" strokeWidth={2} />
      </span>
      <span className="leading-none">
        <span className={cn("block font-display text-xl font-extrabold", onDark ? "text-white" : "text-ink-900")}>RealKEstate</span>
        <span className={cn("mt-1 block text-xs font-semibold tracking-wide", onDark ? "text-white/75" : "text-deca-600")}>DECA HOMES</span>
      </span>
    </Link>
  );
}
