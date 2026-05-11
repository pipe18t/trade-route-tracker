"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard error:", error);
  }, [error]);

  return (
    <div className="p-4 md:p-8">
      <Card className="max-w-lg mx-auto">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <CardTitle>Algo salió mal</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-red-50 border border-red-200 p-3">
            <p className="text-xs font-mono text-red-700 break-all">
              {error.message || "Error desconocido"}
            </p>
            {error.digest && (
              <p className="text-xs text-red-500 mt-1">Digest: {error.digest}</p>
            )}
          </div>
          <Button onClick={reset} variant="outline">
            Reintentar
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
