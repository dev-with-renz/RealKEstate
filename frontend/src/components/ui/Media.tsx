import { useState } from "react"
import { cn } from "../../lib/cn"
import Icon from "./Icon"

interface MediaProps {
  src?: string | null;
  alt: string;
  className?: string;
}

/** An image that degrades gracefully: missing or broken pictures become a branded placeholder. */
export default function Media({ src, alt, className }: MediaProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div role="img" aria-label={alt}
        className={cn("grid place-items-center bg-linear-to-br from-deca-100 via-deca-200 to-ember-300 text-deca-700", className)}>
        <Icon name="home" className="size-10 opacity-60" />
      </div>
    );
  }
  return <img src={src} alt={alt} loading="lazy" decoding="async" onError={() => setFailed(true)} className={cn("object-cover", className)} />;
}
