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
    .select("*, client:clients(name, address, status)")
    .eq("route_id", id)
    .order("position", { ascending: true });

  return { ...route, clients: routeClients || [] };
}

export async function createRoute(formData: FormData) {
  const supabase = await createSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const name = formData.get("name") as string;
  const region = formData.get("region") as string;
  const zoneId = formData.get("zone_id") as string;
  const routeDate = formData.get("route_date") as string;
  const clientIds = formData.getAll("client_ids") as string[];

  const { data: route, error } = await supabase
    .from("routes")
    .insert({
      user_id: user?.id ?? null,
      name,
      region: region || null,
      zone_id: zoneId || null,
      route_date: routeDate || null,
      status: "planificada",
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);

  // Insert route_clients with position
  if (clientIds.length > 0) {
    const routeClientInserts = clientIds.map((clientId, index) => ({
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
