export function SectionSkeleton({ rows = 1, height = "h-48" }: { rows?: number; height?: string }) {
  return (
    <div className="space-y-3">
      {/* Section header skeleton */}
      <div className="flex items-center gap-3">
        <div className="w-1 h-7 bg-muted rounded-full" />
        <div className="w-8 h-8 rounded-xl bg-muted" />
        <div className="h-5 w-36 bg-muted rounded-xl animate-pulse" />
      </div>
      {/* Content skeleton */}
      <div className={`w-full ${height} bg-muted rounded-3xl animate-pulse`} />
      {Array.from({ length: rows - 1 }).map((_, i) => (
        <div key={i} className="h-16 bg-muted rounded-2xl animate-pulse" />
      ))}
    </div>
  );
}

export function SidebarWidgetSkeleton() {
  return (
    <div className="bg-card rounded-3xl border border-border p-6 space-y-4">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl bg-muted animate-pulse" />
        <div className="h-4 w-28 bg-muted rounded-lg animate-pulse" />
      </div>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center justify-between py-3 border-t border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-muted animate-pulse" />
            <div className="space-y-1">
              <div className="h-3 w-20 bg-muted rounded animate-pulse" />
              <div className="h-2 w-12 bg-muted rounded animate-pulse" />
            </div>
          </div>
          <div className="space-y-1 items-end flex flex-col">
            <div className="h-3 w-16 bg-muted rounded animate-pulse" />
            <div className="h-3 w-10 bg-muted rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}