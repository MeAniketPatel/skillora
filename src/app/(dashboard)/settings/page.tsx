import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getSessionSecurityOverview } from "@/actions/auth.actions";
import SettingsClientForm from "@/components/settings/settings-form";

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
    <div className="py-4">
      <SettingsClientForm
        user={{ name, email, role }}
        authSessions={authSessions}
      />
    </div>
  );
}
