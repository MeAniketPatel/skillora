export default function AuthLoading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-4">
        <div className="h-8 w-3/4 mx-auto animate-pulse rounded-lg bg-muted" />
        <div className="h-4 w-1/2 mx-auto animate-pulse rounded bg-muted" />
        <div className="space-y-3 pt-6">
          <div className="h-10 w-full animate-pulse rounded-lg bg-muted" />
          <div className="h-10 w-full animate-pulse rounded-lg bg-muted" />
          <div className="h-10 w-full animate-pulse rounded-lg bg-muted" />
        </div>
      </div>
    </div>
  );
}
