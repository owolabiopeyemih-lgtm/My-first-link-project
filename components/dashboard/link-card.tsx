"use client";

import { useState } from "react";
import { GripVertical, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import type { Link } from "@prisma/client";

interface Props {
  link: Link;
}

const TYPE_BADGE: Record<string, string> = {
  WHATSAPP:     "bg-green-50 text-green-700",
  PAYSTACK:     "bg-blue-50 text-blue-700",
  BANK_ACCOUNT: "bg-yellow-50 text-yellow-700",
  SELAR:        "bg-purple-50 text-purple-700",
  OPAY:         "bg-emerald-50 text-emerald-700",
  PALMPAY:      "bg-teal-50 text-teal-700",
  SOCIAL:       "bg-gray-100 text-gray-600",
  CUSTOM:       "bg-gray-100 text-gray-500",
};

const TYPE_LABEL: Record<string, string> = {
  WHATSAPP: "WhatsApp", PAYSTACK: "Paystack", BANK_ACCOUNT: "Bank",
  SELAR: "Selar", OPAY: "OPay", PALMPAY: "PalmPay",
  SOCIAL: "Social", CUSTOM: "Link",
};

export function LinkCard({ link }: Props) {
  const [active, setActive] = useState(link.isActive);
  const [toggling, setToggling] = useState(false);

  async function toggleActive() {
    setToggling(true);
    const res = await fetch(`/api/links/${link.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !active }),
    });
    if (res.ok) setActive((v) => !v);
    setToggling(false);
  }

  async function deleteLink() {
    if (!confirm(`Delete "${link.label}"?`)) return;
    await fetch(`/api/links/${link.id}`, { method: "DELETE" });
    window.location.reload();
  }

  return (
    <div
      className={[
        "group bg-white rounded-2xl border flex items-center gap-3 px-4 py-3",
        "transition-all duration-[200ms] [transition-timing-function:var(--ease-out-quart)]",
        active
          ? "border-gray-200 hover:border-gray-300 hover:shadow-[0_4px_16px_-4px_rgba(0,0,0,0.08)]"
          : "border-gray-100 opacity-55 hover:opacity-70",
      ].join(" ")}
    >
      {/* Drag handle — fades in on group hover */}
      <div
        className="text-gray-300 cursor-grab shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-[150ms]"
        aria-hidden="true"
      >
        <GripVertical size={16} />
      </div>

      {/* Type badge */}
      <span
        className={[
          "hidden sm:inline-flex shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide",
          TYPE_BADGE[link.type] ?? "bg-gray-100 text-gray-500",
        ].join(" ")}
      >
        {TYPE_LABEL[link.type] ?? link.type}
      </span>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{link.label}</p>
        {link.url && (
          <p className="text-xs text-gray-400 truncate mt-0.5">{link.url}</p>
        )}
      </div>

      {/* Actions — always visible on touch devices, hover-reveal on desktop */}
      <div className="flex items-center gap-0.5 shrink-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-[150ms]">
        <ActionButton
          onClick={toggleActive}
          disabled={toggling}
          title={active ? "Hide link" : "Show link"}
        >
          {active ? (
            <Eye size={14} className="text-gray-400" />
          ) : (
            <EyeOff size={14} className="text-gray-400" />
          )}
        </ActionButton>
        <ActionButton title="Edit" onClick={() => {}}>
          <Pencil size={14} className="text-gray-400" />
        </ActionButton>
        <ActionButton
          onClick={deleteLink}
          title="Delete"
          className="hover:bg-red-50 hover:text-red-600 [&>svg]:hover:text-red-500"
        >
          <Trash2 size={14} className="text-gray-400" />
        </ActionButton>
      </div>
    </div>
  );
}

function ActionButton({
  onClick,
  disabled,
  title,
  className = "",
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  title: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={[
        "p-1.5 rounded-lg transition-all duration-[100ms] hover:bg-gray-100",
        "active:scale-90 disabled:opacity-40 disabled:cursor-not-allowed",
        className,
      ].join(" ")}
    >
      {children}
    </button>
  );
}
