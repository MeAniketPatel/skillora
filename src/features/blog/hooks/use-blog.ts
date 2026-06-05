"use client";

import { useState, useEffect, useCallback } from "react";
import { blogService } from "../services/blog.service";

export function useBlogList(params?: unknown) {
  const [data, setData] = useState<unknown>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    Promise.resolve((blogService as any).list?.(params))
      .then((d) => { if (!cancelled) { setData(d); setIsLoading(false); } })
      .catch((e) => { if (!cancelled) { setError(e); setIsLoading(false); } });
    return () => { cancelled = true; };
  }, [JSON.stringify(params)]);
  return { data, error, isLoading };
}

export function useBlogDetail(id: string | null | undefined) {
  const [data, setData] = useState<unknown>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(id));
  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setIsLoading(true);
    Promise.resolve((blogService as any).getById?.(id))
      .then((d) => { if (!cancelled) { setData(d); setIsLoading(false); } })
      .catch((e) => { if (!cancelled) { setError(e); setIsLoading(false); } });
    return () => { cancelled = true; };
  }, [id]);
  return { data, error, isLoading };
}

export function useBlogCreate() {
  const [isPending, setIsPending] = useState(false);
  const mutate = useCallback(async (input: unknown) => {
    setIsPending(true);
    try {
      return await (blogService as any).create?.(input);
    } finally {
      setIsPending(false);
    }
  }, []);
  return { mutate, isPending };
}

export function useBlogUpdate() {
  const [isPending, setIsPending] = useState(false);
  const mutate = useCallback(async (input: unknown) => {
    setIsPending(true);
    try {
      return await (blogService as any).update?.(input);
    } finally {
      setIsPending(false);
    }
  }, []);
  return { mutate, isPending };
}

export function useBlogDelete() {
  const [isPending, setIsPending] = useState(false);
  const mutate = useCallback(async (id: string) => {
    setIsPending(true);
    try {
      return await (blogService as any).delete?.(id);
    } finally {
      setIsPending(false);
    }
  }, []);
  return { mutate, isPending };
}
