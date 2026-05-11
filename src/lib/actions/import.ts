"use server";

import { createClient as createSupabaseClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { COMUNA_TO_ZONE_MAP } from "@/lib/constants";

interface ClientImport {
  name: string;
  address?: string;
  region: string;
  comuna?: string;
  zone_id?: string;
  executive?: string;
  visit_day?: string;
  dispatch_day?: string;
}

export async function importClients(
  clients: ClientImport[]
): Promise<{ imported: number; skipped: number; errors: string[] }> {
  const supabase = await createSupabaseClient();

  const { data: zones } = await supabase.from("zones").select("*");

  let imported = 0;
  let skipped = 0;
  const errors: string[] = [];

  // Batch duplicates check
  const names = [...new Set(clients.map((c) => c.name))];
  const comunas = [...new Set(clients.map((c) => c.comuna).filter(Boolean))];
  const { data: existing } = await supabase
    .from("clients")
    .select("name, comuna")
    .in("name", names);
  const existingSet = new Set((existing || []).map((e) => `${e.name}||${e.comuna || ""}`));

  const toInsert = [];
  for (const c of clients) {
    try {
      const key = `${c.name}||${c.comuna || ""}`;
      if (existingSet.has(key)) {
        skipped++;
        continue;
      }

      let zone_id = c.zone_id || null;
      if (!zone_id && c.comuna && zones) {
        for (const zone of zones) {
          const zoneComunas = COMUNA_TO_ZONE_MAP[zone.name] || [];
          if (zoneComunas.includes(c.comuna.toLowerCase())) {
            zone_id = zone.id;
            break;
          }
        }
      }

      toInsert.push({
        name: c.name,
        address: c.address || null,
        region: c.region,
        comuna: c.comuna || null,
        zone_id,
        executive: c.executive || null,
        visit_day: c.visit_day || null,
        dispatch_day: c.dispatch_day || null,
      });
    } catch (e) {
      errors.push(`${c.name}: ${String(e)}`);
    }
  }

  // Batch insert
  if (toInsert.length > 0) {
    const { error } = await supabase.from("clients").insert(toInsert);
    if (error) {
      errors.push(`Error batch: ${error.message}`);
    } else {
      imported = toInsert.length;
    }
  }

  revalidatePath("/clientes");
  revalidatePath("/importar");
  return { imported, skipped, errors };
}
