import { headers } from "next/headers";
import { db } from "@/lib/db";
import type { Device } from "@prisma/client";
import { createHash } from "crypto";

function detectDevice(ua: string): Device {
  if (/tablet|ipad/i.test(ua)) return "TABLET";
  if (/mobile|android|iphone/i.test(ua)) return "MOBILE";
  return "DESKTOP";
}

function parseReferrer(refHeader: string | null): string | null {
  if (!refHeader) return null;
  try {
    const hostname = new URL(refHeader).hostname.replace("www.", "");
    // Map to clean source names
    const sourceMap: Record<string, string> = {
      "instagram.com": "instagram",
      "tiktok.com": "tiktok",
      "youtube.com": "youtube",
      "twitter.com": "twitter",
      "x.com": "twitter",
      "facebook.com": "facebook",
      "t.co": "twitter",
    };
    return sourceMap[hostname] ?? hostname;
  } catch {
    return null;
  }
}

/** Anonymizes visitor: hash(ip + ua + date) — no PII stored */
function anonymizeVisitor(ip: string, ua: string): string {
  const date = new Date().toISOString().slice(0, 10);
  return createHash("sha256").update(`${ip}|${ua}|${date}`).digest("hex").slice(0, 16);
}

export async function trackPageView(profileId: string) {
  const h = await headers();
  const ua = h.get("user-agent") ?? "";
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const refHeader = h.get("referer");

  // Nigerian state geo lookup is deferred to a background job or edge middleware
  // (maxmind or ip-api.com with a rate-limited server-side call)
  await db.pageView.create({
    data: {
      profileId,
      visitorId: anonymizeVisitor(ip, ua),
      referrer: parseReferrer(refHeader),
      device: detectDevice(ua),
      hour: new Date().getUTCHours(),
      country: "NG",
    },
  });
}

export async function trackLinkClick(linkId: string) {
  const h = await headers();
  const ua = h.get("user-agent") ?? "";
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const refHeader = h.get("referer");

  await db.linkClick.create({
    data: {
      linkId,
      visitorId: anonymizeVisitor(ip, ua),
      referrer: parseReferrer(refHeader),
      device: detectDevice(ua),
    },
  });
}
