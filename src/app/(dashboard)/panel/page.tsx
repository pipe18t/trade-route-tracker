import { verifySession } from "@/lib/dals";
import { createClient as createSupabaseClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Database,
  Route,
  Shield,
  User,
  Table2,
  Globe,
  Key,
  Clock,
} from "lucide-react";

export const dynamic = "force-dynamic";

const ROUTES = [
  { path: "/", type: "redirect", auth: false, desc: "Redirige a /dashboard" },
  { path: "/login", type: "page", auth: false, desc: "Login magic link" },
  { path: "/auth/callback", type: "api", auth: false, desc: "Callback OTP Supabase" },
  { path: "/api/auth/logout", type: "api", auth: true, desc: "Cierra sesión" },
  { path: "/dashboard", type: "page", auth: true, desc: "KPIs y avance" },
  { path: "/clientes", type: "page", auth: true, desc: "Cartera de clientes" },
  { path: "/clientes/nuevo", type: "page", auth: true, desc: "Crear cliente" },
  { path: "/clientes/[id]", type: "page", auth: true, desc: "Ficha del local" },
  { path: "/clientes/[id]/editar", type: "page", auth: true, desc: "Editar cliente" },
  { path: "/clientes/[id]/nueva-visita", type: "page", auth: true, desc: "Registrar visita" },
  { path: "/rutas", type: "page", auth: true, desc: "Lista de rutas" },
  { path: "/rutas/nueva", type: "page", auth: true, desc: "Crear ruta" },
  { path: "/rutas/[id]", type: "page", auth: true, desc: "Detalle de ruta" },
  { path: "/reportes/semanal", type: "page", auth: true, desc: "Minuta semanal" },
  { path: "/importar", type: "page", auth: true, desc: "Importar CSV" },
  { path: "/configuracion/zonas", type: "page", auth: true, desc: "CRUD zonas" },
  { path: "/panel", type: "page", auth: true, desc: "Panel de control" },
];

const API_ENDPOINTS = [
  { method: "POST", path: "/api/auth/logout", desc: "Cerrar sesión (redirect a /login)" },
  { method: "GET", path: "/auth/callback?code=...", desc: "Intercambia código OTP por sesión" },
];

const DB_TABLES = [
  { name: "profiles", desc: "Perfiles de usuario (extiende auth.users)", fk: "auth.users(id)" },
  { name: "zones", desc: "Zonas de ruta (11 seed)", fk: null },
  { name: "clients", desc: "Locales / PDV", fk: "zones, profiles" },
  { name: "visits", desc: "Visitas registradas", fk: "clients, profiles" },
  { name: "visit_photos", desc: "Fotos de visitas", fk: "visits, clients" },
  { name: "routes", desc: "Rutas planificadas", fk: "zones, profiles" },
  { name: "route_clients", desc: "Locales en una ruta (join)", fk: "routes, clients" },
];

const BUCKETS = [
  { name: "visit-photos", public: true, desc: "Fotos de visitas (fachada, barra, carta, etc.)" },
];

