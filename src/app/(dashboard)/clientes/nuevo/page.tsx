import { getZones } from "@/lib/actions/zones";
import { ClientForm } from "@/components/clients/client-form";

export default async function NuevoClientePage() {
  const zones = await getZones();

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold">Nuevo cliente</h1>
        <p className="text-muted-foreground">
          Agregar un nuevo local a la cartera
        </p>
      </div>
      <ClientForm zones={zones} />
    </div>
  );
}
