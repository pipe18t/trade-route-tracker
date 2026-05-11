"use server";

import { createClient as createSupabaseClient } from "@/lib/supabase/server";

export async function getDashboardStats() {
  const supabase = await createSupabaseClient();

  const { count: total, error: totalErr } = await supabase
    .from("clients")
    .select("*", { count: "exact", head: true });

  const { count: visitados, error: vErr } = await supabase
    .from("clients")
    .select("*", { count: "exact", head: true })
    .eq("status", "visitado");

  const { count: pendientes, error: pErr } = await supabase
    .from("clients")
    .select("*", { count: "exact", head: true })
    .eq("status", "pendiente");

  const { count: seguimiento, error: sErr } = await supabase
    .from("clients")
    .select("*", { count: "exact", head: true })
    .eq("status", "seguimiento");

  const { count: noAtendido } = await supabase
    .from("clients")
    .select("*", { count: "exact", head: true })
    .eq("status", "no_atendido");

  const { count: coordinarHora } = await supabase
    .from("clients")
    .select("*", { count: "exact", head: true })
    .eq("status", "coordinar_hora");

  const { count: adminNoDisp } = await supabase
    .from("clients")
    .select("*", { count: "exact", head: true })
    .eq("status", "administrador_no_disponible");

  // Gestionados = all except pendiente
  const gestionados =
    (visitados || 0) +
    (seguimiento || 0) +
    (noAtendido || 0) +
    (coordinarHora || 0) +
    (adminNoDisp || 0);

  const avance = total ? Math.round((gestionados / total) * 100) : 0;

  // Visitas de la semana actual
  const startOfWeek = getStartOfWeek();
  const { count: weeklyVisits } = await supabase
    .from("visits")
    .select("*", { count: "exact", head: true })
    .gte("visit_date", startOfWeek);

  // Distribución por estado
  const statusDistribution = [
    { name: "Pendiente", value: pendientes || 0, color: "#ef4444" },
    { name: "Visitado", value: visitados || 0, color: "#22c55e" },
    { name: "Seguimiento", value: seguimiento || 0, color: "#f59e0b" },
    { name: "No atendido", value: noAtendido || 0, color: "#6b7280" },
    { name: "Coordinar hora", value: coordinarHora || 0, color: "#a855f7" },
    {
      name: "Adm. no disponible",
      value: adminNoDisp || 0,
      color: "#3b82f6",
    },
  ];

  // Avance por zona
  const { data: zoneStats } = await supabase
    .from("zones")
    .select("id, name, region");

  const zonesWithProgress = [];
  if (zoneStats) {
    for (const zone of zoneStats) {
      const { count: zoneTotal } = await supabase
        .from("clients")
        .select("*", { count: "exact", head: true })
        .eq("zone_id", zone.id);

      if (!zoneTotal) continue;

      const { count: zoneDone } = await supabase
        .from("clients")
        .select("*", { count: "exact", head: true })
        .eq("zone_id", zone.id)
        .neq("status", "pendiente");

      zonesWithProgress.push({
        id: zone.id,
        name: zone.name,
        region: zone.region,
        total: zoneTotal,
        done: zoneDone || 0,
        pending: zoneTotal - (zoneDone || 0),
        percentage: Math.round(((zoneDone || 0) / zoneTotal) * 100),
      });
    }
  }

  // Próximos seguimientos
  const { data: upcomingFollowUps } = await supabase
    .from("clients")
    .select("id, name, status, zone:zones(name)")
    .in("status", ["seguimiento", "coordinar_hora"])
    .order("name");

  // Visitas de esta semana con follow_up_date
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
      total: total || 0,
      visitados: visitados || 0,
      pendientes: pendientes || 0,
      seguimiento: seguimiento || 0,
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
  const monday = new Date(now.setDate(diff));
  return monday.toISOString().split("T")[0];
}
