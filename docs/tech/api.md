# API y Rutas — Trade Route Tracker

## Rutas de la aplicación

### Páginas (Server Components o Client Components)

| Ruta | Tipo | Auth | Descripción |
|---|---|---|---|
| `/` | redirect | No | Redirige a `/dashboard` |
| `/login` | page (client) | No | Google OAuth + magic link |
| `/dashboard` | page (server) | Sí | KPIs, distribución, avance por zona |
| `/clientes` | page (server) | Sí | Cartera con filtros via searchParams |
| `/clientes/nuevo` | page (server) | Sí | Formulario crear cliente |
| `/clientes/[id]` | page (server) | Sí | Ficha del local |
| `/clientes/[id]/editar` | page (server) | Sí | Formulario editar cliente |
| `/clientes/[id]/nueva-visita` | page (server) | Sí | Formulario registrar visita |
| `/rutas` | page (server) | Sí | Lista de rutas |
| `/rutas/nueva` | page (client) | Sí | Crear ruta |
| `/rutas/[id]` | page (server) | Sí | Detalle de ruta |
| `/reportes/semanal` | page (client) | Sí | Generador de minuta semanal |
| `/importar` | page (client) | Sí | Importación CSV |
| `/configuracion/zonas` | page (server) | Sí | CRUD de zonas |
| `/panel` | page (server) | Sí | Panel técnico (DB, rutas, stack) |

### API Endpoints (Route Handlers)

#### `GET /auth/callback`

Intercambia código OTP/OAuth por sesión de Supabase.

**Query params:**

| Parámetro | Tipo | Requerido | Descripción |
|---|---|---|---|
| `code` | string | Sí | Código de one-time password o OAuth |
| `next` | string | No | Ruta de redirección tras login (default: `/dashboard`) |

**Respuestas:**

| Código | Descripción |
|---|---|
| 302 | Redirige a `/login?error=oauth_callback_failed` si falla |
| 302 | Redirige a `{next}` si éxito |

#### `POST /api/auth/logout`

Cierra la sesión de Supabase.

**Respuestas:**

| Código | Descripción |
|---|---|
| 302 | Redirige a `/login` |

## Server Actions

Todas las mutaciones de datos se realizan mediante Server Actions (`"use server"`), no mediante endpoints REST. Se invocan desde Client Components vía `action={serverAction}` o llamadas directas.

### `src/lib/actions/clients.ts`

| Función | Parámetros | Retorna |
|---|---|---|
| `getClients` | `filters?: { region?, comuna?, zone_id?, status?, priority?, search?, visit_day? }` | `Client[]` |
| `getClient` | `id: string` | `Client \| null` |
| `getClientVisits` | `clientId: string` | `Visit[]` |
| `createClient` | `formData: FormData` | `{ error } \| { success, redirect }` |
| `updateClient` | `id: string, formData: FormData` | `{ error } \| { success, redirect }` |
| `deleteClientAction` | `formData: FormData` | `void` (redirect) |

### `src/lib/actions/visits.ts`

| Función | Parámetros | Retorna |
|---|---|---|
| `createVisit` | `formData: FormData` | `{ error } \| { success, visitId }` |
| `uploadVisitPhotos` | `visitId: string, clientId: string, files: { file: File, photoType: string }[]` | `void` |
| `getVisitPhotos` | `clientId: string` | `VisitPhoto[]` |

### `src/lib/actions/zones.ts`

| Función | Parámetros | Retorna |
|---|---|---|
| `getZones` | — | `Zone[]` |
| `createZone` | `formData: FormData` | `void` |
| `updateZone` | `id: string, formData: FormData` | `void` |
| `deleteZone` | `id: string` | `void` |

### `src/lib/actions/routes.ts`

| Función | Parámetros | Retorna |
|---|---|---|
| `getRoutes` | — | `Route[]` |
| `getRouteWithClients` | `id: string` | `Route & { clients }` |
| `createRoute` | `formData: FormData` | `void` (redirect) |
| `updateRouteStatus` | `id: string, status: string` | `void` |
| `deleteRoute` | `id: string` | `void` |
| `getPendingClientsForZone` | `zoneId: string` | `Client[]` |
| `getPendingClientsForRegion` | `region: string` | `Client[]` |

### `src/lib/actions/dashboard.ts`

| Función | Parámetros | Retorna |
|---|---|---|
| `getDashboardStats` | — | `{ kpis, statusDistribution, zonesWithProgress, upcomingFollowUps, followUpVisits, recentVisits }` |

### `src/lib/actions/reports.ts`

| Función | Parámetros | Retorna |
|---|---|---|
| `generateWeeklyReport` | `startDate, endDate, region, zoneId` | `{ startDate, endDate, userName, region, zones, stats, visits, opportunities, followUps }` |

### `src/lib/actions/import.ts`

| Función | Parámetros | Retorna |
|---|---|---|
| `importClients` | `clients: ClientImport[]` | `{ imported, skipped, errors }` |

## Manejo de errores

Los Server Actions retornan `{ error: string }` en caso de fallo. Los Server Components lanzan errores que son capturados por `error.tsx` (error boundary).

Errores comunes:

| Código | Causa | Solución |
|---|---|---|
| `42501` | Sin permisos PostgreSQL (falta GRANT) | Ejecutar grants en SQL Editor |
| `PGRST116` | RLS bloquea la consulta | Verificar políticas y sesión |
| `23505` | Violación de unique constraint | Cliente duplicado (nombre + comuna) |
