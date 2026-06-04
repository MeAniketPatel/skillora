"use client";

import { useEffect, useState, RefObject } from "react";

export function useIntersectionObserver(
  elementRef: RefObject<Element | null>,
  { threshold = 0, root = null, rootMargin = "0%" }: IntersectionObserverInit = {}
): IntersectionObserverEntry | null {
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);

  useEffect(() => {
    const node = elementRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(([ent]) => setEntry(ent), {
      threshold,
      root,
      rootMargin,
    });

    observer.observe(node);

    return () => observer.disconnect();
  }, [elementRef, threshold, root, rootMargin]);

  return entry;
}
