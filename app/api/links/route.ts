import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { PLAN_LIMITS } from "@/lib/utils";

const createLinkSchema = z.object({
  profileId: z.string(),
  type: z.enum(["CUSTOM", "SOCIAL", "PAYSTACK", "SELAR", "WHATSAPP", "BANK_ACCOUNT", "OPAY", "PALMPAY"]),
  label: z.string().min(1).max(100),
  url: z.string().url().or(z.string().max(0)), // bank/display blocks may have no URL
  icon: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = createLinkSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const { profileId, ...linkData } = parsed.data;

  // Ownership check
  const profile = await db.profile.findUnique({ where: { id: profileId, userId: session.user.id } });
  if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

  // Plan limit check
  const subscription = await db.subscription.findUnique({ where: { userId: session.user.id } });
  const plan = subscription?.plan ?? "FREE";
  const currentCount = await db.link.count({ where: { profileId } });
  if (currentCount >= PLAN_LIMITS[plan].maxLinks) {
    return NextResponse.json({ error: "Link limit reached for your plan" }, { status: 403 });
  }

  const maxOrder = await db.link.aggregate({ where: { profileId }, _max: { order: true } });
  const { metadata, ...restLinkData } = linkData;
  const link = await db.link.create({
    data: {
      ...restLinkData,
      profileId,
      order: (maxOrder._max.order ?? -1) + 1,
      ...(metadata !== undefined && { metadata: metadata as Prisma.InputJsonValue }),
    },
  });

  return NextResponse.json(link, { status: 201 });
}

const reorderSchema = z.object({
  profileId: z.string(),
  linkIds: z.array(z.string()), // ordered array of link IDs
});

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = reorderSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const { profileId, linkIds } = parsed.data;
  const profile = await db.profile.findUnique({ where: { id: profileId, userId: session.user.id } });
  if (!profile) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await db.$transaction(
    linkIds.map((id, order) => db.link.update({ where: { id, profileId }, data: { order } }))
  );

  return NextResponse.json({ ok: true });
}
