"use client";

import { useState, useTransition, useCallback } from "react";
import { updateSetting } from "../actions/settings.actions";

export function useSettings() {
  const [isPending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const update = useCallback(async (values: unknown) => {
    setPending(true); setError(null);
    return new Promise<{ ok: boolean; error?: string }>((resolve) => {
      startTransition(async () => {
        const result = await updateSetting(values);
        setPending(false);
        if (!result.success) setError(result.error);
        resolve({ ok: result.success, error: result.success ? undefined : result.error });
      });
    });
  }, []);

  return { isPending, error, update };
}
