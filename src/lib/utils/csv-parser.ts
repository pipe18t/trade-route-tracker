export interface ParsedRow {
  name: string;
  address: string;
  region: string;
  comuna: string;
  executive: string;
  visit_day: string;
  dispatch_day: string;
}

const COMUNA_NORMALIZE: Record<string, string> = {
  concon: "Concón",
  quilpue: "Quilpué",
  maipu: "Maipú",
  peñalolen: "Peñalolén",
  peñalolén: "Peñalolén",
  quilpué: "Quilpué",
  concón: "Concón",
  maipú: "Maipú",
};

const REGION_NORMALIZE: Record<string, string> = {
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

const ZONE_COMUNA_MAP: Record<string, string[]> = {
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

function normalizeComuna(comuna: string): string {
  const key = comuna.trim().toLowerCase();
  return COMUNA_NORMALIZE[key] || comuna.trim();
}

function normalizeRegion(region: string): string {
  const key = region.trim().toLowerCase();
  return REGION_NORMALIZE[key] || region.trim();
}

function splitNameAddress(raw: string): { name: string; address: string } {
  const parts = raw.split(";");
  if (parts.length >= 2) {
    return {
      name: parts[0].trim(),
      address: parts.slice(1).join(";").trim(),
    };
  }
  return { name: raw.trim(), address: "" };
}

export function parseCSV(text: string): ParsedRow[] {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length < 2) return [];

  // Detect delimiter
  const firstLine = lines[0];
  const delimiter = firstLine.includes("\t")
    ? "\t"
    : firstLine.includes(";")
    ? ";"
    : ",";

  function parseLine(line: string): string[] {
    const result: string[] = [];
    let current = "";
    let inQuotes = false;

    for (const char of line) {
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === delimiter && !inQuotes) {
        result.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  }

  const headers = parseLine(lines[0]).map((h) => h.toLowerCase().trim());

  const nameIdx = headers.findIndex(
    (h) =>
      h.includes("cliente") || h === "nombre" || h === "local" || h === "name"
  );
  const regionIdx = headers.findIndex(
    (h) => h === "región" || h === "region" || h === "region"
  );
  const comunaIdx = headers.findIndex(
    (h) => h === "comuna" || h === "comuna"
  );
  const execIdx = headers.findIndex(
    (h) =>
      h === "ejecutivo" || h === "executive" || h === "ejecutiva"
  );
  const visitIdx = headers.findIndex(
    (h) =>
      h.includes("visita") || h === "día de visita" || h === "dia de visita" || h === "visit_day"
  );
  const dispatchIdx = headers.findIndex(
    (h) =>
      h.includes("despacho") || h === "dispatch" || h === "dispatch_day"
  );

  const rows: ParsedRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseLine(lines[i]);
    const rawName = nameIdx >= 0 ? values[nameIdx] || "" : "";
    const { name, address } = splitNameAddress(rawName);
    const comuna = comunaIdx >= 0 ? normalizeComuna(values[comunaIdx] || "") : "";
    const region = regionIdx >= 0 ? normalizeRegion(values[regionIdx] || "") : "";

    rows.push({
      name,
      address,
      region,
      comuna,
      executive: execIdx >= 0 ? values[execIdx] || "" : "",
      visit_day: visitIdx >= 0 ? values[visitIdx] || "" : "",
      dispatch_day: dispatchIdx >= 0 ? values[dispatchIdx] || "" : "",
    });
  }

  return rows.filter((r) => r.name);
}
