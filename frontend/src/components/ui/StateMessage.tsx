import type { ReactNode } from "react";

interface StateMessageProps {
  title: string;
  message: string;
  action?: ReactNode;
}

export default function StateMessage({ title, message, action }: StateMessageProps) {
  return (
    <div role="status" className="mx-auto max-w-md rounded-leaf bg-white p-8 text-center shadow-soft ring-1 ring-ink-900/5">
      <h2 className="font-display text-2xl font-bold">{title}</h2>
      <p className="mt-2 text-ink-600">{message}</p>
      {action && <div className="mt-5 flex justify-center gap-3">{action}</div>}
    </div>
  );
}
