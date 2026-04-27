import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { OnboardingForm } from "@/components/onboarding/onboarding-form";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Claim your link" };

export default async function OnboardingPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const profile = await db.profile.findUnique({ where: { userId: session.user.id } });
  if (profile) redirect("/dashboard");

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-1">
          <div className="text-3xl font-bold text-brand-500 mb-4">LinkNG</div>
          <h1 className="text-2xl font-bold">Claim your link</h1>
          <p className="text-sm text-gray-500">
            Your page will live at linkng.co/username
          </p>
        </div>
        <OnboardingForm />
      </div>
    </main>
  );
}
