import { CardSkeleton, TableSkeleton } from "@/shared/components/shared/loading-skeleton";

export default function TeacherDashboardLoading() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="h-9 w-1/3 animate-pulse rounded-lg bg-muted" />
        <div className="h-4 w-1/2 animate-pulse rounded-lg bg-muted" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>

      <div className="space-y-3">
        <div className="h-6 w-1/4 animate-pulse rounded bg-muted" />
        <TableSkeleton rows={5} />
      </div>
    </div>
  );
}
