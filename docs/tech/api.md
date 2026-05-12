# API y Rutas - Trade Route Tracker

## Alcance

Esta aplicacion casi no expone API REST de negocio.
El dominio funcional se implementa principalmente con Server Actions.

## Endpoints HTTP reales

### `GET /auth/callback`

Intercambia `code` de Supabase Auth por sesion y redirige.

- Query params:
  - `code` (obligatorio)
  - `next` (opcional, default `/dashboard`)
- Respuesta:
  - `302` a `/dashboard` o al `next` indicado.
  - `302` a `/login?error=oauth_callback_failed` en error.

### `POST /api/auth/logout`

Cierra sesion en Supabase y redirige.

- Respuesta:
  - `302` a `/login`.

## Rutas de UI

| Ruta | Tipo | Protegida | Fuente |
|---|---|---|---|
| `/` | redirect | No | `src/app/page.tsx` |
| `/login` | client page | No | `src/app/(auth)/login/page.tsx` |
| `/dashboard` | server page | Si | `src/app/(dashboard)/dashboard/page.tsx` |
| `/clientes` | server page | Si | `src/app/(dashboard)/clientes/page.tsx` |
| `/clientes/nuevo` | server page | Si | `src/app/(dashboard)/clientes/nuevo/page.tsx` |
| `/clientes/[id]` | server page | Si | `src/app/(dashboard)/clientes/[id]/page.tsx` |
| `/clientes/[id]/editar` | server page | Si | `src/app/(dashboard)/clientes/[id]/editar/page.tsx` |
| `/clientes/[id]/nueva-visita` | server page | Si | `src/app/(dashboard)/clientes/[id]/nueva-visita/page.tsx` |
| `/rutas` | server page | Si | `src/app/(dashboard)/rutas/page.tsx` |
| `/rutas/nueva` | client page | Si | `src/app/(dashboard)/rutas/nueva/page.tsx` |
| `/rutas/[id]` | server page | Si | `src/app/(dashboard)/rutas/[id]/page.tsx` |
| `/reportes/semanal` | client page | Si | `src/app/(dashboard)/reportes/semanal/page.tsx` |
| `/importar` | client page | Si | `src/app/(dashboard)/importar/page.tsx` |
| `/configuracion/zonas` | server page | Si | `src/app/(dashboard)/configuracion/zonas/page.tsx` |
| `/panel` | server page | Si | `src/app/(dashboard)/panel/page.tsx` |

## Auth guard de rutas

- `src/proxy.ts` permite rutas publicas:
  - `/login`
  - `/auth/callback`
  - `/_next`
  - `/api/auth`
- Cualquier otra ruta requiere usuario autenticado.

## Server Actions (contrato interno)

### `src/lib/actions/auth.ts`

| Funcion | Entrada | Salida |
|---|---|---|
| `logout` | - | `redirect("/login")` |

### `src/lib/actions/clients.ts`

| Funcion | Entrada | Salida |
|---|---|---|
| `getClients` | filtros opcionales (`region`, `comuna`, `zone_id`, `status`, `priority`, `search`, `visit_day`) | clientes |
| `getClient` | `id` | cliente o `null` |
| `getClientVisits` | `clientId` | visitas del cliente |
| `createClient` | `FormData` | `{ success, redirect }` o `{ error }` |
| `updateClient` | `id`, `FormData` | `{ success, redirect }` o `{ error }` |
| `deleteClientAction` | `FormData` (`id`) | elimina + redirect |

### `src/lib/actions/visits.ts`

| Funcion | Entrada | Salida |
|---|---|---|
| `createVisit` | `FormData` | `{ success, visitId }` o `{ error }` |
| `uploadVisitPhotos` | `visitId`, `clientId`, `files[]` | `void` (lanza error si falla) |
| `getVisitPhotos` | `clientId` | fotos |

### `src/lib/actions/zones.ts`

| Funcion | Entrada | Salida |
|---|---|---|
| `getZones` | - | zonas |
| `createZone` | `FormData` | `void` |
| `updateZone` | `id`, `FormData` | `void` |
| `deleteZone` | `id` | `void` |

### `src/lib/actions/routes.ts`

| Funcion | Entrada | Salida |
|---|---|---|
| `getRoutes` | - | rutas con zona + conteo |
| `getRouteWithClients` | `id` | ruta + clientes asociados |
| `createRoute` | `FormData` | inserta + redirect |
| `updateRouteStatus` | `id`, `status` | `void` |
| `deleteRoute` | `id` | `void` |
| `getPendingClientsForZone` | `zoneId` | clientes pendientes |
| `getPendingClientsForRegion` | `region` | clientes pendientes |

Nota: la pagina `/rutas/nueva` actual no usa `createRoute`; hoy inserta con cliente Supabase en browser.

### `src/lib/actions/dashboard.ts`

| Funcion | Entrada | Salida |
|---|---|---|
| `getDashboardStats` | - | KPIs + distribucion + progreso zonas + seguimientos + visitas recientes |

### `src/lib/actions/reports.ts`

| Funcion | Entrada | Salida |
|---|---|---|
| `generateWeeklyReport` | `startDate`, `endDate`, `region`, `zoneId` | estructura de reporte semanal |

### `src/lib/actions/import.ts`

| Funcion | Entrada | Salida |
|---|---|---|
| `importClients` | arreglo de clientes parseados | `{ imported, skipped, errors }` |

## OpenAPI

El repositorio incluye `openapi.yaml` y `openapi.json` como referencia documental para rutas de UI y auth.
No reemplaza el contrato interno de Server Actions.

## Errores y respuesta esperada

- Server Actions de formularios retornan `{ error: string }` para errores de validacion/DB.
- Errores no controlados en Server Components caen en `src/app/(dashboard)/error.tsx`.
- Errores de RLS/DB comunes:
  - `42501` permisos insuficientes
  - `23505` duplicado por constraint
