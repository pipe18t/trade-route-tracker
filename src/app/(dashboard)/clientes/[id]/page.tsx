import { getClient, getClientVisits } from "@/lib/actions/clients";
import { getZones } from "@/lib/actions/zones";
import { getVisitPhotos } from "@/lib/actions/visits";
import { StatusBadge } from "@/components/shared/status-badge";
import { PriorityBadge } from "@/components/shared/priority-badge";
import { GoogleMapsButton } from "@/components/shared/google-maps-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ClientForm } from "@/components/clients/client-form";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Plus,
  MapPin,
  Clock,
  Image as ImageIcon,
  ChevronRight,
} from "lucide-react";
import type { ClientStatus, Priority } from "@/lib/types/database";

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [client, visits, zones, photos] = await Promise.all([
    getClient(id),
    getClientVisits(id),
    getZones(),
    getVisitPhotos(id),
  ]);

  if (!client) notFound();

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{client.name}</h1>
          <div className="flex items-center gap-2 mt-2">
            <StatusBadge status={(client.status || "pendiente") as ClientStatus} />
            <PriorityBadge priority={(client.priority || "media") as Priority} />
            {client.visit_day && (
              <Badge variant="outline" className="text-xs">
                <Clock className="h-3 w-3 mr-1" />
                {client.visit_day}
              </Badge>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <GoogleMapsButton address={client.address} name={client.name} />
          <Link href={`/clientes/${id}/nueva-visita`}>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Registrar visita
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Información</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {client.address && (
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <span>{client.address}</span>
              </div>
            )}
            {client.region && (
              <div>
                <span className="text-muted-foreground">Región:</span>{" "}
                <span className="font-medium">
                  {client.region === "RM" ? "Metropolitana" : "Quinta Región"}
                </span>
              </div>
            )}
            {client.comuna && (
              <div>
                <span className="text-muted-foreground">Comuna:</span>{" "}
                <span className="font-medium">{client.comuna}</span>
              </div>
            )}
            {(client.zone as { name?: string } | null)?.name && (
              <div>
                <span className="text-muted-foreground">Zona:</span>{" "}
                <span className="font-medium">
                  {(client.zone as { name: string }).name}
                </span>
              </div>
            )}
            {client.executive && (
              <div>
                <span className="text-muted-foreground">Ejecutivo:</span>{" "}
                <span className="font-medium">{client.executive}</span>
              </div>
            )}
            {client.dispatch_day && (
              <div>
                <span className="text-muted-foreground">Despacho:</span>{" "}
                <span className="font-medium">{client.dispatch_day}</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Notas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {client.general_notes || "Sin notas"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Fotos */}
      {photos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              <div className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                Fotos ({photos.length})
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 grid-cols-3 md:grid-cols-4">
              {photos.map((photo) => (
                <a
                  key={photo.id}
                  href={photo.photo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative rounded-lg border overflow-hidden aspect-square group"
                >
                  <img
                    src={photo.photo_url}
                    alt={photo.photo_type}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-black/50 px-2 py-1">
                    <p className="text-xs text-white truncate">
                      {photo.photo_type}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Historial de visitas */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Historial de visitas ({visits.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {visits.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              Sin visitas registradas
            </p>
          ) : (
            <div className="space-y-3">
              {visits.map((visit) => (
                <div
                  key={visit.id}
                  className="flex items-start justify-between gap-4 p-3 rounded-lg border bg-white"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm">
                      {new Date(visit.visit_date).toLocaleDateString("es-CL")}{" "}
                      {visit.visit_time && `— ${visit.visit_time}`}
                    </p>
                    {visit.contact_name && (
                      <p className="text-xs text-muted-foreground">
                        Contacto: {visit.contact_name}
                        {visit.contact_role && ` (${visit.contact_role})`}
                      </p>
                    )}
                    {visit.general_notes && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {visit.general_notes}
                      </p>
                    )}
                    {visit.opportunity_type &&
                      visit.opportunity_type.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {visit.opportunity_type.map((o) => (
                            <Badge
                              key={o}
                              variant="secondary"
                              className="text-xs"
                            >
                              {o}
                            </Badge>
                          ))}
                        </div>
                      )}
                  </div>
                  {visit.final_status && (
                    <div className="flex-shrink-0">
                      <StatusBadge
                        status={visit.final_status as ClientStatus}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Editar */}
      <ClientForm zones={zones} client={client as unknown as Record<string, unknown>} />
    </div>
  );
}
