import { Badge } from "@/components/ui/badge";
import { type ClientStatus } from "@/lib/types/database";

const statusConfig: Record<ClientStatus, { label: string; className: string }> = {
  pendiente: {
    label: "Pendiente",
    className: "bg-red-100 text-red-800 border-red-200",
  },
  visitado: {
    label: "Visitado",
    className: "bg-green-100 text-green-800 border-green-200",
  },
  seguimiento: {
    label: "Seguimiento",
    className: "bg-amber-100 text-amber-800 border-amber-200",
  },
  no_atendido: {
    label: "No atendido",
    className: "bg-gray-100 text-gray-800 border-gray-200",
  },
  coordinar_hora: {
    label: "Coordinar hora",
    className: "bg-purple-100 text-purple-800 border-purple-200",
  },
  administrador_no_disponible: {
    label: "Adm. no disponible",
    className: "bg-blue-100 text-blue-800 border-blue-200",
  },
};

export function StatusBadge({ status }: { status: ClientStatus }) {
  const config = statusConfig[status] ?? statusConfig.pendiente;
  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  );
}
