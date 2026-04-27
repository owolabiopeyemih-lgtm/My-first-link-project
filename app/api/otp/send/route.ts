import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendOtp, generateOtpCode } from "@/lib/termii";
import { normalizeNigerianPhone } from "@/lib/utils";
import { z } from "zod";

const schema = z.object({ phone: z.string().min(10).max(15) });

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid phone number" }, { status: 400 });

  const phone = normalizeNigerianPhone(parsed.data.phone);

  // Rate limit: max 3 OTPs per phone per 10 minutes
  const recent = await db.otpCode.count({
    where: { phone, createdAt: { gte: new Date(Date.now() - 10 * 60 * 1000) } },
  });
  if (recent >= 3) {
    return NextResponse.json({ error: "Too many requests. Try again later." }, { status: 429 });
  }

  const code = generateOtpCode();
  const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  await db.otpCode.create({ data: { phone, code, expires } });

  try {
    await sendOtp(phone, code);
  } catch (err) {
    console.error("OTP send failed:", err);
    return NextResponse.json({ error: "Failed to send OTP. Try again." }, { status: 502 });
  }

  return NextResponse.json({ ok: true, phone });
}
