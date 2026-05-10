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
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import type { Zone } from "@/lib/types/database";

interface ClientFormProps {
  zones: Zone[];
  client?: Record<string, unknown>;
}

const days = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
];

export function ClientForm({ zones, client }: ClientFormProps) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const isEditing = !!(client?.id);
  const clientId = (client?.id as string) || undefined;

  const [formData, setFormData] = useState({
    name: (client?.name as string) ?? "",
    address: (client?.address as string) ?? "",
    region: (client?.region as string) ?? "",
    comuna: (client?.comuna as string) ?? "",
    zone_id: (client?.zone_id as string) ?? "",
    executive: (client?.executive as string) ?? "",
    visit_day: (client?.visit_day as string) ?? "",
    dispatch_day: (client?.dispatch_day as string) ?? "",
    priority: (client?.priority as string) ?? "media",
    status: (client?.status as string) ?? "pendiente",
    general_notes: (client?.general_notes as string) ?? "",
  });

  function update(field: string, value: string | null) {
    setFormData((prev) => ({ ...prev, [field]: value ?? "" }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const payload = {
      name: formData.name,
      address: formData.address || null,
      region: formData.region,
      comuna: formData.comuna || null,
      zone_id: formData.zone_id || null,
      executive: formData.executive || null,
      visit_day: formData.visit_day || null,
      dispatch_day: formData.dispatch_day || null,
      priority: formData.priority,
      status: formData.status,
      general_notes: formData.general_notes || null,
    };

    let error = null;

    if (isEditing && clientId) {
      const res = await supabase
        .from("clients")
        .update(payload)
        .eq("id", clientId);
      error = res.error;
    } else {
      const res = await supabase.from("clients").insert(payload);
      error = res.error;
    }

    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success(isEditing ? "Cliente actualizado" : "Cliente creado");
    router.push("/clientes");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Datos básicos */}
      <Card>
        <CardHeader>
          <CardTitle>Datos básicos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre del local *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => update("name", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Dirección</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => update("address", e.target.value)}
              />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Región *</Label>
              <Select
                value={formData.region}
                onValueChange={(v) => update("region", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="RM">RM</SelectItem>
                  <SelectItem value="V">V</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="comuna">Comuna</Label>
              <Input
                id="comuna"
                value={formData.comuna}
                onChange={(e) => update("comuna", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Zona</Label>
              <Select
                value={formData.zone_id}
                onValueChange={(v) => update("zone_id", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Sin zona</SelectItem>
                  {zones.map((z) => (
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

      {/* Ruta y ejecución */}
      <Card>
        <CardHeader>
          <CardTitle>Ruta y ejecución</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="executive">Ejecutivo</Label>
              <Input
                id="executive"
                value={formData.executive}
                onChange={(e) => update("executive", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Día visita</Label>
              <Select
                value={formData.visit_day}
                onValueChange={(v) => update("visit_day", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Sin definir</SelectItem>
                  {days.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Día despacho</Label>
              <Select
                value={formData.dispatch_day}
                onValueChange={(v) => update("dispatch_day", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Sin definir</SelectItem>
                  {days.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Prioridad</Label>
              <Select
                value={formData.priority}
                onValueChange={(v) => update("priority", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="alta">Alta</SelectItem>
                  <SelectItem value="media">Media</SelectItem>
                  <SelectItem value="baja">Baja</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estado */}
      <Card>
        <CardHeader>
          <CardTitle>Estado</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Estado actual</Label>
              <Select
                value={formData.status}
                onValueChange={(v) => update("status", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pendiente">Pendiente</SelectItem>
                  <SelectItem value="visitado">Visitado</SelectItem>
                  <SelectItem value="seguimiento">Seguimiento</SelectItem>
                  <SelectItem value="no_atendido">No atendido</SelectItem>
                  <SelectItem value="coordinar_hora">Coordinar hora</SelectItem>
                  <SelectItem value="administrador_no_disponible">
                    Adm. no disponible
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notas generales</Label>
              <Input
                id="notes"
                value={formData.general_notes}
                onChange={(e) => update("general_notes", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button type="submit" disabled={loading}>
          {loading
            ? "Guardando..."
            : isEditing
            ? "Actualizar cliente"
            : "Crear cliente"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}
