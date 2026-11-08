import InquiryForm from "./InquiryForm";
import Section from "./ui/Section";

interface InquirySectionProps {
  propertySlug?: string;
  propertyName?: string;
}

/** "Find the best home for you": one tall picture on the side, the inquiry form beside it. */
export default function InquirySection({ propertySlug, propertyName }: InquirySectionProps) {
  return (
    <Section id="inquire">
      <div className="grid overflow-hidden rounded-leaf bg-white shadow-lift ring-1 ring-ink-900/5 lg:grid-cols-[5fr_6fr]">
        <div className="relative min-h-64 lg:min-h-full">
          <img src="/images/inquiry-side.svg" alt="" aria-hidden="true" className="absolute inset-0 size-full object-cover" />
          <div className="absolute inset-0 bg-linear-to-t from-ink-950/90 via-ink-950/25 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8">
            <h2 className="font-display text-3xl font-extrabold sm:text-4xl">Find the best home for you</h2>
            <p className="mt-2 max-w-sm text-sm text-ink-100">Tell us what you are looking for and a DECA HOMES representative will get back to you.</p>
          </div>
        </div>
        <div className="p-6 sm:p-10">
          <InquiryForm kind="inquiry" propertySlug={propertySlug} propertyName={propertyName} />
        </div>
      </div>
    </Section>
  );
}
