import { CardSkeleton, ListSkeleton } from "@/shared/components/shared/loading-skeleton";

export default function MarketingLoading() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-10 px-4 py-10 sm:px-6 lg:px-8">
      <div className="space-y-3">
        <div className="h-10 w-2/3 animate-pulse rounded-lg bg-muted" />
        <div className="h-4 w-1/2 animate-pulse rounded-lg bg-muted" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>

      <div className="space-y-3">
        <div className="h-6 w-1/4 animate-pulse rounded bg-muted" />
        <ListSkeleton count={3} />
      </div>
    </div>
  );
}
