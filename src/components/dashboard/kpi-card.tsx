import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  color?: "default" | "green" | "red" | "amber" | "blue";
  className?: string;
}

const colorMap = {
  default: "text-foreground",
  green: "text-green-600",
  red: "text-red-600",
  amber: "text-amber-600",
  blue: "text-blue-600",
};

export function KpiCard({
  title,
  value,
  subtitle,
  color = "default",
  className,
}: KpiCardProps) {
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className={cn("text-3xl font-bold", colorMap[color])}>{value}</p>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  );
}
