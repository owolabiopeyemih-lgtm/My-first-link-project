"use client";

import type { Link } from "@prisma/client";
import type { ThemeStyles } from "@/lib/themes";

interface Props {
  link: Link;
  theme: ThemeStyles;
}

/**
 * Tracks the click (fire-and-forget), then navigates.
 * BANK_ACCOUNT renders as a display card with copy-to-clipboard.
 */
export function PublicLinkButton({ link, theme }: Props) {
  if (link.type === "BANK_ACCOUNT") {
    return <BankAccountCard link={link} theme={theme} />;
  }

  async function handleClick() {
    // Haptic feedback on mobile (Android Vibration API)
    if ("vibrate" in navigator) navigator.vibrate(10);

    try {
      const res = await fetch("/api/analytics/click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ linkId: link.id }),
      });
      if (res.ok) {
        const { url } = await res.json();
        window.open(url, "_blank", "noopener,noreferrer");
        return;
      }
    } catch {
      // fall through
    }
    window.open(link.url, "_blank", "noopener,noreferrer");
  }

  return (
    <button
      onClick={handleClick}
      className="w-full rounded-2xl px-5 py-3.5 font-medium text-sm text-center"
      style={{
        ...theme.button,
        transition: "opacity 120ms var(--ease-out-quart), transform 150ms var(--ease-spring)",
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = "0.88"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
      onMouseDown={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(0.97)"; }}
      onMouseUp={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1)"; }}
      onTouchStart={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "scale(0.97)";
        if ("vibrate" in navigator) navigator.vibrate(8);
      }}
      onTouchEnd={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1)"; }}
    >
      <span style={theme.buttonText}>{link.label}</span>
    </button>
  );
}

function BankAccountCard({ link, theme }: Props) {
  const meta = link.metadata as { bankName?: string; accountNumber?: string } | null;

  async function handleCopy() {
    if (!meta?.accountNumber) return;
    await navigator.clipboard.writeText(meta.accountNumber).catch(() => {});
    if ("vibrate" in navigator) navigator.vibrate([10, 30, 10]);
  }

  return (
    <button
      onClick={handleCopy}
      title="Tap to copy account number"
      className="w-full rounded-2xl px-5 py-4 text-center space-y-0.5 transition-opacity duration-[120ms] hover:opacity-90 active:opacity-75"
      style={theme.button}
    >
      <p className="text-[10px] uppercase tracking-widest font-semibold opacity-60" style={theme.buttonText}>
        Bank transfer
      </p>
      <p className="text-xl font-bold tracking-wider font-mono" style={theme.buttonText}>
        {meta?.accountNumber ?? "—"}
      </p>
      <p className="text-sm font-medium opacity-80" style={theme.buttonText}>
        {meta?.bankName ?? ""}
      </p>
      <p className="text-sm font-medium" style={theme.buttonText}>
        {link.label}
      </p>
      <p className="text-[10px] opacity-40 mt-1" style={theme.buttonText}>
        tap to copy
      </p>
    </button>
  );
}
