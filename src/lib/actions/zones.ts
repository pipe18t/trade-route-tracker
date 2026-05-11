"use server";

import { createClient as createSupabaseClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getZones() {
  const supabase = await createSupabaseClient();
  const { data, error } = await supabase
    .from("zones")
    .select("*")
    .order("region")
    .order("name");
  if (error) {
    console.error("getZones error:", JSON.stringify(error));
    throw error;
  }
  return data;
}

export async function createZone(formData: FormData) {
  const supabase = await createSupabaseClient();
  const name = formData.get("name") as string;
  const region = formData.get("region") as string;
  const description = formData.get("description") as string;

  const { error } = await supabase.from("zones").insert({
    name,
    region,
    description: description || null,
  });

  if (error) throw new Error(error.message);
  revalidatePath("/configuracion/zonas");
}

export async function updateZone(id: string, formData: FormData) {
  const supabase = await createSupabaseClient();
  const name = formData.get("name") as string;
  const region = formData.get("region") as string;
  const description = formData.get("description") as string;

  const { error } = await supabase
    .from("zones")
    .update({ name, region, description: description || null })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/configuracion/zonas");
}

export async function deleteZone(id: string) {
  const supabase = await createSupabaseClient();
  const { error } = await supabase.from("zones").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/configuracion/zonas");
}
