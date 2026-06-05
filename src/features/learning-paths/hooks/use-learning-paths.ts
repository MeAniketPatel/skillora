"use client";

import { useState, useEffect, useCallback } from "react";
import { learningPathsService } from "../services/learning-paths.service";

export function useLearningPathsList(params?: unknown) {
  const [data, setData] = useState<unknown>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    Promise.resolve((learningPathsService as any).list?.(params))
      .then((d) => { if (!cancelled) { setData(d); setIsLoading(false); } })
      .catch((e) => { if (!cancelled) { setError(e); setIsLoading(false); } });
    return () => { cancelled = true; };
  }, [JSON.stringify(params)]);
  return { data, error, isLoading };
}

export function useLearningPathsDetail(id: string | null | undefined) {
  const [data, setData] = useState<unknown>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(id));
  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setIsLoading(true);
    Promise.resolve((learningPathsService as any).getById?.(id))
      .then((d) => { if (!cancelled) { setData(d); setIsLoading(false); } })
      .catch((e) => { if (!cancelled) { setError(e); setIsLoading(false); } });
    return () => { cancelled = true; };
  }, [id]);
  return { data, error, isLoading };
}

export function useLearningPathsCreate() {
  const [isPending, setIsPending] = useState(false);
  const mutate = useCallback(async (input: unknown) => {
    setIsPending(true);
    try {
      return await (learningPathsService as any).create?.(input);
    } finally {
      setIsPending(false);
    }
  }, []);
  return { mutate, isPending };
}

export function useLearningPathsUpdate() {
  const [isPending, setIsPending] = useState(false);
  const mutate = useCallback(async (input: unknown) => {
    setIsPending(true);
    try {
      return await (learningPathsService as any).update?.(input);
    } finally {
      setIsPending(false);
    }
  }, []);
  return { mutate, isPending };
}

export function useLearningPathsDelete() {
  const [isPending, setIsPending] = useState(false);
  const mutate = useCallback(async (id: string) => {
    setIsPending(true);
    try {
      return await (learningPathsService as any).delete?.(id);
    } finally {
      setIsPending(false);
    }
  }, []);
  return { mutate, isPending };
}
