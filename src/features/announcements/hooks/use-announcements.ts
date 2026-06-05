"use client";

import { useState, useTransition, useCallback } from "react";
import { z } from "zod";
import { createGlobalAnnouncement, deleteGlobalAnnouncement } from "../actions/announcement.actions";
import { announcementSchema } from "@/features/announcements/contracts/announcement.contract";

export function useAnnouncements() {
  const [isPending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const create = useCallback(async (input: z.infer<typeof announcementSchema>) => {
    setPending(true); setError(null);
    return new Promise<{ ok: boolean; error?: string }>((resolve) => {
      startTransition(async () => {
        const result = await createGlobalAnnouncement(input);
        setPending(false);
        if (!result.success) setError(result.error);
        resolve({ ok: result.success, error: result.success ? undefined : result.error });
      });
    });
  }, []);

  const remove = useCallback(async (announcementId: string) => {
    setPending(true); setError(null);
    return new Promise<{ ok: boolean; error?: string }>((resolve) => {
      startTransition(async () => {
        const result = await deleteGlobalAnnouncement(announcementId);
        setPending(false);
        if (!result.success) setError(result.error);
        resolve({ ok: result.success, error: result.success ? undefined : result.error });
      });
    });
  }, []);

  return { isPending, error, create, remove };
}
