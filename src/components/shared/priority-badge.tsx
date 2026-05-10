import { Badge } from "@/components/ui/badge";
import { type Priority } from "@/lib/types/database";

const priorityConfig: Record<Priority, { label: string; className: string }> = {
  alta: {
    label: "Alta",
    className: "bg-red-100 text-red-800 border-red-200",
  },
  media: {
    label: "Media",
    className: "bg-amber-100 text-amber-800 border-amber-200",
  },
  baja: {
    label: "Baja",
    className: "bg-gray-100 text-gray-800 border-gray-200",
  },
};

export function PriorityBadge({ priority }: { priority: Priority }) {
  const config = priorityConfig[priority] ?? priorityConfig.media;
  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  );
}
