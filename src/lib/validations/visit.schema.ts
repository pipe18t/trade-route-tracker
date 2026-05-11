import { z } from "zod";

export const visitSchema = z
  .object({
    client_id: z.string().uuid(),
    visit_date: z.string().min(1, "La fecha es obligatoria"),
    visit_time: z.string().optional(),
    contact_name: z.string().optional(),
    contact_role: z.string().optional(),
    could_talk: z.boolean().optional(),
    no_contact_reason: z.string().optional(),
    total_taps: z.coerce.number().int().min(0).optional().nullable(),
    kross_taps: z.coerce.number().int().min(0).optional().nullable(),
    best_selling_brand: z.string().optional(),
    kross_price: z.coerce.number().int().min(0).optional().nullable(),
    competitor_price: z.coerce.number().int().min(0).optional().nullable(),
    kross_on_menu: z.string().optional(),
    menu_execution: z.string().optional(),
    pop_material: z.array(z.string()).optional(),
    competitors: z.string().optional().transform((v) =>
      v
        ? v
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : []
    ),
    most_visible_competitor: z.string().optional(),
    recommended_brand_by_staff: z.string().optional(),
    competitor_notes: z.string().optional(),
    opportunity_type: z.array(z.string()).optional(),
    next_action: z.string().optional(),
    follow_up_date: z.string().optional().nullable(),
    follow_up_priority: z.enum(["alta", "media", "baja"]).optional(),
    general_notes: z.string().optional(),
    final_status: z
      .enum([
        "visitado",
        "seguimiento",
        "no_atendido",
        "coordinar_hora",
        "administrador_no_disponible",
      ])
      .optional(),
  })
  .refine(
    (data) => {
      if (data.could_talk === false && !data.no_contact_reason) {
        return false;
      }
      return true;
    },
    {
      message: "Indica el motivo si no se pudo conversar",
      path: ["no_contact_reason"],
    }
  );

export type VisitFormData = z.infer<typeof visitSchema>;

export const photoUploadSchema = z.object({
  visit_id: z.string().uuid(),
  photo_type: z.enum([
    "fachada",
    "barra",
    "carta",
    "material_pop",
    "competencia",
    "salidas_cerveza",
    "otro",
  ]),
});
