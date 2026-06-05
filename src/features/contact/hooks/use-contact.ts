"use client";

import { useState, useEffect, useCallback } from "react";
import { contactService } from "../services/contact.service";

export function useContactList(params?: unknown) {
  const [data, setData] = useState<unknown>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    Promise.resolve((contactService as any).list?.(params))
      .then((d) => { if (!cancelled) { setData(d); setIsLoading(false); } })
      .catch((e) => { if (!cancelled) { setError(e); setIsLoading(false); } });
    return () => { cancelled = true; };
  }, [JSON.stringify(params)]);
  return { data, error, isLoading };
}

export function useContactDetail(id: string | null | undefined) {
  const [data, setData] = useState<unknown>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(id));
  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setIsLoading(true);
    Promise.resolve((contactService as any).getById?.(id))
      .then((d) => { if (!cancelled) { setData(d); setIsLoading(false); } })
      .catch((e) => { if (!cancelled) { setError(e); setIsLoading(false); } });
    return () => { cancelled = true; };
  }, [id]);
  return { data, error, isLoading };
}

export function useContactCreate() {
  const [isPending, setIsPending] = useState(false);
  const mutate = useCallback(async (input: unknown) => {
    setIsPending(true);
    try {
      return await (contactService as any).create?.(input);
    } finally {
      setIsPending(false);
    }
  }, []);
  return { mutate, isPending };
}

export function useContactUpdate() {
  const [isPending, setIsPending] = useState(false);
  const mutate = useCallback(async (input: unknown) => {
    setIsPending(true);
    try {
      return await (contactService as any).update?.(input);
    } finally {
      setIsPending(false);
    }
  }, []);
  return { mutate, isPending };
}

export function useContactDelete() {
  const [isPending, setIsPending] = useState(false);
  const mutate = useCallback(async (id: string) => {
    setIsPending(true);
    try {
      return await (contactService as any).delete?.(id);
    } finally {
      setIsPending(false);
    }
  }, []);
  return { mutate, isPending };
}
