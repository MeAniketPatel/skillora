"use client";

import { useState, useTransition, useCallback } from "react";
import { createReview, updateReview, deleteReview } from "../actions/review.actions";

export function useReviews() {
  const [isPending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const create = useCallback(async (values: unknown) => {
    setPending(true); setError(null);
    return new Promise<{ ok: boolean; error?: string }>((resolve) => {
      startTransition(async () => {
        const result = await createReview(values);
        setPending(false);
        if (!result.success) setError(result.error);
        resolve({ ok: result.success, error: result.success ? undefined : result.error });
      });
    });
  }, []);

  const update = useCallback(async (reviewId: string, values: unknown) => {
    setPending(true); setError(null);
    return new Promise<{ ok: boolean; error?: string }>((resolve) => {
      startTransition(async () => {
        const result = await updateReview(reviewId, values);
        setPending(false);
        if (!result.success) setError(result.error);
        resolve({ ok: result.success, error: result.success ? undefined : result.error });
      });
    });
  }, []);

  const remove = useCallback(async (reviewId: string) => {
    setPending(true); setError(null);
    return new Promise<{ ok: boolean; error?: string }>((resolve) => {
      startTransition(async () => {
        const result = await deleteReview(reviewId);
        setPending(false);
        if (!result.success) setError(result.error);
        resolve({ ok: result.success, error: result.success ? undefined : result.error });
      });
    });
  }, []);

  return { isPending, error, create, update, remove };
}
