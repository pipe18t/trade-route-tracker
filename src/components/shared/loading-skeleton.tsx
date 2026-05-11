export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="rounded-lg border overflow-hidden">
      <div className="grid gap-px bg-muted animate-pulse">
        <div className="flex bg-background p-4">
          {Array.from({ length: cols }).map((_, i) => (
            <div key={i} className="h-4 flex-1 bg-muted rounded mx-2" />
          ))}
        </div>
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="flex bg-background p-4">
            {Array.from({ length: cols }).map((_, c) => (
              <div
                key={c}
                className="h-4 bg-muted rounded mx-2"
                style={{ flex: c === 0 ? 2 : 1 }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function CardSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-lg border bg-white p-4 space-y-3 animate-pulse">
          <div className="h-4 w-2/3 bg-muted rounded" />
          <div className="h-3 w-1/2 bg-muted rounded" />
          <div className="h-8 w-full bg-muted rounded mt-4" />
        </div>
      ))}
    </div>
  );
}

export function KpiSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-lg border bg-white p-4 animate-pulse">
          <div className="h-3 w-1/2 bg-muted rounded mb-2" />
          <div className="h-8 w-1/3 bg-muted rounded" />
        </div>
      ))}
    </div>
  );
}

export function FormSkeleton({ sections = 3 }: { sections?: number }) {
  return (
    <div className="space-y-6 animate-pulse">
      {Array.from({ length: sections }).map((_, i) => (
        <div key={i} className="rounded-lg border bg-white p-6 space-y-4">
          <div className="h-5 w-1/3 bg-muted rounded" />
          <div className="grid gap-4 grid-cols-2">
            <div className="space-y-2">
              <div className="h-3 w-1/4 bg-muted rounded" />
              <div className="h-9 w-full bg-muted rounded" />
            </div>
            <div className="space-y-2">
              <div className="h-3 w-1/4 bg-muted rounded" />
              <div className="h-9 w-full bg-muted rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div>
        <div className="h-8 w-48 bg-muted rounded mb-2" />
        <div className="h-4 w-64 bg-muted rounded" />
      </div>
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-lg border bg-white p-4">
            <div className="h-3 w-1/2 bg-muted rounded mb-2" />
            <div className="h-8 w-1/3 bg-muted rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
