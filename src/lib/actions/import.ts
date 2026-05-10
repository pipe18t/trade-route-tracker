"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

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
  const supabase = await createClient();

  // Get zones for mapping
  const { data: zones } = await supabase.from("zones").select("*");

  let imported = 0;
  let skipped = 0;
  const errors: string[] = [];

  for (const c of clients) {
    try {
      // Find zone by comuna mapping
      let zone_id = c.zone_id || null;
      if (!zone_id && c.comuna && zones) {
        for (const zone of zones) {
          const zoneComunas =
            COMUNA_TO_ZONE_MAP[zone.name] || [];
          if (zoneComunas.includes(c.comuna.toLowerCase())) {
            zone_id = zone.id;
            break;
          }
        }
      }

      // Check duplicates (same name + comuna)
      const { data: existing, error: lookupErr } = await supabase
        .from("clients")
        .select("id")
        .eq("name", c.name)
        .eq("comuna", c.comuna)
        .maybeSingle();

      if (existing) {
        skipped++;
        continue;
      }

      const { error } = await supabase.from("clients").insert({
        name: c.name,
        address: c.address || null,
        region: c.region,
        comuna: c.comuna || null,
        zone_id,
        executive: c.executive || null,
        visit_day: c.visit_day || null,
        dispatch_day: c.dispatch_day || null,
      });

      if (error) {
        errors.push(`${c.name}: ${error.message}`);
      } else {
        imported++;
      }
    } catch (e) {
      errors.push(`${c.name}: ${String(e)}`);
    }
  }

  revalidatePath("/clientes");
  revalidatePath("/importar");
  return { imported, skipped, errors };
}

const COMUNA_TO_ZONE_MAP: Record<string, string[]> = {
  "Providencia / Manuel Montt / Bilbao": [
    "providencia",
    "manuel montt",
    "bilbao",
  ],
  "Ñuñoa / Plaza Ñuñoa": ["ñuñoa", "nuñoa"],
  "La Reina / Larraín": ["la reina", "larraín", "larrain"],
  "Las Condes / Vitacura": [
    "las condes",
    "vitacura",
    "lo barnechea",
    "la dehesa",
  ],
  "Santiago Centro / Bellavista": [
    "santiago",
    "santiago centro",
    "bellavista",
    "recoleta",
    "independencia",
    "estación central",
    "estacion central",
  ],
  "Viña del Mar": ["viña del mar", "viña"],
  Valparaíso: ["valparaíso", "valparaiso"],
  "Reñaca / Concón": ["reñaca", "renaca", "concón", "concon"],
  "Quilpué / Villa Alemana": [
    "quilpué",
    "quilpue",
    "villa alemana",
  ],
};
