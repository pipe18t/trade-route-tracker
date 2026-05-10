"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Upload, FileText, Check, X, AlertTriangle } from "lucide-react";
import { parseCSV, type ParsedRow } from "@/lib/utils/csv-parser";
import { importClients } from "@/lib/actions/import";
import { useRouter } from "next/navigation";

const SAMPLE_CSV = `"Clientes";"Región";"Comuna";"Ejecutivo";"Día de Visita";"Despacho"
"Calabria ; General Del Canto 45";"RM";"Providencia";"Francisca";"Lunes";"Martes"
"Dublin ; Manuel Montt 130";"RM";"Providencia";"Francisca";"Lunes";"Martes"
"Antonia Lounge Bar ; Pedro de Valdivia 2800";"RM";"Ñuñoa";"Francisca";"Miércoles";"Jueves"`;

export default function ImportarPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ParsedRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    imported: number;
    skipped: number;
    errors: string[];
  } | null>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setResult(null);

    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const rows = parseCSV(text);
      setParsedData(rows);
    };
    reader.readAsText(f);
  }

  async function handleImport() {
    if (parsedData.length === 0) return;
    setLoading(true);

    const res = await importClients(
      parsedData.map((r) => ({
        name: r.name,
        address: r.address,
        region: r.region,
        comuna: r.comuna,
        executive: r.executive,
        visit_day: r.visit_day,
        dispatch_day: r.dispatch_day,
      }))
    );

    setResult(res);
    setLoading(false);
    toast.success(`${res.imported} clientes importados`);

    if (res.errors.length > 0) {
      toast.error(`${res.errors.length} errores`);
    }

    router.refresh();
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold">Importar cartera</h1>
        <p className="text-muted-foreground">
          Carga tu cartera de clientes desde un archivo CSV
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">1. Selecciona el archivo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed rounded-lg p-8 text-center">
            <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground mb-2">
              Arrastra un archivo CSV o haz clic para seleccionar
            </p>
            <Input
              type="file"
              accept=".csv,.txt"
              onChange={handleFile}
            />
          </div>

          <details className="mt-4">
            <summary className="text-sm text-muted-foreground cursor-pointer">
              Ver formato esperado
            </summary>
            <pre className="mt-2 p-3 bg-muted rounded-lg text-xs overflow-auto whitespace-pre">
              {SAMPLE_CSV}
            </pre>
            <p className="text-xs text-muted-foreground mt-1">
              El nombre y dirección pueden ir separados por ; en la columna
              Clientes
            </p>
          </details>
        </CardContent>
      </Card>

      {parsedData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              2. Previsualización ({parsedData.length} registros)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto max-h-80">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50 sticky top-0">
                    <th className="text-left py-2 px-3">Nombre</th>
                    <th className="text-left py-2 px-3">Dirección</th>
                    <th className="text-left py-2 px-3">Región</th>
                    <th className="text-left py-2 px-3">Comuna</th>
                    <th className="text-left py-2 px-3">Ejecutivo</th>
                    <th className="text-left py-2 px-3">Visita</th>
                    <th className="text-left py-2 px-3">Despacho</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {parsedData.slice(0, 50).map((row, i) => (
                    <tr key={i} className="hover:bg-muted/20">
                      <td className="py-2 px-3 font-medium">{row.name}</td>
                      <td className="py-2 px-3 text-muted-foreground">
                        {row.address || "—"}
                      </td>
                      <td className="py-2 px-3">
                        <Badge variant="outline" className="text-xs">
                          {row.region || "—"}
                        </Badge>
                      </td>
                      <td className="py-2 px-3">{row.comuna || "—"}</td>
                      <td className="py-2 px-3">{row.executive || "—"}</td>
                      <td className="py-2 px-3">{row.visit_day || "—"}</td>
                      <td className="py-2 px-3">{row.dispatch_day || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {parsedData.length > 50 && (
              <p className="text-xs text-muted-foreground mt-2">
                Mostrando 50 de {parsedData.length} registros
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {parsedData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">3. Importar</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={handleImport} disabled={loading} size="lg">
              {loading
                ? "Importando..."
                : `Importar ${parsedData.length} clientes`}
            </Button>
          </CardContent>
        </Card>
      )}

      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Resultado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-600" />
                <span className="text-sm">
                  <strong>{result.imported}</strong> importados
                </span>
              </div>
              <div className="flex items-center gap-2">
                <X className="h-5 w-5 text-amber-600" />
                <span className="text-sm">
                  <strong>{result.skipped}</strong> omitidos (duplicados)
                </span>
              </div>
            </div>
            {result.errors.length > 0 && (
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-red-600 mb-2">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-sm font-medium">Errores:</span>
                </div>
                {result.errors.map((err, i) => (
                  <p key={i} className="text-xs text-red-600 ml-6">
                    {err}
                  </p>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
