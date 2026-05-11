import { PageSkeleton, TableSkeleton } from "@/components/shared/loading-skeleton";

export default function ClientesLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Clientes</h1>
          <p className="text-muted-foreground">Cartera de clientes y puntos de venta</p>
        </div>
      </div>
      <div className="animate-pulse h-10 bg-muted rounded-lg" />
      <TableSkeleton rows={8} cols={6} />
    </div>
  );
}
