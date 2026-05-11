import { Badge } from "@/components/ui/badge";
import { PRIORITY_LABELS, PRIORITY_COLORS } from "@/lib/constants";
import type { Priority } from "@/lib/types/database";

export function PriorityBadge({ priority }: { priority: Priority }) {
  const label = PRIORITY_LABELS[priority] || priority;
  const className = PRIORITY_COLORS[priority] || PRIORITY_COLORS.media;
  return (
    <Badge variant="outline" className={className}>
      {label}
    </Badge>
  );
}
