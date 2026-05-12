# Base de Datos - Trade Route Tracker

## Motor y contexto

- PostgreSQL administrado por Supabase.
- Esquema principal en `supabase/migrations/001_initial_schema.sql` (280 lineas).
- Migracion idempotente: `IF NOT EXISTS`, `CREATE OR REPLACE`, drop/create de policies.

## Extension y bootstrap

La migracion habilita:

- `uuid-ossp`

> Nota: las PK usan `gen_random_uuid()`. En Supabase suele estar disponible por defecto, pero conviene validar `pgcrypto` en ambientes no gestionados.

## Tablas de dominio

### `profiles`

Extiende `auth.users`.

- `id` (PK, FK a `auth.users(id)`, cascade delete)
- `full_name`
- `email`
- `role` (`admin|supervisor|ejecutivo|practicante`, default `practicante`)
- `created_at`

### `zones`

Catalogo de zonas por region.

- `id`, `name`, `region`, `description`, `created_at`
- Seed inicial de 11 zonas (RM y V)

### `clients`

Locales/puntos de venta.

- `id`, `name`, `address`, `region`, `comuna`
- `zone_id` FK -> `zones` (`SET NULL`)
- `executive`, `visit_day`, `dispatch_day`
- `priority` (`alta|media|baja`)
- `status` (`pendiente|visitado|seguimiento|no_atendido|coordinar_hora|administrador_no_disponible`)
- `google_maps_url`, `general_notes`
- `created_at`, `updated_at`

### `visits`

Registro detallado de visita.

Incluye contacto, resultado, precios, visibilidad, oportunidades, seguimiento y estado final.

Campos principales:

- `client_id` FK -> `clients` (`CASCADE`)
- `user_id` FK -> `profiles` (`SET NULL`)
- `visit_date`, `visit_time`
- `could_talk`, `no_contact_reason`
- `total_taps`, `kross_taps`, `kross_price`, `competitor_price`
- `pop_material text[]`, `competitors text[]`, `opportunity_type text[]`
- `follow_up_date`, `follow_up_priority`
- `final_status` (mismos estados de gestion, excepto `pendiente`)

### `visit_photos`

- `visit_id` FK -> `visits` (`CASCADE`)
- `client_id` FK -> `clients` (`CASCADE`)
- `photo_url`
- `photo_type` (`fachada|barra|carta|material_pop|competencia|salidas_cerveza|otro`)

### `routes`

- `user_id` FK -> `profiles` (`SET NULL`)
- `name`, `region`, `zone_id`, `route_date`
- `status` (`planificada|en_progreso|completada|cancelada`)

### `route_clients`

Join table para locales de una ruta.

- `route_id` FK -> `routes` (`CASCADE`)
- `client_id` FK -> `clients` (`CASCADE`)
- `position`

## Indices

- `idx_clients_zone_id`
- `idx_clients_status`
- `idx_clients_region`
- `idx_visits_client_id`
- `idx_visits_user_id`
- `idx_visits_visit_date`
- `idx_visit_photos_visit_id`
- `idx_routes_user_id`
- `idx_route_clients_route_id`

## Triggers y funciones

### Perfil al crear usuario auth

- Funcion: `handle_new_user()`
- Trigger: `on_auth_user_created` (`AFTER INSERT` en `auth.users`)

### Auto update de `clients.updated_at`

- Funcion: `update_updated_at_column()`
- Trigger: `update_clients_updated_at` (`BEFORE UPDATE` en `clients`)

### Sincronizacion estado cliente desde visita

- Funcion: `update_client_status_from_visit()`
- Trigger: `update_client_status_after_visit` (`AFTER INSERT OR UPDATE OF final_status` en `visits`)

## RLS (Row Level Security)

RLS activo en todas las tablas de dominio.

Resumen operativo:

- `profiles`: lectura global; update/insert solo del propio usuario.
- `zones`, `clients`: lectura global; CUD para cualquier usuario autenticado.
- `visits`: lectura global; CUD solo de filas cuyo `user_id = auth.uid()`.
- `visit_photos`: lectura global; insert/delete condicionados a ownership de visita.
- `routes`: lectura global; CUD solo de filas propias (`user_id = auth.uid()`).
- `route_clients`: lectura global; insert/delete condicionados a ownership de la ruta.

## Storage

La migracion **crea politicas** para `storage.objects` del bucket `visit-photos`, pero **no crea el bucket**.

Configuracion esperada:

- Bucket `visit-photos` (publico).
- Policies:
  - lectura publica
  - upload para `authenticated`
  - delete por owner

## Grants

La migracion aplica grants amplios sobre esquema `public` para `anon` y `authenticated`.
La proteccion de acceso depende de RLS.

## Relacion con app

- `src/lib/actions/*` opera directamente sobre estas tablas.
- `verifySession()` depende de `profiles`.
- `importClients()` depende de `zones` y `clients`.
- `uploadVisitPhotos()` depende de `visit_photos` + bucket `visit-photos`.
