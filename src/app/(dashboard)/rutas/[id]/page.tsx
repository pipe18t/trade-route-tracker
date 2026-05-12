import { getRouteWithClients, updateRouteStatus, deleteRoute } from "@/lib/actions/routes";
import { StatusBadge } from "@/components/shared/status-badge";
import { GoogleMapsButton } from "@/components/shared/google-maps-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import {
  MapPin,
  Play,
  CheckCircle,
  XCircle,
  Trash2,
  ArrowLeft,
  Navigation,
} from "lucide-react";
import { ROUTE_STATUS } from "@/lib/constants";
import type { ClientStatus } from "@/lib/types/database";

export const dynamic = "force-dynamic";

export default async function RouteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const route = await getRouteWithClients(id);

  if (!route) notFound();

  // Build Google Maps URL with waypoints
  function buildGoogleMapsUrl() {
    const addresses = (route.clients || [])
      .map(
        (rc: { client?: { address?: string | null; name?: string } }) =>
          rc.client?.address ||
          rc.client?.name ||
          ""
      )
      .filter(Boolean);

    if (addresses.length === 0) return null;
    if (addresses.length === 1) {
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addresses[0])}`;
    }

    const origin = encodeURIComponent(addresses[0]);
    const destination = encodeURIComponent(addresses[addresses.length - 1]);
    const waypoints = (addresses as string[])
      .slice(1, -1)
      .map((a) => encodeURIComponent(a))
      .join("|");

    return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&waypoints=${waypoints}&travelmode=driving`;
  }

  const mapsUrl = buildGoogleMapsUrl();

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-4">
        <Link href="/rutas">
          <Button variant="ghost" size="icon-sm">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">{route.name}</h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge className="bg-blue-100 text-blue-800">
              {ROUTE_STATUS[route.status] || route.status}
            </Badge>
            {(route.zone as { name?: string } | null)?.name && (
              <span className="text-sm text-muted-foreground">
                {(route.zone as { name: string }).name}
              </span>
            )}
            {route.route_date && (
              <span className="text-sm text-muted-foreground">
                {new Date(route.route_date).toLocaleDateString("es-CL")}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Google Maps button */}
      {mapsUrl && (
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium">
                    {route.clients?.length || 0} locales en la ruta
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Abre la ruta completa en Google Maps
                  </p>
                </div>
              </div>
              <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
                <Button size="lg">
                  <Navigation className="h-4 w-4 mr-2" />
                  Ver ruta en Google Maps
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de locales */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Locales ({route.clients?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {(!route.clients || route.clients.length === 0) && (
              <p className="text-sm text-muted-foreground py-4 text-center">
                Sin locales en esta ruta
              </p>
            )}
            {route.clients?.map((rc: Record<string, unknown>, index: number) => {
              const client = rc.client as {
                id: string;
                name: string;
                address?: string | null;
                status?: string;
              };
              return (
                <div
                  key={`${rc.route_id}-${rc.client_id}`}
                  className="flex items-center gap-3 p-3 rounded-lg border bg-white"
                >
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-700 font-bold text-sm flex-shrink-0">
                    {(rc.position as number) || index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    {client.id ? (
                      <Link
                        href={`/clientes/${client.id}`}
                        className="font-medium text-sm hover:underline"
                      >
                        {client.name}
                      </Link>
                    ) : (
                      <span className="font-medium text-sm">
                        {client.name}
                      </span>
                    )}
                    {client.address && (
                      <p className="text-xs text-muted-foreground truncate">
                        {client.address}
                      </p>
                    )}
                  </div>
                  {client.status && (
                    <StatusBadge status={client.status as ClientStatus} />
                  )}
                  <div className="flex gap-1">
                    <GoogleMapsButton
                      address={client.address || undefined}
                      name={client.name}
                    />
                    {client.id && (
                      <Link href={`/clientes/${client.id}/nueva-visita`}>
                        <Button variant="outline" size="sm">
                          Visitar
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Acciones */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Acciones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {route.status === "planificada" && (
              <form
                action={updateRouteStatus.bind(null, id, "en_progreso")}
              >
                <Button type="submit" variant="outline">
                  <Play className="h-4 w-4 mr-2" />
                  Iniciar ruta
                </Button>
              </form>
            )}
            {route.status !== "completada" &&
              route.status !== "cancelada" && (
                <form
                  action={updateRouteStatus.bind(null, id, "completada")}
                >
                  <Button type="submit" variant="outline">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Completar
                  </Button>
                </form>
              )}
            {route.status !== "cancelada" && (
              <form
                action={updateRouteStatus.bind(null, id, "cancelada")}
              >
                <Button type="submit" variant="outline">
                  <XCircle className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
              </form>
            )}
            <form action={deleteRoute.bind(null, id)}>
              <Button type="submit" variant="destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar ruta
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
