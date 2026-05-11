import { KpiSkeleton } from "@/components/shared/loading-skeleton";

export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Cargando indicadores...</p>
      </div>
      <KpiSkeleton count={6} />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="animate-pulse rounded-lg border bg-white p-6 lg:col-span-1">
          <div className="h-4 w-1/3 bg-muted rounded mb-4" />
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-6 bg-muted rounded" />
            ))}
          </div>
        </div>
        <div className="animate-pulse rounded-lg border bg-white p-6 lg:col-span-2">
          <div className="h-4 w-1/3 bg-muted rounded mb-4" />
          <div className="grid gap-3 grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 bg-muted rounded" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
