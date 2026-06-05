"use client";

import { useState, useTransition, useCallback } from "react";
import { markNotificationAsRead, markAllNotificationsAsRead } from "@/actions/notification.actions";

export function useNotifications() {
  const [isPending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const markRead = useCallback(async (id: string) => {
    setPending(true); setError(null);
    return new Promise<{ ok: boolean; error?: string }>((resolve) => {
      startTransition(async () => {
        const result = await markNotificationAsRead(id);
        setPending(false);
        if (!result.success) setError(result.error);
        resolve({ ok: result.success, error: result.success ? undefined : result.error });
      });
    });
  }, []);

  const markAllRead = useCallback(async () => {
    setPending(true); setError(null);
    return new Promise<{ ok: boolean; error?: string }>((resolve) => {
      startTransition(async () => {
        const result = await markAllNotificationsAsRead();
        setPending(false);
        if (!result.success) setError(result.error);
        resolve({ ok: result.success, error: result.success ? undefined : result.error });
      });
    });
  }, []);

  return { isPending, error, markRead, markAllRead };
}
