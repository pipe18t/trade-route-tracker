"use client";

import { useState, useEffect } from "react";
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
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { generateWeeklyReport } from "@/lib/actions/reports";
import { STATUS_LABELS, getStartOfWeek } from "@/lib/constants";
import {
  Copy,
  FileText,
  Download,
  RefreshCw,
  Users,
  AlertTriangle,
  Lightbulb,
} from "lucide-react";

interface ReportData {
  startDate: string;
  endDate: string;
  userName: string;
  region: string;
  zones: string;
  stats: {
    totalVisits: number;
    seguimiento: number;
    noAtendidos: number;
    conOportunidad: number;
  };
  visits: VisitData[];
  opportunities: Record<string, string[]>;
  followUps: VisitData[];
}

interface VisitData {
  id: string;
  visit_date: string;
  visit_time: string | null;
  final_status: string | null;
  general_notes: string | null;
  opportunity_type: string[] | null;
  next_action: string | null;
  follow_up_date: string | null;
  contact_name: string | null;
  contact_role: string | null;
  could_talk: boolean | null;
  client: {
    name?: string;
    comuna?: string;
    zone?: { name?: string };
  };
}

export default function ReporteSemanalPage() {
  const [zones, setZones] = useState<{ id: string; name: string; region: string }[]>([]);
  const [filters, setFilters] = useState({
      startDate: getStartOfWeek(),
    endDate: new Date().toISOString().split("T")[0],
    region: "RM",
    zoneId: "all",
  });
  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    createClient()
      .from("zones")
      .select("id, name, region")
      .order("name")
      .then(({ data }) => setZones(data || []));
  }, []);

  async function handleGenerate() {
    if (filters.startDate > filters.endDate) {
      toast.error("La fecha de inicio debe ser anterior a la fecha de fin");
      return;
    }
    setLoading(true);
    try {
      const data = await generateWeeklyReport(
        filters.startDate,
        filters.endDate,
        filters.region,
        filters.zoneId
      );
      setReport(data);
    } catch (e) {
      toast.error("Error generando reporte");
    }
    setLoading(false);
  }

  function buildReportText(): string {
    if (!report) return "";

    const start = new Date(report.startDate).toLocaleDateString("es-CL");
    const end = new Date(report.endDate).toLocaleDateString("es-CL");

    const text = `Reporte semanal — Trade Marketing On Trade
Semana: ${start} al ${end}
Ejecutiva: ${report.userName}
Región: ${report.region}
Zonas trabajadas: ${report.zones || "Sin zonas"}

────────────────────────────────────────
RESUMEN EJECUTIVO
────────────────────────────────────────
Durante la semana se realizaron visitas a locales de las zonas ${report.zones || "seleccionadas"}, con foco en levantamiento de ejecución de marca, visibilidad Kross, presencia de competencia y oportunidades de mejora en PDV.

────────────────────────────────────────
INDICADORES
────────────────────────────────────────
• Locales visitados: ${report.stats.totalVisits}
• Locales con seguimiento: ${report.stats.seguimiento}
• Locales no atendidos: ${report.stats.noAtendidos}
• Locales con oportunidad de mejora: ${report.stats.conOportunidad}

────────────────────────────────────────
LOCALES VISITADOS
────────────────────────────────────────
Local | Zona | Estado | Hallazgo
${report.visits
  .map((v) => {
    const name = v.client?.name || "Sin nombre";
    const zone = v.client?.zone?.name || v.client?.comuna || "—";
    const status = STATUS_LABELS[v.final_status || ""] || v.final_status || "—";
    const notes = v.general_notes || v.next_action || "—";
    return `${name} | ${zone} | ${status} | ${notes}`;
  })
  .join("\n")}

────────────────────────────────────────
OPORTUNIDADES DETECTADAS
────────────────────────────────────────
${Object.entries(report.opportunities)
  .map(
    ([tipo, locales]) =>
      `• ${tipo}: ${locales.join(", ")}`
  )
  .join("\n")}

────────────────────────────────────────
PRÓXIMOS PASOS
────────────────────────────────────────
${report.followUps
  .map((v) => {
    const name = v.client?.name || "Sin nombre";
    const date = v.follow_up_date
      ? new Date(v.follow_up_date).toLocaleDateString("es-CL")
      : "Sin fecha";
    const action = v.next_action || "Seguimiento pendiente";
    return `• ${name} (${date}): ${action}`;
  })
  .join("\n")}
`;

    return text;
  }

  async function copyReport() {
    if (!report) return;
    const text = buildReportText();
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Reporte copiado al portapapeles");
    } catch {
      toast.error("No se pudo copiar");
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold">Reporte semanal</h1>
        <p className="text-muted-foreground">
          Genera la minuta semanal para presentar al supervisor
        </p>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label>Fecha inicio</Label>
              <Input
                type="date"
                value={filters.startDate}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, startDate: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Fecha fin</Label>
              <Input
                type="date"
                value={filters.endDate}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, endDate: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Región</Label>
              <Select
                value={filters.region}
                onValueChange={(v) =>
                  setFilters((f) => ({ ...f, region: v ?? "RM", zoneId: "all" }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="RM">RM</SelectItem>
                  <SelectItem value="V">V</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Zona (opcional)</Label>
              <Select
                value={filters.zoneId}
                onValueChange={(v) =>
                  setFilters((f) => ({ ...f, zoneId: v ?? "all" }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {zones
                    .filter(
                      (z) =>
                        filters.region === "all" || z.region === filters.region
                    )
                    .map((z) => (
                      <SelectItem key={z.id} value={z.id}>
                        {z.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button
            onClick={handleGenerate}
            disabled={loading}
            className="mt-4"
            size="lg"
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            {loading ? "Generando..." : "Generar reporte"}
          </Button>
        </CardContent>
      </Card>

      {/* Reporte generado */}
      {report && (
        <>
          {/* Acciones */}
          <div className="flex gap-2">
            <Button onClick={copyReport} size="lg">
              <Copy className="h-4 w-4 mr-2" />
              Copiar reporte
            </Button>
          </div>

          {/* Cabecera */}
          <Card>
            <CardContent className="py-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold">
                  Reporte semanal — Trade Marketing On Trade
                </h2>
                <div className="flex items-center justify-center gap-4 mt-2 text-sm text-muted-foreground">
                  <span>
                    {new Date(report.startDate).toLocaleDateString("es-CL")}
                    {" — "}
                    {new Date(report.endDate).toLocaleDateString("es-CL")}
                  </span>
                  <Separator orientation="vertical" className="h-4" />
                  <span>{report.userName}</span>
                  <Separator orientation="vertical" className="h-4" />
                  <span>{report.region}</span>
                </div>
                {report.zones && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Zonas: {report.zones}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Resumen */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Resumen ejecutivo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Durante la semana se realizaron visitas a locales de las zonas{" "}
                {report.zones || "seleccionadas"}, con foco en levantamiento de
                ejecución de marca, visibilidad Kross, presencia de competencia
                y oportunidades de mejora en PDV.
              </p>
            </CardContent>
          </Card>

          {/* Indicadores */}
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs text-muted-foreground uppercase">
                  Visitados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-green-600">
                  {report.stats.totalVisits}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs text-muted-foreground uppercase">
                  Seguimiento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-amber-600">
                  {report.stats.seguimiento}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs text-muted-foreground uppercase">
                  No atendidos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-gray-600">
                  {report.stats.noAtendidos}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs text-muted-foreground uppercase">
                  Con oportunidad
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-blue-600">
                  {report.stats.conOportunidad}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Tabla de visitas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-4 w-4" />
                Locales visitados ({report.visits.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {report.visits.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  Sin visitas en este período
                </p>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {report.visits.map((v) => (
                    <div
                      key={v.id}
                      className="flex items-start justify-between gap-2 p-3 rounded-lg border bg-white text-sm"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="font-medium">
                          {v.client?.name || "Sin nombre"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(v.visit_date).toLocaleDateString("es-CL")}
                          {v.visit_time && ` — ${v.visit_time}`}
                          {" · "}
                          {v.client?.zone?.name ||
                            v.client?.comuna ||
                            "Sin zona"}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <Badge variant="outline" className="text-xs mb-1">
                          {STATUS_LABELS[v.final_status || ""] ||
                            v.final_status ||
                            "—"}
                        </Badge>
                        {(v.general_notes || v.next_action) && (
                          <p className="text-xs text-muted-foreground max-w-[200px] truncate">
                            {v.general_notes || v.next_action}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Oportunidades */}
          {Object.keys(report.opportunities).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-amber-500" />
                  Oportunidades detectadas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(report.opportunities).map(
                    ([tipo, locales]) => (
                      <div key={tipo}>
                        <p className="text-sm font-medium">{tipo}</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {locales.map((l) => (
                            <Badge
                              key={l}
                              variant="secondary"
                              className="text-xs"
                            >
                              {l}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Próximos pasos */}
          {report.followUps.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  Próximos pasos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {report.followUps.map((v) => (
                    <div
                      key={v.id}
                      className="flex items-center justify-between p-3 rounded-lg border bg-white text-sm"
                    >
                      <div>
                        <p className="font-medium">
                          {v.client?.name || "Sin nombre"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {v.follow_up_date
                            ? new Date(v.follow_up_date).toLocaleDateString(
                                "es-CL"
                              )
                            : "Sin fecha"}
                          {" — "}
                          {v.next_action || "Seguimiento pendiente"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Botón copiar al final */}
          <Button onClick={copyReport} size="lg" className="w-full md:w-auto">
            <Copy className="h-4 w-4 mr-2" />
            Copiar reporte completo
          </Button>
        </>
      )}
    </div>
  );
}
