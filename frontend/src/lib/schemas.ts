import { z } from "zod";

/* Instant feedback + server stays source of truth.
   Frontend form rules live here. The backend re-checks the same rules (Pydantic). */

export const UNIT_KEYS = ["any", "0", "1", "2"] as const;
export const PRICE_KEYS = ["any", "lt2", "2to3", "3to5", "gt5"] as const;

export const searchSchema = z.object({
  query: z.string().trim().max(80, "Keep it under 80 characters"),
  location: z.string().trim().max(80, "Keep it under 80 characters"),
  unitType: z.enum(UNIT_KEYS),
  priceRange: z.enum(PRICE_KEYS),
});
export type SearchValues = z.infer<typeof searchSchema>;

// Philippine mobile: 09171234567, +639171234567 or 639171234567 (spaces and dashes are fine)
const PH_MOBILE = /^(\+?63|0)9\d{9}$/;
export const normalizePhone = (value: string) => value.replace(/[\s-]/g, "");

const person = (label: string) =>
  z.string().trim().min(1, `${label} is required`).max(80, "Keep it under 80 characters");

const contactFields = z.object({
  firstName: person("First name"),
  lastName: person("Last name"),
  email: z.string().trim().pipe(z.email("Enter a valid email, like name@email.com")),
  phone: z
    .string()
    .trim()
    .refine((v) => PH_MOBILE.test(normalizePhone(v)), "Enter a PH mobile number, like 0917 123 4567"),
  unitType: z.enum(UNIT_KEYS),
  website: z.string().max(0), // honeypot: hidden from people, bots fill it
});

export const inquirySchema = contactFields.extend({
  message: z
    .string()
    .trim()
    .min(10, "Tell us a little more (at least 10 characters)")
    .max(2000, "Keep it under 2,000 characters"),
});

// A quote request doesn't need a message
export const quoteSchema = contactFields.extend({
  message: z.string().trim().max(2000, "Keep it under 2,000 characters"),
});

export type InquiryValues = z.infer<typeof inquirySchema>;