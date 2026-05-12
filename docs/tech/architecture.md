# Arquitectura - Trade Route Tracker

## Resumen

Trade Route Tracker es una aplicacion Next.js 16 (App Router) con un backend en Supabase.
La arquitectura es mixta:

- Server Components para render de pantallas y lectura de datos sensibles.
- Server Actions para gran parte de las mutaciones.
- Client Components para formularios, filtros y flujos interactivos.
- Supabase Auth + PostgreSQL (RLS) + Supabase Storage como capa de backend.

## Topologia de modulos

```text
Navegador
  -> proxy.ts (guard de acceso)
  -> App Router (src/app)
      -> (auth) login + callback
      -> (dashboard) modulos de negocio
      -> api/auth/logout
  -> lib/dals.verifySession() en layout protegido
  -> lib/actions/* (mutaciones/queries en servidor)
  -> Supabase (Auth + Postgres + Storage)
```

## Estructura de carpetas

| Ruta | Rol |
|---|---|
| `src/app/(auth)` | Pantallas publicas (`/login`) y callback (`/auth/callback`) |
| `src/app/(dashboard)` | Pantallas protegidas (dashboard, clientes, rutas, reportes, importar, zonas, panel) |
| `src/app/api/auth/logout` | Route handler para cierre de sesion |
| `src/components/*` | UI reusable, formularios y layout |
| `src/lib/actions/*` | Server Actions por dominio |
| `src/lib/dals.ts` | `verifySession()` + fallback de perfil |
| `src/lib/supabase/*` | Clientes Supabase server/browser |
| `src/lib/validations/*` | Schemas Zod |
| `src/lib/utils/csv-parser.ts` | Parser/import normalizacion CSV |
| `src/lib/constants.ts` | Constantes funcionales compartidas |
| `src/proxy.ts` | Auth guard de borde (Next.js proxy) |
| `supabase/migrations/001_initial_schema.sql` | Esquema SQL, RLS, indices, triggers |

## Patrones clave

### 1) Autenticacion en capas

- `proxy.ts`: bloquea rutas privadas y redirige a `/login` sin sesion.
- `verifySession()` en `src/lib/dals.ts`: validacion fuerte en servidor, lectura de perfil y auto-creacion de perfil faltante.
- RLS en PostgreSQL: ultima barrera para operaciones de datos.

### 2) Server-first con excepciones

Mutaciones y lecturas principales usan Server Actions (`clients`, `visits`, `zones`, `dashboard`, `reports`, `import`).

Excepcion importante:

- `src/app/(dashboard)/rutas/nueva/page.tsx` usa cliente Supabase en browser para crear rutas y `route_clients` directamente.

### 3) Validacion de entrada

- Zod en servidor para formularios de cliente y visita.
- Parser CSV con deteccion de delimitador (`;`, `,`, `\t`) y normalizacion de region/comuna.

### 4) Revalidacion y navegacion

- Las Server Actions hacen `revalidatePath(...)` sobre vistas afectadas.
- Formularios cliente usan `router.push(...)` + `router.refresh()` despues de exito.

## Flujos funcionales

### Login

1. Usuario entra a `/login`.
2. Se ejecuta `signInWithOAuth({ provider: "google" })`.
3. Supabase redirige a `/auth/callback?code=...`.
4. Callback hace `exchangeCodeForSession(code)` y redirige a `/dashboard`.

Nota: en UI actual, GitHub y Magic Link estan comentados (no disponibles para el usuario final).

### Crear/editar cliente

1. `ClientForm` arma `FormData`.
2. Llama `createClient()` o `updateClient()` (Server Action).
3. Zod valida payload.
4. Inserta/actualiza en `clients`.
5. Revalida `/clientes` y, al editar, `/clientes/[id]`.

### Registrar visita + fotos

1. `VisitForm` envia `FormData` a `createVisit()`.
2. `createVisit()` valida con Zod y escribe en `visits` con `user_id` autenticado.
3. Trigger SQL sincroniza `clients.status` con `visits.final_status` cuando corresponde.
4. Si hay fotos, `uploadVisitPhotos()` sube a bucket `visit-photos` y registra `visit_photos`.

### Importar cartera

1. `ImportarPage` lee archivo local y usa `parseCSV()`.
2. `importClients()` deduplica por `name + comuna` y mapea comuna -> zona si aplica.
3. Inserta en lote y revalida `/clientes` y `/importar`.

### Reporte semanal

1. UI envia filtros a `generateWeeklyReport()`.
2. Action consulta visitas por rango y agrupa indicadores/oportunidades/seguimientos.
3. El cliente renderiza el informe y permite copiar texto al portapapeles.

## Decisiones tecnicas actuales

1. `proxy.ts` en vez de `middleware.ts` por convencion de Next.js 16.
2. Supabase como backend unico (auth, DB, storage), sin API propia para dominio de negocio.
3. Modelo de seguridad centrado en RLS.
4. Catalogos y labels centralizados en `src/lib/constants.ts`.
5. Migracion unica e idempotente para bootstrap rapido de entorno.

## Limitaciones y deuda tecnica visible

- No hay tests automatizados en el repositorio.
- `createRoute` Server Action existe pero la pagina de nueva ruta hoy escribe directo desde cliente.
- `auth.ts` exporta `logout()` pero el logout en UI usa route handler `/api/auth/logout`.
