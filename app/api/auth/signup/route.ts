import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";
import bcrypt from "bcryptjs";

const schema = z.object({
  username: z
    .string()
    .min(3)
    .max(30)
    .regex(/^[a-z0-9_-]+$/, "Lowercase letters, numbers, _ or - only"),
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const { username, email, password } = parsed.data;

  const [existingEmail, existingUsername] = await Promise.all([
    db.user.findUnique({ where: { email } }),
    db.profile.findUnique({ where: { username } }),
  ]);

  if (existingEmail) return NextResponse.json({ error: "Email already in use" }, { status: 409 });
  if (existingUsername) return NextResponse.json({ error: "Username already taken" }, { status: 409 });

  const passwordHash = await bcrypt.hash(password, 12);

  await db.$transaction(async (tx) => {
    const user = await tx.user.create({ data: { email, password: passwordHash } });
    await tx.profile.create({ data: { userId: user.id, username } });
    await tx.subscription.create({ data: { userId: user.id } });
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
