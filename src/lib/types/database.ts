export type UserRole = "admin" | "supervisor" | "ejecutivo" | "practicante";

export type ClientStatus =
  | "pendiente"
  | "visitado"
  | "seguimiento"
  | "no_atendido"
  | "coordinar_hora"
  | "administrador_no_disponible";

export type Priority = "alta" | "media" | "baja";

export type RouteStatus =
  | "planificada"
  | "en_progreso"
  | "completada"
  | "cancelada";

export type PhotoType =
  | "fachada"
  | "barra"
  | "carta"
  | "material_pop"
  | "competencia"
  | "salidas_cerveza"
  | "otro";

export type MenuExecution =
  | "correcto"
  | "incorrecto"
  | "no aparece"
  | "pendiente revisar";

export type NoContactReason =
  | "administrador no disponible"
  | "administradora en reunión"
  | "pedir hora"
  | "local cerrado"
  | "encargado ocupado"
  | "no corresponde visitar en ese horario"
  | "otro";

export type PopMaterial =
  | "ojo de buey"
  | "latón"
  | "portaplacas"
  | "vasos Kross"
  | "carta / menú"
  | "sticker"
  | "refrigerador"
  | "toldo / sombrilla"
  | "posavasos"
  | "ningún material visible"
  | "otro";

export type OpportunityType =
  | "falta material POP"
  | "mejorar visibilidad en barra"
  | "mejorar presencia en carta"
  | "oportunidad de capacitación"
  | "oportunidad de activación"
  | "oportunidad de cambio de mix"
  | "local solicita material"
  | "local solicita visita comercial"
  | "seguimiento con administrador"
  | "otro";

export interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  role: UserRole;
  created_at: string;
}

export interface Zone {
  id: string;
  name: string;
  region: string;
  description: string | null;
  created_at: string;
}

export interface Client {
  id: string;
  name: string;
  address: string | null;
  region: string | null;
  comuna: string | null;
  zone_id: string | null;
  executive: string | null;
  visit_day: string | null;
  dispatch_day: string | null;
  priority: Priority;
  status: ClientStatus;
  google_maps_url: string | null;
  general_notes: string | null;
  created_at: string;
  updated_at: string;
  zone?: Zone | null;
}

export interface Visit {
  id: string;
  client_id: string;
  user_id: string | null;
  visit_date: string;
  visit_time: string | null;
  contact_name: string | null;
  contact_role: string | null;
  could_talk: boolean | null;
  no_contact_reason: string | null;
  total_taps: number | null;
  kross_taps: number | null;
  best_selling_brand: string | null;
  kross_price: number | null;
  competitor_price: number | null;
  kross_on_menu: string | null;
  menu_execution: string | null;
  pop_material: string[] | null;
  competitors: string[] | null;
  most_visible_competitor: string | null;
  recommended_brand_by_staff: string | null;
  competitor_notes: string | null;
  opportunity_type: string[] | null;
  next_action: string | null;
  follow_up_date: string | null;
  follow_up_priority: string | null;
  general_notes: string | null;
  final_status: string | null;
  created_at: string;
  client?: Client | null;
}

export interface VisitPhoto {
  id: string;
  visit_id: string;
  client_id: string;
  photo_url: string;
  photo_type: PhotoType;
  created_at: string;
}

export interface Route {
  id: string;
  user_id: string | null;
  name: string;
  region: string | null;
  zone_id: string | null;
  route_date: string | null;
  status: RouteStatus;
  created_at: string;
  zone?: Zone | null;
}

export interface RouteClient {
  id: string;
  route_id: string;
  client_id: string;
  position: number | null;
  created_at: string;
}
