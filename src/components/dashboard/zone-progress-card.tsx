import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ZoneProgress {
  id: string;
  name: string;
  region: string;
  total: number;
  done: number;
  pending: number;
  percentage: number;
}

interface ZoneProgressCardProps {
  zone: ZoneProgress;
}

function getProgressColor(pct: number): string {
  if (pct >= 50) return "bg-green-500";
  if (pct >= 25) return "bg-amber-500";
  return "bg-red-500";
}

export function ZoneProgressCard({ zone }: ZoneProgressCardProps) {
  return (
    <Link href={`/clientes?zone_id=${zone.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium truncate">
              {zone.name}
            </CardTitle>
            <Badge variant="outline" className="text-xs">
              {zone.region}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between mb-2">
            <div>
              <span className="text-2xl font-bold">
                {zone.percentage}%
              </span>
            </div>
            <div className="text-xs text-muted-foreground text-right">
              <span className="text-green-600 font-medium">{zone.done}</span>
              {" / "}
              <span>{zone.total}</span>
            </div>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all",
                getProgressColor(zone.percentage)
              )}
              style={{ width: `${Math.max(zone.percentage, 2)}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {zone.pending} pendientes
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
