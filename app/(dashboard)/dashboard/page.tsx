import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Eye, MousePointerClick, Link2, ArrowRight } from "lucide-react";

export default async function DashboardOverviewPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const profile = await db.profile.findUnique({
    where: { userId: session.user.id },
    include: {
      _count: { select: { links: true } },
    },
  });

  if (!profile) redirect("/onboarding"); // first-time setup

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [pageViews, linkClicks] = await Promise.all([
    db.pageView.count({
      where: { profileId: profile.id, createdAt: { gte: thirtyDaysAgo } },
    }),
    db.linkClick.count({
      where: {
        link: { profileId: profile.id },
        createdAt: { gte: thirtyDaysAgo },
      },
    }),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Overview</h1>
        <p className="text-sm text-gray-500">
          linkng.co/{profile.username} — last 30 days
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon={<Eye size={20} />} label="Page views" value={pageViews} />
        <StatCard icon={<MousePointerClick size={20} />} label="Link clicks" value={linkClicks} />
        <StatCard icon={<Link2 size={20} />} label="Active links" value={profile._count.links} />
      </div>

      {/* Quick actions */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-3">
        <h2 className="font-semibold">Quick actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/dashboard/links"
            className="flex items-center gap-1.5 text-sm text-brand-600 hover:underline"
          >
            Add a link <ArrowRight size={14} />
          </Link>
          <Link
            href="/dashboard/settings#theme"
            className="flex items-center gap-1.5 text-sm text-brand-600 hover:underline"
          >
            Change theme <ArrowRight size={14} />
          </Link>
          <Link
            href={`/${profile.username}`}
            target="_blank"
            className="flex items-center gap-1.5 text-sm text-brand-600 hover:underline"
          >
            Preview page <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 flex items-center gap-4">
      <div className="text-brand-500">{icon}</div>
      <div>
        <div className="text-2xl font-bold">{value.toLocaleString()}</div>
        <div className="text-sm text-gray-500">{label}</div>
      </div>
    </div>
  );
}
