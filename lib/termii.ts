/**
 * Termii SMS OTP
 * Docs: https://developers.termii.com/
 */

const TERMII_BASE = "https://api.ng.termii.com/api";

export async function sendOtp(phone: string, code: string): Promise<void> {
  const res = await fetch(`${TERMII_BASE}/sms/send`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      to: phone,          // E.164 format: +2348012345678
      from: process.env.TERMII_SENDER_ID,
      sms: `Your ${process.env.NEXT_PUBLIC_APP_NAME} code is ${code}. Valid for 10 minutes.`,
      type: "plain",
      channel: "dnd",    // DND-registered channel for Nigerian numbers
      api_key: process.env.TERMII_API_KEY,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Termii error: ${res.status} ${body}`);
  }
}

export function generateOtpCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}
