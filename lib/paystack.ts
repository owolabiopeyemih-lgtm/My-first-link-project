/**
 * Paystack helpers
 * Docs: https://paystack.com/docs/api/
 */

const PAYSTACK_BASE = "https://api.paystack.co";

async function paystackRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${PAYSTACK_BASE}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message ?? `Paystack error: ${res.status}`);
  return data;
}

export interface InitializePaymentParams {
  email: string;
  amount: number;    // in kobo (₦2,500 = 250000)
  reference?: string;
  plan?: string;     // Paystack plan code for subscriptions
  metadata?: Record<string, unknown>;
  callback_url?: string;
}

export async function initializePayment(params: InitializePaymentParams) {
  return paystackRequest<{
    status: boolean;
    data: { authorization_url: string; reference: string };
  }>("/transaction/initialize", {
    method: "POST",
    body: JSON.stringify(params),
  });
}

export async function verifyTransaction(reference: string) {
  return paystackRequest<{
    status: boolean;
    data: { status: string; amount: number; customer: { email: string } };
  }>(`/transaction/verify/${reference}`);
}

export async function createSubscription(params: {
  customer: string; // customer code or email
  plan: string;     // plan code
  authorization: string;
}) {
  return paystackRequest("/subscription", {
    method: "POST",
    body: JSON.stringify(params),
  });
}

export async function cancelSubscription(subscriptionCode: string, token: string) {
  return paystackRequest("/subscription/disable", {
    method: "POST",
    body: JSON.stringify({ code: subscriptionCode, token }),
  });
}

// Plan codes — set these up once in Paystack dashboard and store here
export const PAYSTACK_PLANS = {
  CREATOR_MONTHLY: process.env.PAYSTACK_PLAN_CREATOR_MONTHLY ?? "",
  PRO_MONTHLY: process.env.PAYSTACK_PLAN_PRO_MONTHLY ?? "",
} as const;
