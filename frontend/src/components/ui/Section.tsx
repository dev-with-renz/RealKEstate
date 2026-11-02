import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

export default function Section({ children, className, id }: { children: ReactNode; className?: string; id?: string }) {
  return (
    <section id={id} className={cn("mx-auto w-full max-w-6xl scroll-mt-24 px-4 py-12 sm:px-8 sm:py-16", className)}>
      {children}
    </section>
  );
}
