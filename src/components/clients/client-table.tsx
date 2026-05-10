"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import { PriorityBadge } from "@/components/shared/priority-badge";
import { GoogleMapsButton } from "@/components/shared/google-maps-button";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { type Client, type ClientStatus, type Priority } from "@/lib/types/database";
import { deleteClientAction } from "@/lib/actions/clients";

interface ClientTableProps {
  clients: Client[];
}

export function ClientTable({ clients }: ClientTableProps) {
  return (
    <div className="space-y-4">
      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left py-3 px-4 font-medium">Nombre</th>
              <th className="text-left py-3 px-4 font-medium">Dirección</th>
              <th className="text-left py-3 px-4 font-medium">Zona</th>
              <th className="text-left py-3 px-4 font-medium">Estado</th>
              <th className="text-left py-3 px-4 font-medium">Prioridad</th>
              <th className="text-left py-3 px-4 font-medium">Visita</th>
              <th className="text-right py-3 px-4 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {clients.length === 0 && (
              <tr>
                <td colSpan={7} className="py-8 text-center text-muted-foreground">
                  No se encontraron clientes
                </td>
              </tr>
            )}
            {clients.map((client) => (
              <tr key={client.id} className="hover:bg-muted/30">
                <td className="py-3 px-4">
                  <Link
                    href={`/clientes/${client.id}`}
                    className="font-medium text-blue-600 hover:underline"
                  >
                    {client.name}
                  </Link>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  {client.address || "—"}
                </td>
                <td className="py-3 px-4">
                  {(client.zone as { name?: string } | null)?.name || client.region || "—"}
                </td>
                <td className="py-3 px-4">
                  <StatusBadge status={(client.status || "pendiente") as ClientStatus} />
                </td>
                <td className="py-3 px-4">
                  <PriorityBadge priority={(client.priority || "media") as Priority} />
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  {client.visit_day || "—"}
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center justify-end gap-1">
                    <GoogleMapsButton
                      address={client.address || undefined}
                      name={client.name}
                    />
                    <Link href={`/clientes/${client.id}`}>
                      <Button variant="ghost" size="icon-sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href={`/clientes/${client.id}/editar`}>
                      <Button variant="ghost" size="icon-sm">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </Link>
                    <form action={deleteClientAction}>
                      <input type="hidden" name="id" value={client.id} />
                      <Button variant="ghost" size="icon-sm" type="submit" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {clients.length === 0 && (
          <p className="text-center text-muted-foreground py-8">
            No se encontraron clientes
          </p>
        )}
        {clients.map((client) => (
          <div
            key={client.id}
            className="rounded-lg border bg-white p-4 space-y-2"
          >
            <div className="flex items-start justify-between">
              <Link
                href={`/clientes/${client.id}`}
                className="font-medium text-blue-600 hover:underline"
              >
                {client.name}
              </Link>
              <StatusBadge status={(client.status || "pendiente") as ClientStatus} />
            </div>
            {client.address && (
              <p className="text-sm text-muted-foreground">{client.address}</p>
            )}
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">
                {(client.zone as { name?: string } | null)?.name || client.region || "—"}
              </span>
              <PriorityBadge priority={(client.priority || "media") as Priority} />
            </div>
            <div className="flex items-center justify-between pt-2 border-t">
              <GoogleMapsButton
                address={client.address || undefined}
                name={client.name}
              />
              <div className="flex items-center gap-1">
                <Link href={`/clientes/${client.id}`}>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
