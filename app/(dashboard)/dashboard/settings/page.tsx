import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { ProfileForm } from "@/components/dashboard/profile-form";
import { ThemePicker } from "@/components/dashboard/theme-picker";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const profile = await db.profile.findUnique({
    where: { userId: session.user.id },
  });
  if (!profile) redirect("/onboarding");

  return (
    <div className="space-y-8 max-w-2xl">
      <h1 className="text-2xl font-bold">Settings</h1>

      {/* Profile section */}
      <section className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-semibold">Profile</h2>
        <ProfileForm profile={profile} />
      </section>

      {/* Theme section */}
      <section id="theme" className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-semibold">Theme</h2>
        <ThemePicker currentTheme={profile.theme} />
      </section>

      {/* Danger zone */}
      <section className="bg-white rounded-2xl border border-red-100 p-6 space-y-3">
        <h2 className="font-semibold text-red-600">Danger zone</h2>
        <p className="text-sm text-gray-500">
          Deleting your account is permanent and cannot be undone.
        </p>
        <button className="text-sm text-red-600 border border-red-300 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors">
          Delete account
        </button>
      </section>
    </div>
  );
}
