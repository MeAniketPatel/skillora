"use client";

import { useState, useTransition, useCallback } from "react";
import { z } from "zod";
import {
  createFeatureFlagAction,
  toggleFeatureFlagAction,
  updateFeatureFlagRolloutAction,
  deleteFeatureFlagAction,
} from "@/actions/feature-flag.actions";
import {
  featureFlagSchema,
  toggleFeatureFlagSchema,
  updateRolloutSchema,
} from "@/features/feature-flags/contracts/feature-flag.contract";

export function useFeatureFlag() {
  const [isPending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const create = useCallback(async (input: z.infer<typeof featureFlagSchema>) => {
    setPending(true);
    setError(null);
    return new Promise<{ ok: boolean; error?: string }>((resolve) => {
      startTransition(async () => {
        const result = await createFeatureFlagAction(input);
        setPending(false);
        if (!result.success) setError(result.error);
        resolve({ ok: result.success, error: result.success ? undefined : result.error });
      });
    });
  }, []);

  const toggle = useCallback(async (input: z.infer<typeof toggleFeatureFlagSchema>) => {
    setPending(true);
    setError(null);
    return new Promise<{ ok: boolean; error?: string }>((resolve) => {
      startTransition(async () => {
        const result = await toggleFeatureFlagAction(input);
        setPending(false);
        if (!result.success) setError(result.error);
        resolve({ ok: result.success, error: result.success ? undefined : result.error });
      });
    });
  }, []);

  const updateRollout = useCallback(async (input: z.infer<typeof updateRolloutSchema>) => {
    setPending(true);
    setError(null);
    return new Promise<{ ok: boolean; error?: string }>((resolve) => {
      startTransition(async () => {
        const result = await updateFeatureFlagRolloutAction(input);
        setPending(false);
        if (!result.success) setError(result.error);
        resolve({ ok: result.success, error: result.success ? undefined : result.error });
      });
    });
  }, []);

  const remove = useCallback(async (id: string) => {
    setPending(true);
    setError(null);
    return new Promise<{ ok: boolean; error?: string }>((resolve) => {
      startTransition(async () => {
        const result = await deleteFeatureFlagAction(id);
        setPending(false);
        if (!result.success) setError(result.error);
        resolve({ ok: result.success, error: result.success ? undefined : result.error });
      });
    });
  }, []);

  return { isPending, error, create, toggle, updateRollout, remove };
}
