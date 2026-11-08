import type { ReactNode } from "react";

export default function PageHeader({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <header className="bg-glow rounded-b-[2.5rem] px-4 pb-16 pt-10 text-white sm:px-8 lg:rounded-b-[3.5rem] lg:pt-16">
      <div className="mx-auto max-w-6xl">
        <h1 className="font-display text-4xl font-extrabold sm:text-5xl lg:text-6xl">{title}</h1>
        {children && <p className="mt-3 max-w-xl text-base text-ink-200 sm:text-lg">{children}</p>}
      </div>
    </header>
  );
}
