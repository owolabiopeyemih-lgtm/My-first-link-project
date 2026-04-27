"use client";

import { useState } from "react";
import type { Theme } from "@prisma/client";
import { THEMES } from "@/lib/themes";

interface Props {
  currentTheme: Theme;
}

export function ThemePicker({ currentTheme }: Props) {
  const [selected, setSelected] = useState<Theme>(currentTheme);
  const [saving, setSaving] = useState(false);

  async function handleSelect(theme: Theme) {
    setSelected(theme);
    setSaving(true);
    await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ theme }),
    });
    setSaving(false);
  }

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {THEMES.map((theme) => (
          <button
            key={theme.id}
            type="button"
            onClick={() => handleSelect(theme.id)}
            className={`rounded-xl border-2 transition-all ${
              selected === theme.id
                ? "border-brand-500 ring-2 ring-brand-200 ring-offset-1"
                : "border-transparent hover:border-brand-300"
            }`}
          >
            <div
              className="h-16 rounded-lg"
              style={{ background: theme.preview }}
              title={theme.label}
            />
            <p className="text-xs text-center mt-1 pb-1 text-gray-600">{theme.label}</p>
          </button>
        ))}
      </div>
      {saving && <p className="text-xs text-gray-400">Saving…</p>}
    </div>
  );
}
