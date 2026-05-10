import { getClient } from "@/lib/actions/clients";
import { getZones } from "@/lib/actions/zones";
import { ClientForm } from "@/components/clients/client-form";
import { notFound } from "next/navigation";

export default async function EditarClientePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [client, zones] = await Promise.all([getClient(id), getZones()]);

  if (!client) notFound();

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold">Editar cliente</h1>
        <p className="text-muted-foreground">{client.name}</p>
      </div>
      <ClientForm zones={zones} client={client as unknown as Record<string, unknown>} />
    </div>
  );
}
