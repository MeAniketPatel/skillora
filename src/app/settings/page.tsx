import React from "react";
import Link from "next/link";

export default function SettingsPage() {
  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <p className="text-muted-foreground">
        Manage your account settings and preferences.
      </p>
      <p className="mt-6">
        Back to <Link href="/">home</Link>.
      </p>
    </main>
  );
}
