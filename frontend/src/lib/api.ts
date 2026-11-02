import axios, { isAxiosError } from "axios";
import type { InquiryPayload, PropertyDetail, PropertySummary } from "../types";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "/api/v1",
  timeout: 15_000,
  withCredentials: true, // harmless now, required later for the admin httpOnly cookie
});

export interface PropertyQuery {
  q?: string;
  location?: string;
  bedrooms?: number;
  min_price?: number;
  max_price?: number;
  limit?: number;
}

export async function fetchProperties(params: PropertyQuery = {}) {
  const { data } = await api.get<PropertySummary[]>("/properties", { params });
  return data;
}

export async function fetchProperty(slug: string) {
  const { data } = await api.get<PropertyDetail>(`/properties/${encodeURIComponent(slug)}`);
  return data;
}

export async function submitInquiry(payload: InquiryPayload) {
  const { data } = await api.post<{ id: number }>("/inquiries", payload);
  return data;
}

/** Turns any failure into one friendly sentence for the UI. */
export function getErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    if (!error.response) return "We couldn't reach the server. Check your connection and try again.";
    const detail = error.response.data?.detail;
    if (typeof detail === "string") return detail;
    if (Array.isArray(detail) && detail[0]?.msg) return String(detail[0].msg).replace(/^Value error, /, "");
    if (error.response.status === 404) return "We couldn't find that page.";
  }
  return "Something went wrong. Please try again.";
}
