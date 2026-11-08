import { Link } from "react-router-dom";
import { cn } from "../lib/cn";
import Icon from "./ui/Icon";

export default function Logo({ onDark = false, className }: { onDark?: boolean; className?: string }) {
  return (
    <Link to="/" className={cn("flex items-center gap-3", className)} aria-label="RealKEstate by DECA HOMES, home">
      <span className="grid size-11 place-items-center rounded-leaf-sm bg-linear-to-br from-deca-500 to-ember-500 text-white shadow-glow">
        <Icon name="home" className="size-6" strokeWidth={2} />
      </span>
      <span className="leading-none">
        <span className={cn("block font-display text-xl font-extrabold", onDark ? "text-white" : "text-ink-900")}>RealKEstate</span>
        <span className={cn("mt-1 block text-xs font-semibold tracking-wide", onDark ? "text-ember-400" : "text-deca-600")}>DECA HOMES</span>
      </span>
    </Link>
  );
}
