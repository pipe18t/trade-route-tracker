"use server";

import { createClient as createSupabaseClient } from "@/lib/supabase/server";

export async function getDashboardStats() {
  const supabase = await createSupabaseClient();

  // 1 query para todos los conteos por status
  const { data: statusCounts } = await supabase
    .from("clients")
    .select("status");

  const counts: Record<string, number> = {};
  (statusCounts || []).forEach((c: { status: string }) => {
    counts[c.status] = (counts[c.status] || 0) + 1;
  });

  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  const pendientes = counts.pendiente || 0;
  const visitados = counts.visitado || 0;
  const seguimiento = counts.seguimiento || 0;
  const noAtendido = counts.no_atendido || 0;
  const coordinarHora = counts.coordinar_hora || 0;
  const adminNoDisp = counts.administrador_no_disponible || 0;

  const gestionados =
    visitados + seguimiento + noAtendido + coordinarHora + adminNoDisp;
  const avance = total ? Math.round((gestionados / total) * 100) : 0;

  const startOfWeek = getStartOfWeek();
  const { count: weeklyVisits } = await supabase
    .from("visits")
    .select("*", { count: "exact", head: true })
    .gte("visit_date", startOfWeek);

  const statusDistribution = [
    { name: "Pendiente", value: pendientes, color: "#ef4444" },
    { name: "Visitado", value: visitados, color: "#22c55e" },
    { name: "Seguimiento", value: seguimiento, color: "#f59e0b" },
    { name: "No atendido", value: noAtendido, color: "#6b7280" },
    { name: "Coordinar hora", value: coordinarHora, color: "#a855f7" },
    { name: "Adm. no disponible", value: adminNoDisp, color: "#3b82f6" },
  ];

  // 1 query para zones con sus conteos agrupados
  const { data: zoneStats } = await supabase
    .from("clients")
    .select("zone_id, status, zones!inner(id, name, region)");

  const zonesWithProgress: {
    id: string;
    name: string;
    region: string;
    total: number;
    done: number;
    pending: number;
    percentage: number;
  }[] = [];

  if (zoneStats) {
    const zoneMap = new Map<string, { name: string; region: string; total: number; done: number }>();
    for (const c of zoneStats as unknown as Array<{ zone_id: string; status: string; zones: { id: string; name: string; region: string } }>) {
      if (!c.zone_id || !c.zones) continue;
      const existing = zoneMap.get(c.zone_id) || {
        name: c.zones.name,
        region: c.zones.region,
        total: 0,
        done: 0,
      };
      existing.total++;
      if (c.status !== "pendiente") existing.done++;
      zoneMap.set(c.zone_id, existing);
    }

    for (const [id, data] of zoneMap) {
      zonesWithProgress.push({
        id,
        name: data.name,
        region: data.region,
        total: data.total,
        done: data.done,
        pending: data.total - data.done,
        percentage: Math.round((data.done / data.total) * 100),
      });
    }
  }

  // Próximos seguimientos
  const { data: upcomingFollowUps } = await supabase
    .from("clients")
    .select("id, name, status, zone:zones(name)")
    .in("status", ["seguimiento", "coordinar_hora"])
    .order("name");

  // Visitas con follow_up
  const { data: followUpVisits } = await supabase
    .from("visits")
    .select("*, client:clients(name, zone:zones(name))")
    .not("follow_up_date", "is", null)
    .gte("visit_date", startOfWeek)
    .order("follow_up_date", { ascending: true })
    .limit(10);

  // Últimas visitas
  const { data: recentVisits } = await supabase
    .from("visits")
    .select("id, visit_date, visit_time, final_status, general_notes, client:clients(name, zone:zones(name))")
    .order("created_at", { ascending: false })
    .limit(10);

  return {
    kpis: {
      total,
      visitados,
      pendientes,
      seguimiento,
      gestionados,
      avance,
      weeklyVisits: weeklyVisits || 0,
    },
    statusDistribution,
    zonesWithProgress,
    upcomingFollowUps: upcomingFollowUps || [],
    followUpVisits: followUpVisits || [],
    recentVisits: recentVisits || [],
  };
}

function getStartOfWeek(): string {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(now.getFullYear(), now.getMonth(), diff);
  return monday.toISOString().split("T")[0];
}
