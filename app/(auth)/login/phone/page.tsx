"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function PhoneLoginPage() {
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function sendOtp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/otp/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
    });

    if (res.ok) {
      const data = await res.json();
      setPhone(data.phone); // use the E.164-normalized number the API stored
      setStep("otp");
    } else {
      const data = await res.json();
      setError(data.error ?? "Failed to send OTP. Try again.");
    }
    setLoading(false);
  }

  async function verifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("phone-otp", {
      phone,
      code,
      redirect: false,
    });

    if (result?.ok) {
      router.push("/dashboard");
    } else {
      setError("Invalid or expired code. Try again.");
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-bold">Sign in with phone</h1>
        <p className="text-sm text-gray-500">
          {step === "phone"
            ? "Enter your Nigerian phone number"
            : `We sent a 6-digit code to ${phone}`}
        </p>
      </div>

      {step === "phone" ? (
        <form onSubmit={sendOtp} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Phone number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="input"
              placeholder="08012345678"
              autoFocus
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-500 hover:bg-brand-600 text-white font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? "Sending…" : "Send code"}
          </button>
        </form>
      ) : (
        <form onSubmit={verifyOtp} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">6-digit code</label>
            <input
              type="text"
              inputMode="numeric"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              required
              minLength={6}
              maxLength={6}
              className="input text-center tracking-widest text-xl"
              placeholder="000000"
              autoFocus
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading || code.length !== 6}
            className="w-full bg-brand-500 hover:bg-brand-600 text-white font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? "Verifying…" : "Verify code"}
          </button>
          <button
            type="button"
            onClick={() => { setStep("phone"); setCode(""); setError(""); }}
            className="w-full text-sm text-gray-500 hover:text-gray-700"
          >
            Use a different number
          </button>
        </form>
      )}

      <p className="text-center text-sm text-gray-500">
        <Link href="/login" className="text-brand-600 hover:underline">
          Back to login
        </Link>
      </p>
    </div>
  );
}
