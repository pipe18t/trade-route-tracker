"use server";

import { createClient as createSupabaseClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function getRoutes() {
  const supabase = await createSupabaseClient();
  const { data, error } = await supabase
    .from("routes")
    .select("*, zone:zones(name, region), route_clients(count)")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function getRouteWithClients(id: string) {
  const supabase = await createSupabaseClient();
  const { data: route, error } = await supabase
    .from("routes")
    .select("*, zone:zones(name, region)")
    .eq("id", id)
    .single();
  if (error) throw error;

  const { data: routeClients } = await supabase
    .from("route_clients")
    .select("*, client:clients(id, name, address, status)")
    .eq("route_id", id)
    .order("position", { ascending: true });

  return { ...route, clients: routeClients || [] };
}

export async function createRoute(data: {
  name: string;
  region?: string;
  zone_id?: string | null;
  route_date?: string | null;
  client_ids: string[];
}) {
  const supabase = await createSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: route, error } = await supabase
    .from("routes")
    .insert({
      user_id: user?.id ?? null,
      name: data.name,
      region: data.region || null,
      zone_id: data.zone_id || null,
      route_date: data.route_date || null,
      status: "planificada",
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);

  if (data.client_ids.length > 0) {
    const routeClientInserts = data.client_ids.map((clientId, index) => ({
      route_id: route.id,
      client_id: clientId,
      position: index + 1,
    }));

    const { error: rcError } = await supabase
      .from("route_clients")
      .insert(routeClientInserts);

    if (rcError) throw new Error(rcError.message);
  }

  revalidatePath("/rutas");
  redirect("/rutas");
}

export async function updateRouteStatus(id: string, status: string) {
  const supabase = await createSupabaseClient();
  const { error } = await supabase
    .from("routes")
    .update({ status })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/rutas");
  revalidatePath(`/rutas/${id}`);
}

export async function deleteRoute(id: string) {
  const supabase = await createSupabaseClient();
  const { error } = await supabase.from("routes").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/rutas");
}

export async function getPendingClientsForZone(zoneId: string) {
  const supabase = await createSupabaseClient();
  const { data, error } = await supabase
    .from("clients")
    .select("id, name, address")
    .eq("zone_id", zoneId)
    .eq("status", "pendiente")
    .order("name");
  if (error) throw error;
  return data;
}

export async function getPendingClientsForRegion(region: string) {
  const supabase = await createSupabaseClient();
  const { data, error } = await supabase
    .from("clients")
    .select("id, name, address, zone:zones(name)")
    .eq("region", region)
    .eq("status", "pendiente")
    .order("name");
  if (error) throw error;
  return data;
}
