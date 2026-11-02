import { createContext, useContext } from "react";

export interface QuoteContextValue {
  openQuote: (property?: { slug: string; name: string }) => void;
  closeQuote: () => void;
}

export const QuoteContext = createContext<QuoteContextValue | null>(null);

export function useQuote(): QuoteContextValue {
  const ctx = useContext(QuoteContext);
  if (!ctx) throw new Error("useQuote must be used inside <QuoteProvider>");
  return ctx;
}
