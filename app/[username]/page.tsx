import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import { trackPageView } from "@/lib/analytics";
import { PublicLinkButton } from "@/components/public-page/link-button";
import { getThemeStyles } from "@/lib/themes";

interface Props {
  params: { username: string };
}

// SSR — runs on every request for fresh click counts + real-time live/offline state
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const profile = await db.profile.findUnique({
    where: { username: params.username },
  });
  if (!profile) return {};
  return {
    title: profile.displayName ?? profile.username,
    description: profile.bio ?? `Links for ${profile.displayName ?? profile.username}`,
    openGraph: {
      images: profile.photo ? [profile.photo] : [],
    },
  };
}

export default async function PublicProfilePage({ params }: Props) {
  const profile = await db.profile.findUnique({
    where: { username: params.username },
    include: {
      links: {
        where: { isActive: true },
        orderBy: { order: "asc" },
      },
    },
  });

  if (!profile || !profile.isPublished) notFound();

  // Fire-and-forget page view (non-blocking)
  void trackPageView(profile.id);

  const theme = getThemeStyles(profile.theme);

  return (
    <main
      className="min-h-screen flex flex-col items-center py-12 px-4"
      style={theme.page}
    >
      <div className="w-full max-w-sm space-y-6">
        {/* Profile header */}
        <div className="flex flex-col items-center gap-3 text-center">
          {profile.photo ? (
            <Image
              src={profile.photo}
              alt={profile.displayName ?? profile.username}
              width={96}
              height={96}
              className="rounded-full object-cover w-24 h-24"
              priority
            />
          ) : (
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold"
              style={theme.avatar}
            >
              {(profile.displayName ?? profile.username)[0].toUpperCase()}
            </div>
          )}
          <div>
            <h1 className="text-xl font-bold" style={theme.text}>
              {profile.displayName ?? profile.username}
            </h1>
            {profile.bio && (
              <p className="text-sm mt-1 opacity-75" style={theme.text}>
                {profile.bio}
              </p>
            )}
          </div>
        </div>

        {/* Links */}
        <div className="space-y-3">
          {profile.links.map((link) => (
            <PublicLinkButton key={link.id} link={link} theme={theme} />
          ))}
        </div>

        {/* Footer branding */}
        <p className="text-center text-xs opacity-40 pt-4" style={theme.text}>
          Powered by LinkNG
        </p>
      </div>
    </main>
  );
}
