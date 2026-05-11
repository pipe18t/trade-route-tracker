"use server";

import { createClient as createSupabaseClient } from "@/lib/supabase/server";

export async function generateWeeklyReport(
  startDate: string,
  endDate: string,
  region: string,
  zoneId: string
) {
  const supabase = await createSupabaseClient();

  // Get user name
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: profile } = user
    ? await supabase.from("profiles").select("full_name").eq("id", user.id).single()
    : { data: null };
  const userName = profile?.full_name || user?.email || "Sin nombre";

  // Get visits in date range
  let query = supabase
    .from("visits")
    .select("*, client:clients(name, comuna, zone:zones(name))")
    .gte("visit_date", startDate)
    .lte("visit_date", endDate)
    .order("visit_date", { ascending: false });

  if (region && region !== "all") {
    query = query.eq("client.region", region);
  }
  if (zoneId && zoneId !== "all") {
    query = query.eq("client.zone_id", zoneId);
  }

  const { data: visits, error } = await query;

  if (error) throw new Error(error.message);

  const typedVisits = (visits || []) as VisitWithClient[];

  // Calculate stats
  const totalVisits = typedVisits.length;
  const seguimiento = typedVisits.filter(
    (v) => v.final_status === "seguimiento"
  ).length;
  const noAtendidos = typedVisits.filter(
    (v) => v.final_status === "no_atendido"
  ).length;
  const conOportunidad = typedVisits.filter(
    (v) => v.opportunity_type && v.opportunity_type.length > 0
  ).length;

  // Zones worked
  const zoneNames = new Set<string>();
  typedVisits.forEach((v) => {
    const name = (v.client as { zone?: { name?: string } } | null)?.zone
      ?.name;
    if (name) zoneNames.add(name);
  });

  // Group opportunities
  const opportunities: Record<string, string[]> = {};
  typedVisits.forEach((v) => {
    if (v.opportunity_type) {
      const clientName = (v.client as { name?: string } | null)?.name || "Sin nombre";
      v.opportunity_type.forEach((o) => {
        if (!opportunities[o]) opportunities[o] = [];
        if (!opportunities[o].includes(clientName)) {
          opportunities[o].push(clientName);
        }
      });
    }
  });

  // Follow-ups needed
  const followUps = typedVisits.filter(
    (v) => v.follow_up_date && v.follow_up_date > endDate
  );

  return {
    startDate,
    endDate,
    userName,
    region: region === "V" ? "Quinta Región" : "RM",
    zones: Array.from(zoneNames).join(", "),
    stats: {
      totalVisits,
      seguimiento,
      noAtendidos,
      conOportunidad,
    },
    visits: typedVisits,
    opportunities,
    followUps,
  };
}

interface VisitWithClient {
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
