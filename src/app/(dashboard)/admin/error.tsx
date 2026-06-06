"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, Shield } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import LinkButton from "@/shared/components/ui/link-button";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[ADMIN_ERROR]", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-border/60 bg-card p-8 text-center shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <h2 className="mt-4 font-heading text-xl font-extrabold tracking-tight">
          Admin panel encountered an error
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          We couldn&apos;t complete this admin action. The incident has been
          logged — try again, or head back to the admin home.
        </p>
        {error.digest && (
          <p className="mt-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            ref: {error.digest}
          </p>
        )}
        <div className="mt-6 flex items-center justify-center gap-2">
          <Button onClick={reset} variant="outline" className="rounded-full">
            <RefreshCw className="mr-2 h-4 w-4" /> Try again
          </Button>
          <LinkButton href="/admin" className="rounded-full">
            <Shield className="mr-2 h-4 w-4" /> Admin home
          </LinkButton>
        </div>
      </div>
    </div>
  );
}
