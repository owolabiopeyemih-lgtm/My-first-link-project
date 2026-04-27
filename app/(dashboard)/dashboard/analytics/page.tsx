import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function AnalyticsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const profile = await db.profile.findUnique({
    where: { userId: session.user.id },
  });
  if (!profile) redirect("/onboarding");

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const [referrerCounts, deviceCounts, hourCounts, topLinks] = await Promise.all([
    // Traffic sources
    db.pageView.groupBy({
      by: ["referrer"],
      where: { profileId: profile.id, createdAt: { gte: thirtyDaysAgo } },
      _count: true,
      orderBy: { _count: { referrer: "desc" } },
      take: 8,
    }),
    // Device breakdown
    db.pageView.groupBy({
      by: ["device"],
      where: { profileId: profile.id, createdAt: { gte: thirtyDaysAgo } },
      _count: true,
    }),
    // Time-of-day heatmap (hours 0-23)
    db.pageView.groupBy({
      by: ["hour"],
      where: { profileId: profile.id, createdAt: { gte: thirtyDaysAgo }, hour: { not: null } },
      _count: true,
    }),
    // Top links by clicks
    db.link.findMany({
      where: { profileId: profile.id },
      include: { _count: { select: { clicks: true } } },
      orderBy: { clicks: { _count: "desc" } },
      take: 10,
    }),
  ]);

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-sm text-gray-500">Last 30 days</p>
      </div>

      {/* Traffic Sources */}
      <Section title="Traffic sources">
        {referrerCounts.length === 0 ? (
          <Empty />
        ) : (
          <div className="space-y-2">
            {referrerCounts.map((r) => (
              <BarRow
                key={r.referrer ?? "direct"}
                label={r.referrer ?? "Direct"}
                count={r._count}
                max={referrerCounts[0]._count}
              />
            ))}
          </div>
        )}
      </Section>

      {/* Device Breakdown */}
      <Section title="Devices">
        <div className="flex gap-6 flex-wrap">
          {deviceCounts.map((d) => (
            <div key={d.device} className="text-center">
              <div className="text-2xl font-bold">{d._count}</div>
              <div className="text-sm text-gray-500 capitalize">{(d.device ?? "Unknown").toLowerCase()}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* Top Links */}
      <Section title="Top links">
        {topLinks.length === 0 ? (
          <Empty />
        ) : (
          <div className="space-y-2">
            {topLinks.map((link) => (
              <BarRow
                key={link.id}
                label={link.label}
                count={link._count.clicks}
                max={topLinks[0]._count.clicks}
              />
            ))}
          </div>
        )}
      </Section>

      {/* Time-of-day heatmap placeholder */}
      <Section title="Time of day (UTC+1 WAT)">
        <div className="grid grid-cols-6 sm:grid-cols-12 gap-1">
          {Array.from({ length: 24 }).map((_, h) => {
            const entry = hourCounts.find((e) => e.hour === h);
            const max = Math.max(...hourCounts.map((e) => e._count), 1);
            const opacity = entry ? entry._count / max : 0;
            return (
              <div
                key={h}
                title={`${h}:00 — ${entry?._count ?? 0} views`}
                className="aspect-square rounded"
                style={{ backgroundColor: `rgba(242, 140, 24, ${opacity})`, minHeight: 28 }}
              />
            );
          })}
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>12am</span><span>6am</span><span>12pm</span><span>6pm</span><span>11pm</span>
        </div>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
      <h2 className="font-semibold text-gray-900">{title}</h2>
      {children}
    </div>
  );
}

function Empty() {
  return <p className="text-sm text-gray-400">No data yet.</p>;
}

function BarRow({ label, count, max }: { label: string; count: number; max: number }) {
  const pct = max > 0 ? (count / max) * 100 : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-700 w-20 sm:w-32 truncate shrink-0">{label}</span>
      <div className="flex-1 bg-gray-100 rounded-full h-2">
        <div className="bg-brand-400 h-2 rounded-full" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-sm text-gray-500 w-10 text-right">{count}</span>
    </div>
  );
}
