import { getRoutes, deleteRoute, updateRouteStatus } from "@/lib/actions/routes";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ROUTE_STATUS, ROUTE_STATUS_COLORS } from "@/lib/constants";
import { Plus, MapPin, Trash2, Play, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function RutasPage() {
  const routes = await getRoutes();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Rutas</h1>
          <p className="text-muted-foreground">
            Planifica y gestiona tus rutas de visita
          </p>
        </div>
        <Link href="/rutas/nueva">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nueva ruta
          </Button>
        </Link>
      </div>

      {routes.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">Sin rutas planificadas</p>
            <p className="text-sm text-muted-foreground mb-4">
              Crea tu primera ruta para organizar las visitas del día
            </p>
            <Link href="/rutas/nueva">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Crear ruta
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {routes.map((route) => {
            const label = ROUTE_STATUS[route.status] || route.status;
            const className = ROUTE_STATUS_COLORS[route.status] || ROUTE_STATUS_COLORS.planificada;
            const clientCount =
              (route.route_clients as unknown[])?.[0] &&
              typeof (route.route_clients as unknown[])[0] === "object"
                ? ((route.route_clients as unknown[])[0] as { count: number })
                    .count
                : 0;

            return (
              <Card key={route.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base">
                        <Link
                          href={`/rutas/${route.id}`}
                          className="hover:underline"
                        >
                          {route.name}
                        </Link>
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {(route.zone as { name?: string } | null)?.name ||
                          route.region ||
                          "Sin zona"}
                      </p>
                    </div>
                    <Badge className={className}>{label}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>
                      {route.route_date
                        ? new Date(route.route_date).toLocaleDateString(
                            "es-CL"
                          )
                        : "Sin fecha"}{" "}
                      · {clientCount} locales
                    </span>
                    <div className="flex gap-1">
                      {route.status === "planificada" && (
                        <form action={updateRouteStatus.bind(null, route.id, "en_progreso")}>
                          <Button variant="ghost" size="icon-sm" type="submit" title="Iniciar">
                            <Play className="h-4 w-4 text-amber-600" />
                          </Button>
                        </form>
                      )}
                      {route.status !== "completada" &&
                        route.status !== "cancelada" && (
                          <form action={updateRouteStatus.bind(null, route.id, "completada")}>
                            <Button variant="ghost" size="icon-sm" type="submit" title="Completar">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            </Button>
                          </form>
                        )}
                      {route.status !== "cancelada" && (
                        <form action={updateRouteStatus.bind(null, route.id, "cancelada")}>
                          <Button variant="ghost" size="icon-sm" type="submit" title="Cancelar">
                            <XCircle className="h-4 w-4 text-red-600" />
                          </Button>
                        </form>
                      )}
                      <form action={deleteRoute.bind(null, route.id)}>
                        <Button variant="ghost" size="icon-sm" type="submit" title="Eliminar">
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </form>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
