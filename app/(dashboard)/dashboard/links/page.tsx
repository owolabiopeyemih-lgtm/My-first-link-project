import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { SortableLinkList } from "@/components/dashboard/sortable-link-list";
import { AddLinkButton } from "@/components/dashboard/add-link-button";
import type { Plan } from "@prisma/client";
import { PLAN_LIMITS } from "@/lib/utils";

export default async function LinksPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const profile = await db.profile.findUnique({
    where: { userId: session.user.id },
    include: {
      links: { orderBy: { order: "asc" } },
    },
  });

  if (!profile) redirect("/onboarding");

  const subscription = await db.subscription.findUnique({
    where: { userId: session.user.id },
  });
  const plan: Plan = subscription?.plan ?? "FREE";
  const maxLinks = PLAN_LIMITS[plan].maxLinks;

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Links</h1>
          <p className="text-sm text-gray-500">
            {profile.links.length}
            {maxLinks === Infinity ? "" : `/${maxLinks}`} links
            {plan === "FREE" && (
              <span className="ml-2 text-brand-500">
                ·{" "}
                <a href="/dashboard/settings#upgrade" className="hover:underline">
                  Upgrade for unlimited
                </a>
              </span>
            )}
          </p>
        </div>
        <AddLinkButton
          profileId={profile.id}
          canAdd={profile.links.length < maxLinks}
          plan={plan}
        />
      </div>

      {profile.links.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center text-gray-400">
          <p className="font-medium">No links yet</p>
          <p className="text-sm mt-1">Add your first link using the button above.</p>
        </div>
      ) : (
        <SortableLinkList links={profile.links} profileId={profile.id} />
      )}
    </div>
  );
}
