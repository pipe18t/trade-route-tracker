import { z } from "zod";

export const clientSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  address: z.string().optional(),
  region: z.string().min(1, "La región es obligatoria"),
  comuna: z.string().optional(),
  zone_id: z.string().uuid("Zona inválida").optional().nullable(),
  executive: z.string().optional(),
  visit_day: z.string().optional(),
  dispatch_day: z.string().optional(),
  priority: z.enum(["alta", "media", "baja"]).default("media"),
  status: z
    .enum([
      "pendiente",
      "visitado",
      "seguimiento",
      "no_atendido",
      "coordinar_hora",
      "administrador_no_disponible",
    ])
    .default("pendiente"),
  general_notes: z.string().optional(),
});

export type ClientFormData = z.infer<typeof clientSchema>;

export const zoneSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  region: z.string().min(1, "La región es obligatoria"),
  description: z.string().optional(),
});

export type ZoneFormData = z.infer<typeof zoneSchema>;
