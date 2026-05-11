import { getClient } from "@/lib/actions/clients";
import { VisitForm } from "@/components/visits/visit-form";
import { notFound } from "next/navigation";

export default async function NuevaVisitaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const client = await getClient(id);

  if (!client) notFound();

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold">Nueva visita</h1>
        <p className="text-muted-foreground">{client.name}</p>
      </div>
      <VisitForm clientId={id} clientName={client.name} />
    </div>
  );
}
