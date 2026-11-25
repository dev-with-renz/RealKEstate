import Icon from "../ui/Icon";
import Section from "../ui/Section";

interface Props {
  name: string;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
}

/** "How to Find Us": a Google Map the customer can use without leaving the site.
 *  Uses exact coordinates when the property has them, otherwise searches by name + address. */
export default function PropertyMap({ name, address, latitude, longitude }: Props) {
  const query = latitude != null && longitude != null ? `${latitude},${longitude}` : [name, address].filter(Boolean).join(", ");
  const q = encodeURIComponent(query);

  return (
    <Section className="pt-0 sm:pt-0">
      <h2 className="font-display text-2xl font-bold sm:text-3xl">How to Find Us</h2>
      {address && <p className="mt-2 flex items-center gap-1.5 text-ink-600"><Icon name="pin" className="size-5 shrink-0" /> {address}</p>}

      <div className="mt-6 overflow-hidden rounded-leaf-sm bg-ink-50 shadow-soft ring-1 ring-ink-900/5">
        <iframe
          title={`Map showing ${name}`}
          src={`https://www.google.com/maps?q=${q}&output=embed`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
          className="h-80 w-full border-0 sm:h-[26rem]"
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <a href={`https://www.google.com/maps/search/?api=1&query=${q}`} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
          Open in Google Maps<span className="sr-only"> (opens in a new tab)</span>
        </a>
        <a href={`https://www.google.com/maps/dir/?api=1&destination=${q}`} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
          Directions in Google Maps<span className="sr-only"> (opens in a new tab)</span>
        </a>
      </div>
    </Section>
  );
}
