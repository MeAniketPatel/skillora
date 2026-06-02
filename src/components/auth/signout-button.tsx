"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";

export default function SignOutButton() {
  const [isPending, setPending] = React.useState(false);

  const handleLogout = async () => {
    setPending(true);
    try {
      await fetch("/api/auth/signout", { method: "POST" });
    } catch (e) {
      try {
        window.location.href = "/api/auth/signout";
      } catch (err) {
        // ignore
      }
    } finally {
      setPending(false);
      window.location.reload();
    }
  };

  return (
    <Button variant="ghost" onClick={handleLogout} disabled={isPending}>
      Sign out
    </Button>
  );
}
