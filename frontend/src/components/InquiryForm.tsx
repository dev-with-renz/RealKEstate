import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { getErrorMessage, submitInquiry } from "../lib/api";
import { unitLabel } from "../lib/format";
import { inquirySchema, normalizePhone, quoteSchema, type InquiryValues } from "../lib/schemas";
import Icon from "./ui/Icon";

interface InquiryFormProps {
  kind?: "inquiry" | "quote";
  propertySlug?: string;
  propertyName?: string;
  onDone?: () => void;
}

export default function InquiryForm({ kind = "inquiry", propertySlug, propertyName, onDone }: InquiryFormProps) {
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const isQuote = kind === "quote";

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<InquiryValues>({
    resolver: zodResolver(isQuote ? quoteSchema : inquirySchema),
    defaultValues: { firstName: "", lastName: "", email: "", phone: "", message: "", unitType: "any", website: "" },
  });

  const onSubmit = handleSubmit(async (v) => {
    setServerError(null);
    try {
      await submitInquiry({
        kind,
        first_name: v.firstName,
        last_name: v.lastName,
        email: v.email,
        phone: normalizePhone(v.phone),
        message: v.message,
        property_slug: propertySlug ?? null,
        unit_type_pref: isQuote && v.unitType !== "any" ? unitLabel(Number(v.unitType)) : null,
        website: v.website,
      });
      setSent(true);
      reset();
    } catch (error) {
      setServerError(getErrorMessage(error));
    }
  });

  if (sent) {
    return (
      <div role="status" className="py-6 text-center">
        <span className="mx-auto grid size-14 place-items-center rounded-full bg-lagoon-400/20 text-lagoon-500">
          <Icon name="check" className="size-7" strokeWidth={2.4} />
        </span>
        <h3 className="mt-4 font-display text-2xl font-bold">{isQuote ? "Quote request sent" : "Inquiry sent"}</h3>
        <p className="mx-auto mt-2 max-w-sm text-ink-600">Thank you. Our team will contact you soon using the details you gave us.</p>
        <div className="mt-6 flex justify-center gap-3">
          <button type="button" className="btn btn-ghost" onClick={() => setSent(false)}>Send another</button>
          {onDone && <button type="button" className="btn btn-dark" onClick={onDone}>Close</button>}
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-4">
      {propertyName && (
        <p className="rounded-2xl bg-blush px-4 py-2.5 text-sm text-deca-800">
          About <strong>{propertyName}</strong>
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`${kind}-first`} className="field-label">First name</label>
          <input id={`${kind}-first`} autoComplete="given-name" className="field" aria-invalid={!!errors.firstName} {...register("firstName")} />
          {errors.firstName && <p className="field-error">{errors.firstName.message}</p>}
        </div>
        <div>
          <label htmlFor={`${kind}-last`} className="field-label">Last name</label>
          <input id={`${kind}-last`} autoComplete="family-name" className="field" aria-invalid={!!errors.lastName} {...register("lastName")} />
          {errors.lastName && <p className="field-error">{errors.lastName.message}</p>}
        </div>
      </div>

      <div>
        <label htmlFor={`${kind}-email`} className="field-label">Email</label>
        <input id={`${kind}-email`} type="email" inputMode="email" autoComplete="email" placeholder="name@email.com"
          className="field" aria-invalid={!!errors.email} {...register("email")} />
        {errors.email && <p className="field-error">{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor={`${kind}-phone`} className="field-label">Contact number</label>
        <input id={`${kind}-phone`} type="tel" inputMode="tel" autoComplete="tel" placeholder="0917 123 4567"
          className="field" aria-invalid={!!errors.phone} {...register("phone")} />
        {errors.phone && <p className="field-error">{errors.phone.message}</p>}
      </div>

      {isQuote && (
        <div>
          <label htmlFor="quote-unit" className="field-label">Unit you are interested in</label>
          <select id="quote-unit" className="field" {...register("unitType")}>
            <option value="any">Not sure yet</option>
            <option value="0">Studio</option>
            <option value="1">1 Bedroom</option>
            <option value="2">2 Bedroom</option>
          </select>
        </div>
      )}

      <div>
        <label htmlFor={`${kind}-message`} className="field-label">
          Message {isQuote && <span className="font-normal text-ink-500">(optional)</span>}
        </label>
        <textarea id={`${kind}-message`} rows={4} className="field resize-y" aria-invalid={!!errors.message}
          placeholder={isQuote ? "Budget, preferred location, move-in date..." : "How can we help you?"} {...register("message")} />
        {errors.message && <p className="field-error">{errors.message.message}</p>}
      </div>

      {/* Honeypot: invisible to people, tempting to bots. */}
      <input type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 opacity-0" {...register("website")} />

      {serverError && <p role="alert" className="rounded-2xl bg-deca-50 px-4 py-3 text-sm font-medium text-deca-700">{serverError}</p>}

      <button type="submit" disabled={isSubmitting} className="btn btn-primary w-full sm:w-auto sm:justify-self-start">
        <Icon name="send" className="size-5" />
        {isSubmitting ? "Sending..." : isQuote ? "Get my free quote" : "Send inquiry"}
      </button>
      <p className="text-xs text-ink-500">By sending this form you agree to be contacted about your request.</p>
    </form>
  );
}
