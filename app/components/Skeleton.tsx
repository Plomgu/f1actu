export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-gray-200 ${className}`} />;
}

export function NewsListSkeleton() {
  return (
    <div>
      <Skeleton className="h-3 w-40 mb-3" />
      <div className="divide-y divide-gray-100">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-baseline gap-3 py-2.5 px-2">
            <Skeleton className="h-3 w-8 shrink-0" />
            <div className="flex-1 min-w-0 space-y-1.5">
              <Skeleton className="h-3.5 w-[85%]" />
              <Skeleton className="h-2.5 w-16" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function StandingsSidebarSkeleton() {
  return (
    <div className="space-y-1.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-2 py-1.5 px-1.5">
          <Skeleton className="w-1 h-8 rounded" />
          <Skeleton className="h-7 w-7 rounded-full shrink-0" />
          <Skeleton className="h-8 w-8 rounded-full shrink-0" />
          <div className="flex-1 min-w-0 space-y-1.5">
            <Skeleton className="h-3 w-3/4" />
            <Skeleton className="h-2.5 w-1/2" />
          </div>
          <Skeleton className="h-3 w-8 shrink-0" />
        </div>
      ))}
    </div>
  );
}

export function StandingsRowsSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-2 py-1.5 px-1.5">
          <Skeleton className="w-1 h-8 rounded" />
          <Skeleton className="h-7 w-7 rounded-full shrink-0" />
          <Skeleton className="h-8 w-8 rounded-full shrink-0" />
          <div className="flex-1 min-w-0 space-y-1.5">
            <Skeleton className="h-3 w-2/3" />
            <Skeleton className="h-2.5 w-1/3" />
          </div>
          <Skeleton className="h-3 w-8 shrink-0" />
        </div>
      ))}
    </div>
  );
}

export function LeaderCardSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-100 bg-gray-50 px-3 py-2.5">
      <Skeleton className="h-2.5 w-24 mb-2" />
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1 min-w-0 space-y-1.5">
          <Skeleton className="h-3.5 w-2/3" />
          <Skeleton className="h-2.5 w-1/3" />
        </div>
        <Skeleton className="h-3.5 w-10 shrink-0" />
      </div>
    </div>
  );
}
