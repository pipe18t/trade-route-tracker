/**
 * CONSTANTES COMPARTIDAS — fuente única de verdad para labels, tipos y opciones.
 * Importar desde aquí en lugar de definir en cada archivo.
 */

export const STATUS_LABELS: Record<string, string> = {
  pendiente: "Pendiente",
  visitado: "Visitado",
  seguimiento: "Seguimiento",
  no_atendido: "No atendido",
  coordinar_hora: "Coordinar hora",
  administrador_no_disponible: "Adm. no disponible",
};

export const STATUS_COLORS: Record<string, string> = {
  pendiente: "bg-red-100 text-red-800 border-red-200",
  visitado: "bg-green-100 text-green-800 border-green-200",
  seguimiento: "bg-amber-100 text-amber-800 border-amber-200",
  no_atendido: "bg-gray-100 text-gray-800 border-gray-200",
  coordinar_hora: "bg-purple-100 text-purple-800 border-purple-200",
  administrador_no_disponible: "bg-blue-100 text-blue-800 border-blue-200",
};

export const PRIORITY_LABELS: Record<string, string> = {
  alta: "Alta",
  media: "Media",
  baja: "Baja",
};

export const PRIORITY_COLORS: Record<string, string> = {
  alta: "bg-red-100 text-red-800 border-red-200",
  media: "bg-amber-100 text-amber-800 border-amber-200",
  baja: "bg-gray-100 text-gray-800 border-gray-200",
};

export const ROUTE_STATUS: Record<string, string> = {
  planificada: "Planificada",
  en_progreso: "En progreso",
  completada: "Completada",
  cancelada: "Cancelada",
};

export const ROUTE_STATUS_COLORS: Record<string, string> = {
  planificada: "bg-blue-100 text-blue-800",
  en_progreso: "bg-amber-100 text-amber-800",
  completada: "bg-green-100 text-green-800",
  cancelada: "bg-gray-100 text-gray-800",
};

export const CONTACT_ROLES = [
  "Administrador",
  "Garzón",
  "Jefe local",
  "Encargado barra",
  "Dueño",
  "Otro",
] as const;

export const NO_CONTACT_REASONS = [
  "administrador no disponible",
  "administradora en reunión",
  "pedir hora",
  "local cerrado",
  "encargado ocupado",
  "no corresponde visitar en ese horario",
  "otro",
] as const;

export const MENU_EXECUTION_OPTIONS = [
  { value: "correcto", label: "Correcto" },
  { value: "incorrecto", label: "Incorrecto" },
  { value: "no aparece", label: "No aparece" },
  { value: "pendiente revisar", label: "Pendiente revisar" },
] as const;

export const POP_MATERIALS = [
  "ojo de buey",
  "latón",
  "portaplacas",
  "vasos Kross",
  "carta / menú",
  "sticker",
  "refrigerador",
  "toldo / sombrilla",
  "posavasos",
  "ningún material visible",
  "otro",
] as const;

export const OPPORTUNITIES = [
  "falta material POP",
  "mejorar visibilidad en barra",
  "mejorar presencia en carta",
  "oportunidad de capacitación",
  "oportunidad de activación",
  "oportunidad de cambio de mix",
  "local solicita material",
  "local solicita visita comercial",
  "seguimiento con administrador",
  "otro",
] as const;

export const CLIENT_STATUS_OPTIONS = [
  { value: "pendiente", label: "Pendiente" },
  { value: "visitado", label: "Visitado" },
  { value: "seguimiento", label: "Seguimiento" },
  { value: "no_atendido", label: "No atendido" },
  { value: "coordinar_hora", label: "Coordinar hora" },
  { value: "administrador_no_disponible", label: "Adm. no disponible" },
] as const;

export const FINAL_STATUS_OPTIONS = [
  { value: "visitado", label: "Visitado" },
  { value: "seguimiento", label: "Seguimiento" },
  { value: "no_atendido", label: "No atendido" },
  { value: "coordinar_hora", label: "Coordinar hora" },
  { value: "administrador_no_disponible", label: "Adm. no disponible" },
] as const;

export const PHOTO_TYPES = [
  { value: "fachada", label: "Fachada" },
  { value: "barra", label: "Barra" },
  { value: "carta", label: "Carta" },
  { value: "material_pop", label: "Material POP" },
  { value: "competencia", label: "Competencia" },
  { value: "salidas_cerveza", label: "Salidas" },
  { value: "otro", label: "Otro" },
] as const;

export const DAYS = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
] as const;

export const REGIONS = [
  { value: "RM", label: "Región Metropolitana" },
  { value: "V", label: "Quinta Región" },
] as const;

export const COMUNA_TO_ZONE_MAP: Record<string, string[]> = {
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

export const COMUNA_NORMALIZE: Record<string, string> = {
  concon: "Concón",
  quilpue: "Quilpué",
  maipu: "Maipú",
  peñalolen: "Peñalolén",
  peñalolén: "Peñalolén",
  quilpué: "Quilpué",
  concón: "Concón",
  maipú: "Maipú",
};

export const REGION_NORMALIZE: Record<string, string> = {
  metropolitana: "RM",
  "región metropolitana": "RM",
  rm: "RM",
  "r.m.": "RM",
  santiago: "RM",
  v: "V",
  "quinta región": "V",
  "v región": "V",
  valparaiso: "V",
  valparaíso: "V",
  "v region": "V",
  "quinta region": "V",
};

export function getStartOfWeek(): string {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(now.getFullYear(), now.getMonth(), diff);
  return monday.toISOString().split("T")[0];
}
