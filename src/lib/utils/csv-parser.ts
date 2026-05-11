import {
  COMUNA_NORMALIZE,
  REGION_NORMALIZE,
} from "@/lib/constants";

export interface ParsedRow {
  name: string;
  address: string;
  region: string;
  comuna: string;
  executive: string;
  visit_day: string;
  dispatch_day: string;
}

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
    (h) => h === "región" || h === "region"
  );
  const comunaIdx = headers.findIndex(
    (h) => h === "comuna"
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

  if (nameIdx === -1) return [];

  const rows: ParsedRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseLine(lines[i]);
    if (values.length <= nameIdx) continue;
    const rawName = values[nameIdx] || "";
    const { name, address } = splitNameAddress(rawName);
    const comuna = comunaIdx >= 0 && comunaIdx < values.length ? normalizeComuna(values[comunaIdx] || "") : "";
    const region = regionIdx >= 0 && regionIdx < values.length ? normalizeRegion(values[regionIdx] || "") : "";

    rows.push({
      name,
      address,
      region,
      comuna,
      executive: execIdx >= 0 && execIdx < values.length ? values[execIdx] || "" : "",
      visit_day: visitIdx >= 0 && visitIdx < values.length ? values[visitIdx] || "" : "",
      dispatch_day: dispatchIdx >= 0 && dispatchIdx < values.length ? values[dispatchIdx] || "" : "",
    });
  }

  return rows.filter((r) => r.name);
}
