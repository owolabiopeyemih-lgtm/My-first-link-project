"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import type { Plan, LinkType } from "@prisma/client";

const LINK_TYPES: { type: LinkType; label: string; emoji: string }[] = [
  { type: "CUSTOM", label: "Custom link", emoji: "🔗" },
  { type: "SOCIAL", label: "Social profile", emoji: "📱" },
  { type: "WHATSAPP", label: "WhatsApp", emoji: "💬" },
  { type: "PAYSTACK", label: "Paystack", emoji: "💳" },
  { type: "SELAR", label: "Selar product", emoji: "🛒" },
  { type: "BANK_ACCOUNT", label: "Bank account", emoji: "🏦" },
  { type: "OPAY", label: "OPay", emoji: "📲" },
  { type: "PALMPAY", label: "PalmPay", emoji: "📲" },
];

interface Props {
  profileId: string;
  canAdd: boolean;
  plan: Plan;
}

export function AddLinkButton({ profileId, canAdd, plan }: Props) {
  const [open, setOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<LinkType | null>(null);
  const [label, setLabel] = useState("");
  const [url, setUrl] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedType) return;
    setSaving(true);
    const res = await fetch("/api/links", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profileId, type: selectedType, label, url }),
    });
    setSaving(false);
    if (res.ok) {
      setOpen(false);
      setLabel("");
      setUrl("");
      setSelectedType(null);
      window.location.reload();
    }
  }

  if (!canAdd) {
    return (
      <a
        href="/dashboard/settings#upgrade"
        className="flex items-center gap-1.5 text-sm bg-brand-500 text-white px-4 py-2 rounded-lg hover:bg-brand-600 transition-colors"
      >
        <Plus size={15} />
        Upgrade to add more
      </a>
    );
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 text-sm bg-brand-500 text-white px-4 py-2 rounded-lg hover:bg-brand-600 transition-colors"
      >
        <Plus size={15} />
        Add link
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 space-y-4">
            <h2 className="font-semibold text-lg">Add a link</h2>

            {!selectedType ? (
              <div className="grid grid-cols-2 gap-2">
                {LINK_TYPES.map((lt) => (
                  <button
                    key={lt.type}
                    onClick={() => setSelectedType(lt.type)}
                    className="flex items-center gap-2 border border-gray-200 rounded-xl p-3 text-sm hover:border-brand-400 hover:bg-brand-50 transition-colors"
                  >
                    <span>{lt.emoji}</span>
                    <span>{lt.label}</span>
                  </button>
                ))}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-sm font-medium">Label</label>
                  <input
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    required
                    placeholder="e.g. Buy my course"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                {selectedType !== "BANK_ACCOUNT" && (
                  <div className="space-y-1">
                    <label className="text-sm font-medium">URL</label>
                    <input
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      required
                      type="url"
                      placeholder="https://"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                )}
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setSelectedType(null)}
                    className="flex-1 border border-gray-300 py-2 rounded-lg text-sm hover:bg-gray-50"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 bg-brand-500 text-white py-2 rounded-lg text-sm hover:bg-brand-600 disabled:opacity-50"
                  >
                    {saving ? "Saving…" : "Add link"}
                  </button>
                </div>
              </form>
            )}

            <button
              onClick={() => setOpen(false)}
              className="w-full text-sm text-gray-400 hover:text-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}
