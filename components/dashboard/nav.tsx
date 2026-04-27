"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Link2, BarChart2, Settings } from "lucide-react";

const NAV_ITEMS = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Overview", exact: true },
  { href: "/dashboard/links", icon: Link2, label: "Links", exact: false },
  { href: "/dashboard/analytics", icon: BarChart2, label: "Analytics", exact: false },
  { href: "/dashboard/settings", icon: Settings, label: "Settings", exact: false },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="flex md:flex-col gap-0.5 p-2 overflow-x-auto md:overflow-visible flex-row md:mt-2">
      {NAV_ITEMS.map(({ href, icon: Icon, label, exact }) => {
        const isActive = exact ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={[
              "flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm whitespace-nowrap",
              "transition-all duration-[120ms] [transition-timing-function:var(--ease-out-quart)]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-1",
              isActive
                ? "bg-brand-50 text-brand-700 font-semibold"
                : "text-gray-500 hover:bg-gray-100 hover:text-gray-900 font-medium",
            ].join(" ")}
          >
            <Icon
              size={16}
              className={[
                "shrink-0 transition-colors duration-[120ms]",
                isActive ? "text-brand-500" : "text-gray-400",
              ].join(" ")}
            />
            <span className="hidden md:inline">{label}</span>
            {isActive && (
              <span className="hidden md:block ml-auto w-1.5 h-1.5 rounded-full bg-brand-400" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
