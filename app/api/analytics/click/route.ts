import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { trackLinkClick } from "@/lib/analytics";
import { z } from "zod";

const schema = z.object({ linkId: z.string() });

/** Called client-side when a public page link is clicked, then redirects. */
export async function POST(req: Request) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Bad request" }, { status: 400 });

  const link = await db.link.findUnique({ where: { id: parsed.data.linkId } });
  if (!link) return NextResponse.json({ error: "Not found" }, { status: 404 });

  void trackLinkClick(parsed.data.linkId); // fire-and-forget

  return NextResponse.json({ url: link.url });
}
