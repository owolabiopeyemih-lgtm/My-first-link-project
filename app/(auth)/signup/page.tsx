"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });

    if (!res.ok) {
      const data = await res.json();
      const firstError =
        typeof data.error === "string"
          ? data.error
          : "Signup failed. Check your details and try again.";
      setError(firstError);
      setLoading(false);
      return;
    }

    // Auto sign-in after account creation
    const result = await signIn("email-password", {
      email,
      password,
      redirect: false,
    });

    if (result?.ok) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-bold">Claim your link</h1>
        <p className="text-sm text-gray-500">Free forever. No credit card needed.</p>
      </div>

      <form onSubmit={handleSignup} className="space-y-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Username</label>
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-brand-500">
            <span className="px-3 py-2.5 bg-gray-50 text-gray-500 text-sm border-r border-gray-300">
              linkng.co/
            </span>
            <input
              type="text"
              value={username}
              onChange={(e) =>
                setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))
              }
              required
              minLength={3}
              maxLength={30}
              className="flex-1 px-3 py-2.5 text-sm focus:outline-none"
              placeholder="yourname"
            />
          </div>
          <p className="text-xs text-gray-400">3–30 chars, lowercase letters, numbers, _ or -</p>
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input"
            autoComplete="email"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            className="input"
            autoComplete="new-password"
          />
          <p className="text-xs text-gray-400">At least 8 characters</p>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brand-500 hover:bg-brand-600 text-white font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p className="text-center text-xs text-gray-400">
        By signing up you agree to our{" "}
        <Link href="/terms" className="underline">
          Terms
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="underline">
          Privacy Policy
        </Link>
        .
      </p>

      <p className="text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link href="/login" className="text-brand-600 hover:underline font-medium">
          Sign in
        </Link>
      </p>
    </div>
  );
}
