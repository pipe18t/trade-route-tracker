"use server";

import { createClient as createSupabaseClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { Client, Visit } from "@/lib/types/database";

export async function getClients(filters?: {
  region?: string;
  comuna?: string;
  zone_id?: string;
  status?: string;
  priority?: string;
  search?: string;
  visit_day?: string;
}) {
  const supabase = await createSupabaseClient();
  let query = supabase
    .from("clients")
    .select("*, zone:zones(name)")
    .order("name");

  if (filters?.region) query = query.eq("region", filters.region);
  if (filters?.comuna) query = query.eq("comuna", filters.comuna);
  if (filters?.zone_id) query = query.eq("zone_id", filters.zone_id);
  if (filters?.status) query = query.eq("status", filters.status);
  if (filters?.priority) query = query.eq("priority", filters.priority);
  if (filters?.visit_day) query = query.eq("visit_day", filters.visit_day);
  if (filters?.search) query = query.ilike("name", `%${filters.search}%`);

  const { data, error } = await query;
  if (error) throw error;
  return data as (Client & { zone: { name: string } | null })[];
}

export async function getClient(id: string) {
  const supabase = await createSupabaseClient();
  const { data, error } = await supabase
    .from("clients")
    .select("*, zone:zones(name)")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data as (Client & { zone: { name: string } | null }) | null;
}

export async function getClientVisits(clientId: string) {
  const supabase = await createSupabaseClient();
  const { data, error } = await supabase
    .from("visits")
    .select("*")
    .eq("client_id", clientId)
    .order("visit_date", { ascending: false });
  if (error) throw error;
  return data as Visit[];
}

export async function createClient(formData: FormData) {
  const supabase = await createSupabaseClient();

  const client = {
    name: formData.get("name") as string,
    address: (formData.get("address") as string) || null,
    region: formData.get("region") as string,
    comuna: (formData.get("comuna") as string) || null,
    zone_id: (formData.get("zone_id") as string) || null,
    executive: (formData.get("executive") as string) || null,
    visit_day: (formData.get("visit_day") as string) || null,
    dispatch_day: (formData.get("dispatch_day") as string) || null,
    priority: (formData.get("priority") as string) || "media",
    status: (formData.get("status") as string) || "pendiente",
    general_notes: (formData.get("general_notes") as string) || null,
  };

  const { error } = await supabase.from("clients").insert(client);
  if (error) return { error: error.message };

  revalidatePath("/clientes");
  redirect("/clientes");
}

export async function updateClient(id: string, formData: FormData) {
  const supabase = await createSupabaseClient();

  const client = {
    name: formData.get("name") as string,
    address: (formData.get("address") as string) || null,
    region: formData.get("region") as string,
    comuna: (formData.get("comuna") as string) || null,
    zone_id: (formData.get("zone_id") as string) || null,
    executive: (formData.get("executive") as string) || null,
    visit_day: (formData.get("visit_day") as string) || null,
    dispatch_day: (formData.get("dispatch_day") as string) || null,
    priority: (formData.get("priority") as string) || "media",
    status: (formData.get("status") as string) || "pendiente",
    general_notes: (formData.get("general_notes") as string) || null,
  };

  const { error } = await supabase
    .from("clients")
    .update(client)
    .eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/clientes");
  revalidatePath(`/clientes/${id}`);
  redirect("/clientes");
}

export async function deleteClientAction(formData: FormData) {
  const id = formData.get("id") as string;
  const supabase = await createSupabaseClient();
  const { error } = await supabase.from("clients").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/clientes");
  redirect("/clientes");
}
