import { CardSkeleton } from "@/components/shared/loading-skeleton";

export default function RutasLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Rutas</h1>
          <p className="text-muted-foreground">Planifica y gestiona tus rutas de visita</p>
        </div>
      </div>
      <CardSkeleton count={4} />
    </div>
  );
}
