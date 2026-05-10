import { getClients } from "@/lib/actions/clients";
import { getZones } from "@/lib/actions/zones";
import { ClientTable } from "@/components/clients/client-table";
import { ClientFilters } from "@/components/clients/client-filters";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

async function ClientsContent({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const params = await searchParams;

  const [clients, zones] = await Promise.all([
    getClients({
      region: params.region,
      zone_id: params.zone_id,
      status: params.status,
      priority: params.priority,
      search: params.search,
    }),
    getZones(),
  ]);

  return (
    <div className="space-y-4">
      <ClientFilters zones={zones.map((z) => ({ id: z.id, name: z.name }))} />
      <ClientTable clients={clients} />
    </div>
  );
}

export default function ClientesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Clientes</h1>
          <p className="text-muted-foreground">
            Cartera de clientes y puntos de venta
          </p>
        </div>
        <Link href="/clientes/nuevo">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo cliente
          </Button>
        </Link>
      </div>

      <Suspense
        fallback={
          <div className="space-y-4">
            <div className="h-10 bg-muted animate-pulse rounded-lg" />
            <div className="h-96 bg-muted animate-pulse rounded-lg" />
          </div>
        }
      >
        <ClientsContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
