import { useCallback, useMemo, useState, type ReactNode } from "react"
import QuoteModal from "../components/QuoteModal"
import { QuoteContext } from "./quote"

export function QuoteProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [property, setProperty] = useState<{ slug: string; name: string }>();

  const openQuote = useCallback((p?: { slug: string; name: string }) => {
    setProperty(p);
    setOpen(true);
  }, []);
  const closeQuote = useCallback(() => setOpen(false), []);
  const value = useMemo(() => ({ openQuote, closeQuote }), [openQuote, closeQuote]);

  return (
    <QuoteContext.Provider value={value}>
      {children}
      <QuoteModal open={open} onClose={closeQuote} property={property} />
    </QuoteContext.Provider>
  );
}
