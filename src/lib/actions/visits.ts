"use server";

import { createClient as createSupabaseClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { Visit } from "@/lib/types/database";
import { visitSchema } from "@/lib/validations/visit.schema";

export async function createVisit(formData: FormData) {
  const supabase = await createSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("No autorizado");

  const clientId = formData.get("client_id") as string;

  const raw = {
    client_id: clientId,
    visit_date: formData.get("visit_date") as string,
    visit_time: (formData.get("visit_time") as string) || undefined,
    contact_name: (formData.get("contact_name") as string) || undefined,
    contact_role: (formData.get("contact_role") as string) || undefined,
    could_talk:
      formData.get("could_talk") === "true"
        ? (true as const)
        : formData.get("could_talk") === "false"
          ? (false as const)
          : undefined,
    no_contact_reason:
      (formData.get("no_contact_reason") as string) || undefined,
    total_taps: formData.get("total_taps")
      ? parseInt(formData.get("total_taps") as string)
      : undefined,
    kross_taps: formData.get("kross_taps")
      ? parseInt(formData.get("kross_taps") as string)
      : undefined,
    best_selling_brand:
      (formData.get("best_selling_brand") as string) || undefined,
    kross_price: formData.get("kross_price")
      ? parseInt(formData.get("kross_price") as string)
      : undefined,
    competitor_price: formData.get("competitor_price")
      ? parseInt(formData.get("competitor_price") as string)
      : undefined,
    kross_on_menu: (formData.get("kross_on_menu") as string) || undefined,
    menu_execution: (formData.get("menu_execution") as string) || undefined,
    pop_material: formData.getAll("pop_material").length > 0
      ? (formData.getAll("pop_material") as string[])
      : undefined,
    most_visible_competitor:
      (formData.get("most_visible_competitor") as string) || undefined,
    recommended_brand_by_staff:
      (formData.get("recommended_brand_by_staff") as string) || undefined,
    competitor_notes:
      (formData.get("competitor_notes") as string) || undefined,
    opportunity_type: formData.getAll("opportunity_type").length > 0
      ? (formData.getAll("opportunity_type") as string[])
      : undefined,
    next_action: (formData.get("next_action") as string) || undefined,
    follow_up_date: (formData.get("follow_up_date") as string) || undefined,
    follow_up_priority:
      (formData.get("follow_up_priority") as string) || undefined,
    general_notes: (formData.get("general_notes") as string) || undefined,
    final_status: (formData.get("final_status") as string) || undefined,
  };

  const parsed = visitSchema.safeParse(raw);

  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors;
    const firstError = Object.values(errors).flat()[0] || "Datos inválidos";
    return { error: firstError };
  }

  const visitData = {
    client_id: parsed.data.client_id,
    user_id: user.id,
    visit_date: parsed.data.visit_date,
    visit_time: parsed.data.visit_time || null,
    contact_name: parsed.data.contact_name || null,
    contact_role: parsed.data.contact_role || null,
    could_talk: parsed.data.could_talk ?? null,
    no_contact_reason: parsed.data.no_contact_reason || null,
    total_taps: parsed.data.total_taps ?? null,
    kross_taps: parsed.data.kross_taps ?? null,
    best_selling_brand: parsed.data.best_selling_brand || null,
    kross_price: parsed.data.kross_price ?? null,
    competitor_price: parsed.data.competitor_price ?? null,
    kross_on_menu: parsed.data.kross_on_menu || null,
    menu_execution: parsed.data.menu_execution || null,
    pop_material: parsed.data.pop_material || null,
    most_visible_competitor: parsed.data.most_visible_competitor || null,
    recommended_brand_by_staff: parsed.data.recommended_brand_by_staff || null,
    competitor_notes: parsed.data.competitor_notes || null,
    opportunity_type: parsed.data.opportunity_type || null,
    next_action: parsed.data.next_action || null,
    follow_up_date: parsed.data.follow_up_date || null,
    follow_up_priority: parsed.data.follow_up_priority || null,
    general_notes: parsed.data.general_notes || null,
    final_status: parsed.data.final_status || null,
  };

  const { data, error } = await supabase
    .from("visits")
    .insert(visitData)
    .select("id")
    .single();

  if (error) return { error: error.message };

  revalidatePath(`/clientes/${clientId}`);
  revalidatePath("/clientes");
  revalidatePath("/dashboard");

  return { success: true, visitId: data.id };
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
  return data as {
    id: string;
    photo_url: string;
    photo_type: string;
    visit_id: string;
    created_at: string;
  }[];
}
