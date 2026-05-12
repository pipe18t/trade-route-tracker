"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { createRoute } from "@/lib/actions/routes";
import { ChevronUp, ChevronDown, X } from "lucide-react";
import type { Zone } from "@/lib/types/database";

interface SelectedClient {
  id: string;
  name: string;
  address: string | null;
  position: number;
}

export default function NuevaRutaPage() {
  const router = useRouter();
  const supabase = createClient();

  const [zones, setZones] = useState<Zone[]>([]);
  const [pendingClients, setPendingClients] = useState<
    { id: string; name: string; address: string | null }[]
  >([]);
  const [selectedClients, setSelectedClients] = useState<SelectedClient[]>([]);
  const [selectedZone, setSelectedZone] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("RM");
  const [routeName, setRouteName] = useState("");
  const [routeDate, setRouteDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase
      .from("zones")
      .select("*")
      .order("region")
      .order("name")
      .then(({ data }) => setZones(data || []));
  }, []);

  useEffect(() => {
    if (!selectedZone) return;
    supabase
      .from("clients")
      .select("id, name, address")
      .eq("zone_id", selectedZone)
      .eq("status", "pendiente")
      .order("name")
      .then(({ data }) => setPendingClients(data || []));
  }, [selectedZone]);

  function addClient(client: { id: string; name: string; address: string | null }) {
    setSelectedClients((prev) => [
      ...prev,
      { ...client, position: prev.length + 1 },
    ]);
  }

  function removeClient(id: string) {
    setSelectedClients((prev) => {
      const filtered = prev.filter((c) => c.id !== id);
      return filtered.map((c, i) => ({ ...c, position: i + 1 }));
    });
  }

  function moveClient(index: number, direction: "up" | "down") {
    setSelectedClients((prev) => {
      const newList = [...prev];
      const target = direction === "up" ? index - 1 : index + 1;
      if (target < 0 || target >= newList.length) return prev;
      [newList[index], newList[target]] = [newList[target], newList[index]];
      return newList.map((c, i) => ({ ...c, position: i + 1 }));
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!routeName.trim()) {
      toast.error("Ingresa un nombre para la ruta");
      return;
    }
    if (selectedClients.length === 0) {
      toast.error("Selecciona al menos un local");
      return;
    }

    setLoading(true);

    try {
      await createRoute({
        name: routeName,
        region: selectedRegion,
        zone_id: selectedZone || null,
        route_date: routeDate || null,
        client_ids: selectedClients.map((c) => c.id),
      });
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Error al crear la ruta. Verifica los permisos e intenta de nuevo."
      );
      setLoading(false);
    }
  }

  const remainingClients = pendingClients.filter(
    (c) => !selectedClients.some((s) => s.id === c.id)
  );

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold">Nueva ruta</h1>
        <p className="text-muted-foreground">
          Selecciona zona y locales para planificar la visita
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Datos de la ruta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre de la ruta *</Label>
                <Input
                  id="name"
                  value={routeName}
                  onChange={(e) => setRouteName(e.target.value)}
                  placeholder="Ej: Ruta Providencia Lunes"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Fecha</Label>
                <Input
                  id="date"
                  type="date"
                  value={routeDate}
                  onChange={(e) => setRouteDate(e.target.value)}
                />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Región</Label>
                <Select value={selectedRegion} onValueChange={(v) => setSelectedRegion(v ?? "RM")}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="RM">RM</SelectItem>
                    <SelectItem value="V">V</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Zona</Label>
                <Select value={selectedZone} onValueChange={(v) => {
                    const value = v ?? "";
                    setSelectedZone(value);
                    if (!value) setPendingClients([]);
                  }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar zona" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Sin zona específica</SelectItem>
                    {zones
                      .filter((z) => z.region === selectedRegion)
                      .map((z) => (
                        <SelectItem key={z.id} value={z.id}>
                          {z.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Selección de locales */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Disponibles */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Locales pendientes ({remainingClients.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {!selectedZone ? (
                  <p className="text-sm text-muted-foreground py-4 text-center">
                    Selecciona una zona para ver locales
                  </p>
                ) : remainingClients.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4 text-center">
                    {pendingClients.length === 0
                      ? "No hay locales pendientes en esta zona"
                      : "Todos los locales fueron seleccionados"}
                  </p>
                ) : (
                  remainingClients.map((client) => (
                    <div
                      key={client.id}
                      className="flex items-center justify-between p-3 rounded-lg border bg-white hover:bg-blue-50 cursor-pointer transition-colors"
                      onClick={() => addClient(client)}
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">
                          {client.name}
                        </p>
                        {client.address && (
                          <p className="text-xs text-muted-foreground truncate">
                            {client.address}
                          </p>
                        )}
                      </div>
                      <Badge variant="outline" className="text-xs flex-shrink-0 ml-2">
                        + Agregar
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Seleccionados */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Ruta planificada ({selectedClients.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {selectedClients.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4 text-center">
                    Selecciona locales de la lista
                  </p>
                ) : (
                  selectedClients.map((client, index) => (
                    <div
                      key={client.id}
                      className="flex items-center gap-2 p-3 rounded-lg border bg-white"
                    >
                      <div className="flex flex-col items-center mr-1">
                        <button
                          type="button"
                          onClick={() => moveClient(index, "up")}
                          className="text-muted-foreground hover:text-foreground disabled:opacity-30"
                          disabled={index === 0}
                        >
                          <ChevronUp className="h-3 w-3" />
                        </button>
                        <span className="text-xs font-bold text-muted-foreground w-5 text-center">
                          {index + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => moveClient(index, "down")}
                          className="text-muted-foreground hover:text-foreground disabled:opacity-30"
                          disabled={index === selectedClients.length - 1}
                        >
                          <ChevronDown className="h-3 w-3" />
                        </button>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {client.name}
                        </p>
                        {client.address && (
                          <p className="text-xs text-muted-foreground truncate">
                            {client.address}
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeClient(client.id)}
                        className="text-muted-foreground hover:text-red-600 flex-shrink-0"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-4 pb-4 md:pb-0">
          <Button type="submit" disabled={loading} size="lg">
            {loading ? "Creando..." : "Guardar ruta"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            size="lg"
          >
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
}
