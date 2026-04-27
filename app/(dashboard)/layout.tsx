import Link from "next/link";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { DashboardNav } from "@/components/dashboard/nav";
import { ExternalLink } from "lucide-react";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/login");

  const profile = await db.profile.findUnique({
    where: { userId: session.user.id },
    select: { username: true },
  });

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Sidebar */}
      <aside className="w-full md:w-60 bg-white border-b md:border-r border-gray-100 flex md:flex-col shrink-0">
        {/* Brand */}
        <div className="p-5 border-b border-gray-100 hidden md:flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-brand-500 flex items-center justify-center">
            <span className="text-white font-bold text-xs">LN</span>
          </div>
          <span className="font-bold text-gray-900">LinkNG</span>
        </div>

        <DashboardNav />

        {/* View my page link */}
        {profile && (
          <div className="hidden md:block mt-auto p-4 border-t border-gray-100">
            <Link
              href={`/${profile.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-700 font-medium transition-colors duration-[120ms] group"
            >
              <ExternalLink
                size={14}
                className="transition-transform duration-[120ms] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
              View my page
            </Link>
          </div>
        )}
      </aside>

      {/* Main */}
      <main className="flex-1 p-4 md:p-8 overflow-auto min-w-0">{children}</main>
    </div>
  );
}
