import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createHmac } from "crypto";
import type { Plan } from "@prisma/client";

const PLAN_CODES: Record<string, Plan> = {
  [process.env.PAYSTACK_PLAN_CREATOR_MONTHLY ?? ""]: "CREATOR",
  [process.env.PAYSTACK_PLAN_PRO_MONTHLY ?? ""]: "PRO",
};

export async function POST(req: Request) {
  const rawBody = await req.text();
  const sig = req.headers.get("x-paystack-signature");

  // Verify webhook signature
  const hash = createHmac("sha512", process.env.PAYSTACK_SECRET_KEY!)
    .update(rawBody)
    .digest("hex");

  if (hash !== sig) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(rawBody);

  switch (event.event) {
    case "subscription.create": {
      const { customer, plan, subscription_code, next_payment_date } = event.data;
      const user = await db.user.findUnique({ where: { email: customer.email } });
      if (!user) break;
      const planEnum = PLAN_CODES[plan.plan_code] ?? "FREE";
      await db.subscription.upsert({
        where: { userId: user.id },
        update: {
          plan: planEnum,
          status: "ACTIVE",
          paystackSubCode: subscription_code,
          currentPeriodEnd: new Date(next_payment_date),
        },
        create: {
          userId: user.id,
          plan: planEnum,
          status: "ACTIVE",
          paystackSubCode: subscription_code,
          currentPeriodEnd: new Date(next_payment_date),
        },
      });
      break;
    }

    case "subscription.disable":
    case "subscription.expiring_cards": {
      const { subscription_code } = event.data;
      await db.subscription.updateMany({
        where: { paystackSubCode: subscription_code },
        data: { status: "CANCELLED", plan: "FREE" },
      });
      break;
    }

    case "charge.success": {
      // Handle one-off payments if needed
      break;
    }
  }

  return NextResponse.json({ received: true });
}
