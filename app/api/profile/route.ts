import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const createSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(30)
    .regex(/^[a-z0-9_-]+$/, "Lowercase letters, numbers, _ or - only"),
});

const updateSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(30)
    .regex(/^[a-z0-9_-]+$/)
    .optional(),
  displayName: z.string().max(50).optional().nullable(),
  bio: z.string().max(160).optional().nullable(),
  photo: z.string().url().optional().nullable(),
  theme: z
    .enum(["DEFAULT", "DARK", "SUNSET", "FOREST", "OCEAN", "DESERT", "NIGHT", "PASTEL", "BOLD", "MINIMAL"])
    .optional(),
  isPublished: z.boolean().optional(),
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const profile = await db.profile.findUnique({
    where: { userId: session.user.id },
    include: { links: { orderBy: { order: "asc" } } },
  });

  return NextResponse.json(profile);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const existing = await db.profile.findUnique({ where: { userId: session.user.id } });
  if (existing) return NextResponse.json(existing);

  const body = await req.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });

  const { username } = parsed.data;
  const taken = await db.profile.findUnique({ where: { username } });
  if (taken) return NextResponse.json({ error: "Username already taken" }, { status: 409 });

  const [profile] = await db.$transaction([
    db.profile.create({ data: { userId: session.user.id, username } }),
    db.subscription.upsert({
      where: { userId: session.user.id },
      update: {},
      create: { userId: session.user.id },
    }),
  ]);

  return NextResponse.json(profile, { status: 201 });
}

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const profile = await db.profile.findUnique({ where: { userId: session.user.id } });
  if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

  const body = await req.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });

  if (parsed.data.username && parsed.data.username !== profile.username) {
    const taken = await db.profile.findUnique({ where: { username: parsed.data.username } });
    if (taken) return NextResponse.json({ error: "Username already taken" }, { status: 409 });
  }

  const updated = await db.profile.update({ where: { id: profile.id }, data: parsed.data });
  return NextResponse.json(updated);
}
