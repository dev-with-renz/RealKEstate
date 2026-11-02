import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

interface PillProps {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}

export default function Pill({ active, onClick, children }: PillProps) {
  return (
    <button type="button" aria-pressed={active} onClick={onClick}
      className={cn("rounded-full px-4 py-2 text-sm font-semibold transition", active ? "bg-ink-900 text-white shadow-soft" : "bg-blush text-deca-700 hover:bg-deca-100")}>
      {children}
    </button>
  );
}
