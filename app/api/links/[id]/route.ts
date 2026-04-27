import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { z } from "zod";

const updateSchema = z.object({
  label: z.string().min(1).max(100).optional(),
  url: z.string().optional(),
  icon: z.string().optional(),
  isActive: z.boolean().optional(),
  metadata: z.record(z.unknown()).optional(),
});

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const link = await db.link.findUnique({
    where: { id: params.id },
    include: { profile: { select: { userId: true } } },
  });
  if (!link || link.profile.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await req.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const { metadata, ...restData } = parsed.data;
  const updated = await db.link.update({
    where: { id: params.id },
    data: {
      ...restData,
      ...(metadata !== undefined && { metadata: metadata as Prisma.InputJsonValue }),
    },
  });
  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const link = await db.link.findUnique({
    where: { id: params.id },
    include: { profile: { select: { userId: true } } },
  });
  if (!link || link.profile.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await db.link.delete({ where: { id: params.id } });
  return new NextResponse(null, { status: 204 });
}
