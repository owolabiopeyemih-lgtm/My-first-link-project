import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNGN(kobo: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(kobo / 100);
}

/** Normalize to E.164 Nigerian number: 08012345678 → +2348012345678 */
export function normalizeNigerianPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("234")) return `+${digits}`;
  if (digits.startsWith("0")) return `+234${digits.slice(1)}`;
  return `+234${digits}`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Build a WhatsApp deep link */
export function buildWhatsAppUrl(phone: string, message?: string): string {
  const normalized = normalizeNigerianPhone(phone).replace("+", "");
  const base = `https://wa.me/${normalized}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export const PLAN_LIMITS = {
  FREE: { maxLinks: 5, analyticsRetentionDays: 30 },
  CREATOR: { maxLinks: Infinity, analyticsRetentionDays: 365 },
  PRO: { maxLinks: Infinity, analyticsRetentionDays: 365 },
} as const;
