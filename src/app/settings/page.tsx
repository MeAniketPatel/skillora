import Link from "next/link";
import { auth } from "@/auth";
import SignOutButton from "@/components/auth/signout-button";

export default async function SettingsPage() {
  const session = await auth();

  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      {!session?.user ? (
        <div>
          <p className="text-muted-foreground mb-4">You are not signed in.</p>
          <Link href="/login" className="text-primary font-medium">
            Sign in
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">Manage your account</p>
          <div className="rounded-md border p-4">
            <p className="text-sm">
              <strong>Name:</strong> {session.user.name || "—"}
            </p>
            <p className="text-sm">
              <strong>Email:</strong> {session.user.email || "—"}
            </p>
            <p className="text-sm">
              <strong>Role:</strong> {session.user.role || "—"}
            </p>
            <div className="mt-4">
              <SignOutButton />
            </div>
          </div>
        </div>
      )}

      <p className="mt-6">
        Back to <Link href="/">home</Link>.
      </p>
    </main>
  );
}
