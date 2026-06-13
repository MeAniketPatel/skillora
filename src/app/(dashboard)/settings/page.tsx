import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getSessionSecurityOverview } from "@/features/auth";
import { SettingsClientForm } from "@/features/settings";
import Link from "next/link";
import { ROUTES } from "@/shared/constants/routes";
import { User, Bell, Shield } from "lucide-react";
import db from "@/shared/lib/prisma";
import { PrivacySettings } from "@/features/settings/components/privacy-settings";
import { NotificationSettings } from "@/features/settings/components/notification-settings";
import { getUserProfile } from "@/features/auth/server";

export const metadata = {
  title: "Account Settings",
  description: "Configure your Skillora account details, name, email address, password, and preferences.",
};

interface SettingsPageProps {
  searchParams: Promise<{ tab?: string }>;
}

export default async function SettingsPage({ searchParams }: SettingsPageProps) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const { tab } = await searchParams;
  const activeTab = tab || "profile";

  const sessionSecurity = await getSessionSecurityOverview();
  const authSessions = "data" in sessionSecurity ? sessionSecurity.data ?? [] : [];

  const [profile, dbUser] = await Promise.all([
    getUserProfile(session.user.id),
    db.user.findUnique({
      where: { id: session.user.id },
      select: {
        password: true,
        profileVisible: true,
        activityVisible: true,
        messagingPreference: true,
        emailPreferences: true,
      },
    }),
  ]);
  const hasPassword = !!dbUser?.password;

  const tabs = [
    { key: "profile", label: "Profile & Security", icon: User, href: `${ROUTES.SETTINGS}?tab=profile` },
    { key: "privacy", label: "Privacy", icon: Shield, href: `${ROUTES.SETTINGS}?tab=privacy` },
    { key: "notifications", label: "Notifications", icon: Bell, href: `${ROUTES.SETTINGS}?tab=notifications` },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-neutral-850 dark:text-neutral-50">Settings</h1>
        <p className="text-sm text-neutral-500 mt-1">
          Manage your account profile, credentials, notifications, and privacy preferences.
        </p>
      </div>

      {/* Tabs navigation */}
      <div className="flex border-b border-neutral-200 dark:border-neutral-850 pb-px gap-6">
        {tabs.map(({ key, label, icon: Icon, href }) => (
          <Link
            key={key}
            href={href}
            className={`flex items-center gap-2 pb-3 text-xs font-bold transition-all ${
              activeTab === key
                ? "text-blue-600 border-b-2 border-blue-500"
                : "text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 border-b-2 border-transparent"
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </div>

      {activeTab === "profile" && (
        <SettingsClientForm
          user={{
            name: profile?.name ?? null,
            email: session.user.email ?? null,
            role: profile?.role ?? null,
            image: profile?.image ?? null,
            headline: profile?.headline ?? null,
            bio: profile?.bio ?? null,
            socialLinks: (profile?.socialLinks as { twitter?: string; linkedin?: string; github?: string }) || {},
            hasPassword,
          }}
          authSessions={authSessions}
        />
      )}

      {activeTab === "privacy" && (
        <PrivacySettings
          initialSettings={{
            profileVisible: dbUser?.profileVisible ?? true,
            activityVisible: dbUser?.activityVisible ?? true,
            messagingPreference: dbUser?.messagingPreference ?? "ALL",
          }}
        />
      )}

      {activeTab === "notifications" && (
        <NotificationSettings
          initialPreferences={{
            digestType: dbUser?.emailPreferences?.digestType ?? "WEEKLY",
            enrollment: dbUser?.emailPreferences?.enrollment ?? true,
            certificates: dbUser?.emailPreferences?.certificates ?? true,
            promotions: dbUser?.emailPreferences?.promotions ?? false,
          }}
        />
      )}
    </div>
  );
}
