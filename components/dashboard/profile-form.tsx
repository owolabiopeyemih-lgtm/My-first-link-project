"use client";

import { useState } from "react";
import type { Profile } from "@prisma/client";

interface Props {
  profile: Profile;
}

export function ProfileForm({ profile }: Props) {
  const [username, setUsername] = useState(profile.username);
  const [displayName, setDisplayName] = useState(profile.displayName ?? "");
  const [bio, setBio] = useState(profile.bio ?? "");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess(false);

    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        displayName: displayName || null,
        bio: bio || null,
      }),
    });

    if (res.ok) {
      setSuccess(true);
    } else {
      const data = await res.json();
      setError(
        typeof data.error === "string"
          ? data.error
          : "Failed to save. Check your username."
      );
    }
    setSaving(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">Username</label>
        <p className="text-xs text-gray-400">linkng.co/{username}</p>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value.toLowerCase())}
          className="input"
          pattern="[a-z0-9_-]{3,30}"
          required
          minLength={3}
          maxLength={30}
        />
      </div>
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">Display name</label>
        <input
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="input"
          maxLength={50}
          placeholder="Your name"
        />
      </div>
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">Bio</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={3}
          className="input resize-none"
          maxLength={160}
          placeholder="Tell your audience who you are"
        />
        <p className="text-xs text-gray-400 text-right">{bio.length}/160</p>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {success && <p className="text-sm text-green-600">Profile saved!</p>}
      <button
        type="submit"
        disabled={saving}
        className="btn-primary disabled:opacity-50"
      >
        {saving ? "Saving…" : "Save profile"}
      </button>
    </form>
  );
}
