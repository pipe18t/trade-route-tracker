"use server";

import { createClient as createSupabaseClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { Visit } from "@/lib/types/database";

export async function createVisit(formData: FormData) {
  const supabase = await createSupabaseClient();

  const clientId = formData.get("client_id") as string;

  const popMaterialRaw = formData.getAll("pop_material") as string[];
  const opportunityRaw = formData.getAll("opportunity_type") as string[];

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const visitData = {
    client_id: clientId,
    user_id: user?.id ?? null,
    visit_date: formData.get("visit_date") as string,
    visit_time: (formData.get("visit_time") as string) || null,
    contact_name: (formData.get("contact_name") as string) || null,
    contact_role: (formData.get("contact_role") as string) || null,
    could_talk: formData.get("could_talk") === "true" ? true : formData.get("could_talk") === "false" ? false : null,
    no_contact_reason: (formData.get("no_contact_reason") as string) || null,
    total_taps: formData.get("total_taps") ? parseInt(formData.get("total_taps") as string) : null,
    kross_taps: formData.get("kross_taps") ? parseInt(formData.get("kross_taps") as string) : null,
    best_selling_brand: (formData.get("best_selling_brand") as string) || null,
    kross_price: formData.get("kross_price") ? parseInt(formData.get("kross_price") as string) : null,
    competitor_price: formData.get("competitor_price") ? parseInt(formData.get("competitor_price") as string) : null,
    kross_on_menu: (formData.get("kross_on_menu") as string) || null,
    menu_execution: (formData.get("menu_execution") as string) || null,
    pop_material: popMaterialRaw.length > 0 ? popMaterialRaw : null,
    competitors: null,
    most_visible_competitor: (formData.get("most_visible_competitor") as string) || null,
    recommended_brand_by_staff: (formData.get("recommended_brand_by_staff") as string) || null,
    competitor_notes: (formData.get("competitor_notes") as string) || null,
    opportunity_type: opportunityRaw.length > 0 ? opportunityRaw : null,
    next_action: (formData.get("next_action") as string) || null,
    follow_up_date: (formData.get("follow_up_date") as string) || null,
    follow_up_priority: (formData.get("follow_up_priority") as string) || null,
    general_notes: (formData.get("general_notes") as string) || null,
    final_status: (formData.get("final_status") as string) || null,
  };

  const { error } = await supabase.from("visits").insert(visitData);
  if (error) throw new Error(error.message);

  revalidatePath(`/clientes/${clientId}`);
  revalidatePath("/clientes");
  revalidatePath("/dashboard");
  redirect(`/clientes/${clientId}`);
}

export async function uploadVisitPhotos(
  visitId: string,
  clientId: string,
  files: { file: File; photoType: string }[]
) {
  const supabase = await createSupabaseClient();

  for (const { file, photoType } of files) {
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${visitId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("visit-photos")
      .upload(path, file, { upsert: true });

    if (uploadError) throw new Error(uploadError.message);

    const { data: publicUrl } = supabase.storage
      .from("visit-photos")
      .getPublicUrl(path);

    const { error: insertError } = await supabase.from("visit_photos").insert({
      visit_id: visitId,
      client_id: clientId,
      photo_url: publicUrl.publicUrl,
      photo_type: photoType,
    });

    if (insertError) throw new Error(insertError.message);
  }
}

export async function getVisitPhotos(clientId: string) {
  const supabase = await createSupabaseClient();
  const { data, error } = await supabase
    .from("visit_photos")
    .select("*")
    .eq("client_id", clientId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as { id: string; photo_url: string; photo_type: string; visit_id: string; created_at: string }[];
}
