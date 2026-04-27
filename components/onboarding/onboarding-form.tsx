"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function OnboardingForm() {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const res = await fetch("/api/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    });

    if (res.ok) {
      router.push("/dashboard");
    } else {
      const data = await res.json();
      setError(
        typeof data.error === "string" ? data.error : "Username unavailable. Try another."
      );
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">Choose your username</label>
        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-brand-500">
          <span className="px-3 py-2.5 bg-gray-50 text-gray-500 text-sm border-r border-gray-300 whitespace-nowrap">
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
            pattern="[a-z0-9_-]{3,30}"
            className="flex-1 px-3 py-2.5 text-sm focus:outline-none"
            placeholder="yourname"
            autoFocus
          />
        </div>
        <p className="text-xs text-gray-400">
          3–30 chars · lowercase letters, numbers, _ or -
        </p>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
      <button
        type="submit"
        disabled={saving || username.length < 3}
        className="w-full bg-brand-500 hover:bg-brand-600 text-white font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-50"
      >
        {saving ? "Claiming…" : "Claim username"}
      </button>
    </form>
  );
}