export default async function PanelPage() {
  const { profile } = await verifySession();
  const supabase = await createSupabaseClient();

  // Obtener conteos
  const tables = await Promise.all(
    DB_TABLES.map(async (t) => {
      const { count, error } = await supabase
        .from(t.name)
        .select("*", { count: "exact", head: true });
      return { ...t, count: error ? "—" : count ?? 0 };
    })
  );

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Panel de control</h1>
          <p className="text-muted-foreground">Vista técnica del sistema</p>
        </div>
        <Badge variant="outline" className="text-xs">
          v1.0 MVP
        </Badge>
      </div>

      {/* Sesión */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <User className="h-4 w-4" />
            Sesión activa
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 grid-cols-1 sm:grid-cols-2 text-sm">
            <div><span className="text-muted-foreground">Email:</span> <span className="font-mono">{profile.email}</span></div>
            <div><span className="text-muted-foreground">Rol:</span> <Badge variant="outline">{profile.role}</Badge></div>
            <div><span className="text-muted-foreground">ID:</span> <span className="font-mono text-xs">{profile.id}</span></div>
            <div><span className="text-muted-foreground">Nombre:</span> {profile.full_name || "—"}</div>
          </div>
        </CardContent>
      </Card>

      {/* Base de datos */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Database className="h-4 w-4" />
            Base de datos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tabla</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>FK</TableHead>
                <TableHead className="text-right">Registros</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tables.map((t) => (
                <TableRow key={t.name}>
                  <TableCell className="font-mono text-sm font-medium">{t.name}</TableCell>
                  <TableCell className="text-muted-foreground">{t.desc}</TableCell>
                  <TableCell className="text-muted-foreground text-xs">{t.fk || "—"}</TableCell>
                  <TableCell className="text-right font-mono">{t.count}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Storage */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Storage (Supabase)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bucket</TableHead>
                <TableHead>Público</TableHead>
                <TableHead>Descripción</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {BUCKETS.map((b) => (
                <TableRow key={b.name}>
                  <TableCell className="font-mono text-sm">{b.name}</TableCell>
                  <TableCell>{b.public ? "✅" : "🔒"}</TableCell>
                  <TableCell className="text-muted-foreground">{b.desc}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Rutas de la app */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Route className="h-4 w-4" />
            Rutas de la aplicación ({ROUTES.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ruta</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Auth</TableHead>
                  <TableHead>Descripción</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ROUTES.map((r) => (
                  <TableRow key={r.path}>
                    <TableCell className="font-mono text-sm">{r.path}</TableCell>
                    <TableCell>
                      <Badge variant={r.type === "api" ? "secondary" : r.type === "redirect" ? "outline" : "default"} className="text-xs">
                        {r.type}
                      </Badge>
                    </TableCell>
                    <TableCell>{r.auth ? "🔒" : "🌐"}</TableCell>
                    <TableCell className="text-muted-foreground text-xs">{r.desc}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* API Endpoints */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Key className="h-4 w-4" />
            API endpoints
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Método</TableHead>
                <TableHead>Ruta</TableHead>
                <TableHead>Descripción</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {API_ENDPOINTS.map((ep) => (
                <TableRow key={ep.path}>
                  <TableCell>
                    <Badge variant="outline" className="font-mono text-xs">{ep.method}</Badge>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{ep.path}</TableCell>
                  <TableCell className="text-muted-foreground text-xs">{ep.desc}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Server Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Table2 className="h-4 w-4" />
            Server Actions (lib/actions/)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
            {[
              { file: "auth.ts", exports: ["logout"] },
              { file: "clients.ts", exports: ["getClients", "getClient", "getClientVisits", "createClient", "updateClient", "deleteClientAction"] },
              { file: "visits.ts", exports: ["createVisit", "uploadVisitPhotos", "getVisitPhotos"] },
              { file: "zones.ts", exports: ["getZones", "createZone", "updateZone", "deleteZone"] },
              { file: "routes.ts", exports: ["getRoutes", "getRouteWithClients", "createRoute", "updateRouteStatus", "deleteRoute", "getPendingClientsForZone"] },
              { file: "dashboard.ts", exports: ["getDashboardStats"] },
              { file: "reports.ts", exports: ["generateWeeklyReport"] },
              { file: "import.ts", exports: ["importClients"] },
            ].map((sa) => (
              <div key={sa.file} className="p-3 rounded-lg border bg-white">
                <p className="font-mono text-sm font-medium">{sa.file}</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {sa.exports.map((exp) => (
                    <Badge key={exp} variant="secondary" className="text-xs font-mono">
                      {exp}()
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Components */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Componentes por módulo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
            <div className="p-3 rounded-lg border bg-white">
              <p className="font-medium text-sm">ui/</p>
              <p className="text-xs text-muted-foreground">button, input, label, card, badge, select, dialog, sheet, table, skeleton, separator, avatar, sonner, dropdown-menu</p>
            </div>
            <div className="p-3 rounded-lg border bg-white">
              <p className="font-medium text-sm">shared/</p>
              <p className="text-xs text-muted-foreground">status-badge, priority-badge, google-maps-button, loading-skeleton</p>
            </div>
            <div className="p-3 rounded-lg border bg-white">
              <p className="font-medium text-sm">clients/</p>
              <p className="text-xs text-muted-foreground">client-table, client-filters, client-form</p>
            </div>
            <div className="p-3 rounded-lg border bg-white">
              <p className="font-medium text-sm">visits/</p>
              <p className="text-xs text-muted-foreground">visit-form (576 líneas), photo-uploader</p>
            </div>
            <div className="p-3 rounded-lg border bg-white">
              <p className="font-medium text-sm">dashboard/</p>
              <p className="text-xs text-muted-foreground">kpi-card, zone-progress-card</p>
            </div>
            <div className="p-3 rounded-lg border bg-white">
              <p className="font-medium text-sm">layout/</p>
              <p className="text-xs text-muted-foreground">sidebar, bottom-nav (mobile)</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stack */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Stack y versiones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 grid-cols-2 sm:grid-cols-4 text-sm">
            <div><span className="text-muted-foreground">Framework:</span> <span className="font-medium">Next.js 16.2.6</span></div>
            <div><span className="text-muted-foreground">Router:</span> <span className="font-medium">App Router</span></div>
            <div><span className="text-muted-foreground">Language:</span> <span className="font-medium">TypeScript strict</span></div>
            <div><span className="text-muted-foreground">Auth:</span> <span className="font-medium">Supabase Magic Link</span></div>
            <div><span className="text-muted-foreground">Database:</span> <span className="font-medium">PostgreSQL (Supabase)</span></div>
            <div><span className="text-muted-foreground">Storage:</span> <span className="font-medium">Supabase Storage</span></div>
            <div><span className="text-muted-foreground">UI:</span> <span className="font-medium">Tailwind v4 + shadcn/ui v4</span></div>
            <div><span className="text-muted-foreground">Forms:</span> <span className="font-medium">React Hook Form + Zod</span></div>
            <div><span className="text-muted-foreground">Tables:</span> <span className="font-medium">TanStack Table</span></div>
            <div><span className="text-muted-foreground">Charts:</span> <span className="font-medium">Recharts</span></div>
            <div><span className="text-muted-foreground">Icons:</span> <span className="font-medium">Lucide React</span></div>
            <div><span className="text-muted-foreground">Toasts:</span> <span className="font-medium">Sonner</span></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
