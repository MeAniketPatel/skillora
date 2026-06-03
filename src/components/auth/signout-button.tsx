"use client";

import * as React from "react";
import { LogOut } from "lucide-react";

import { logoutCurrentSession } from "@/actions/auth.actions";
import { Button } from "@/components/ui/button";

export default function SignOutButton() {
  const [isPending, setPending] = React.useState(false);

  const handleLogout = async () => {
    setPending(true);
    await logoutCurrentSession();
    setPending(false);
  };

  return (
    <Button variant="ghost" onClick={handleLogout} disabled={isPending} className="gap-2">
      <LogOut className="h-4 w-4" />
      {isPending ? "Signing out..." : "Sign out"}
    </Button>
  );
}
