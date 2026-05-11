import { Badge } from "@/components/ui/badge";
import { STATUS_LABELS, STATUS_COLORS } from "@/lib/constants";
import type { ClientStatus } from "@/lib/types/database";

export function StatusBadge({ status }: { status: ClientStatus }) {
  const label = STATUS_LABELS[status] || status;
  const className = STATUS_COLORS[status] || STATUS_COLORS.pendiente;
  return (
    <Badge variant="outline" className={className}>
      {label}
    </Badge>
  );
}
