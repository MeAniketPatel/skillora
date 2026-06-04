"use client";

import React, { useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";

interface InfiniteScrollProps {
  hasMore: boolean;
  isLoading: boolean;
  loadMore: () => void;
  children: React.ReactNode;
}

export function InfiniteScroll({
  hasMore,
  isLoading,
  loadMore,
  children,
}: InfiniteScrollProps) {
  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observerElement = observerRef.current;
    if (!observerElement || !hasMore || isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 1.0 }
    );

    observer.observe(observerElement);

    return () => {
      if (observerElement) {
        observer.unobserve(observerElement);
      }
    };
  }, [hasMore, isLoading, loadMore]);

  return (
    <div className="space-y-6">
      {children}
      
      {hasMore && (
        <div ref={observerRef} className="flex justify-center p-4">
          {isLoading && (
            <Loader2 className="h-6 w-6 animate-spin text-neutral-500" />
          )}
        </div>
      )}
    </div>
  );
}
