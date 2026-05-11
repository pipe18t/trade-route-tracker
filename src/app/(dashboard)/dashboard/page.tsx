import { getDashboardStats } from "@/lib/actions/dashboard";
import { verifySession } from "@/lib/dals";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { ZoneProgressCard } from "@/components/dashboard/zone-progress-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/shared/status-badge";
import Link from "next/link";
import {
  Users,
  CheckCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  Calendar,
} from "lucide-react";
import type { ClientStatus } from "@/lib/types/database";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const { profile } = await verifySession();
  const stats = await getDashboardStats();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Bienvenida, {profile.full_name || profile.email}
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        <KpiCard
          title="Total cartera"
          value={stats.kpis.total}
          color="blue"
        />
        <KpiCard
          title="Visitados"
          value={stats.kpis.visitados}
          color="green"
        />
        <KpiCard
          title="Pendientes"
          value={stats.kpis.pendientes}
          color="red"
        />
        <KpiCard
          title="Seguimiento"
          value={stats.kpis.seguimiento}
          color="amber"
        />
        <KpiCard
          title="Avance"
          value={`${stats.kpis.avance}%`}
          color={stats.kpis.avance > 25 ? "green" : stats.kpis.avance > 10 ? "amber" : "red"}
        />
        <KpiCard
          title="Visitas semana"
          value={stats.kpis.weeklyVisits}
          color="blue"
        />
      </div>

      {/* Status distribution + Zone progress */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Status donut chart - simplified as colored bars */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Distribución por estado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.statusDistribution.map((item) => (
                <div key={item.name}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span>{item.name}</span>
                    </div>
                    <span className="font-medium">{item.value}</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${stats.kpis.total ? Math.round((item.value / stats.kpis.total) * 100) : 0}%`,
                        backgroundColor: item.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Zone progress grid */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Avance por zona</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
              {stats.zonesWithProgress
                .sort((a, b) => b.percentage - a.percentage)
                .slice(0, 8)
                .map((zone) => (
                  <ZoneProgressCard key={zone.id} zone={zone} />
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming follow-ups + Recent visits */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Próximos seguimientos */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Próximos seguimientos
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.followUpVisits.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                Sin seguimientos pendientes
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Local</TableHead>
                    <TableHead>Zona</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Acción</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stats.followUpVisits.map((v) => (
                    <TableRow key={v.id}>
                      <TableCell className="font-medium">
                        {(v.client as { name?: string } | null)?.name || "—"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {(v.client as { zone?: { name: string } } | null)?.zone
                          ?.name || "—"}
                      </TableCell>
                      <TableCell>
                        {v.follow_up_date
                          ? new Date(v.follow_up_date).toLocaleDateString(
                              "es-CL"
                            )
                          : "—"}
                      </TableCell>
                      <TableCell className="text-muted-foreground max-w-[200px] truncate">
                        {v.next_action || "—"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Últimas visitas */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Últimas visitas
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.recentVisits.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                Sin visitas registradas
              </p>
            ) : (
              <div className="space-y-3">
                {stats.recentVisits.map((v) => (
                  <div
                    key={v.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-white"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm truncate">
                        {(v.client as { name?: string } | null)?.name || "—"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(v.visit_date).toLocaleDateString("es-CL")}
                        {v.visit_time && ` — ${v.visit_time}`}
                      </p>
                    </div>
                    {v.final_status && (
                      <StatusBadge
                        status={v.final_status as ClientStatus}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Seguimientos pendientes (clientes con status seguimiento) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            Locales que requieren seguimiento
          </CardTitle>
        </CardHeader>
        <CardContent>
          {stats.upcomingFollowUps.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              Sin locales en seguimiento
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Local</TableHead>
                  <TableHead>Zona</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.upcomingFollowUps.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">
                      <Link
                        href={`/clientes/${c.id}`}
                        className="text-blue-600 hover:underline"
                      >
                        {c.name}
                      </Link>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {(c.zone as { name?: string } | null)?.name || "—"}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={c.status as ClientStatus} />
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/clientes/${c.id}/nueva-visita`}
                        className="text-blue-600 text-sm hover:underline"
                      >
                        Registrar visita
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
