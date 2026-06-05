import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getSessionSecurityOverview } from "@/actions/auth.actions";
import SettingsClientForm from "@/components/settings/settings-form";
import Link from "next/link";
import { ROUTES } from "@/shared/constants/routes";
import { Shield, Bell, User } from "lucide-react";

export const metadata = {
  title: "Account Settings",
  description: "Configure your Skillora account details, name, email address, password, and preferences.",
};

export default async function SettingsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const name = session.user.name ?? null;
  const email = session.user.email ?? null;
  const role = session.user.role ?? null;
  const sessionSecurity = await getSessionSecurityOverview();
  const authSessions = "data" in sessionSecurity ? sessionSecurity.data ?? [] : [];

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
        <Link
          href={ROUTES.SETTINGS}
          className="flex items-center gap-2 pb-3 text-xs font-bold text-blue-600 border-b-2 border-blue-500 transition-all"
        >
          <User className="h-4 w-4" /> Profile & Security
        </Link>
        <Link
          href={ROUTES.SETTINGS_NOTIFICATIONS}
          className="flex items-center gap-2 pb-3 text-xs font-bold text-neutral-500 hover:text-neutral-850 dark:hover:text-neutral-200 border-b-2 border-transparent transition-all"
        >
          <Bell className="h-4 w-4" /> Email Notifications
        </Link>
        <Link
          href={ROUTES.SETTINGS_PRIVACY}
          className="flex items-center gap-2 pb-3 text-xs font-bold text-neutral-500 hover:text-neutral-850 dark:hover:text-neutral-200 border-b-2 border-transparent transition-all"
        >
          <Shield className="h-4 w-4" /> Privacy Settings
        </Link>
      </div>

      <SettingsClientForm
        user={{ name, email, role }}
        authSessions={authSessions}
      />
    </div>
  );
}
