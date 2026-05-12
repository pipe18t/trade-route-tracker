# Seguridad - Trade Route Tracker

## Modelo de seguridad actual

La seguridad se apoya en tres capas:

1. Guard de rutas en `src/proxy.ts`.
2. Validacion de sesion en servidor (`verifySession()` en `src/lib/dals.ts`).
3. RLS en PostgreSQL/Supabase para control de filas.

## Autenticacion

- UI activa: Google OAuth.
- Callback: `GET /auth/callback` con `exchangeCodeForSession`.
- Logout: `POST /api/auth/logout`.

Magic Link y GitHub existen a nivel de codigo en login, pero no estan habilitados en la interfaz actual.

## Autorizacion (RLS)

RLS esta habilitado en `profiles`, `zones`, `clients`, `visits`, `visit_photos`, `routes`, `route_clients`.

Patrones relevantes:

- Lectura global (`USING (true)`) en casi todas las tablas.
- Escritura condicionada por `auth.uid()` para recursos con ownership.
- En `zones/clients`, cualquier autenticado puede insertar/editar/eliminar.

## Validacion de entrada

- Zod para formularios criticos (`client.schema.ts`, `visit.schema.ts`).
- Parser CSV valida estructura basica antes de insertar.
- Upload de fotos requiere tipo seleccionado por UI, pero no hay validacion dura de MIME/tamano en servidor.

## Exposicion de superficie

### Endpoints publicos

- `GET /login`
- `GET /auth/callback`

### Endpoints privados o de sesion

- `POST /api/auth/logout`
- Todas las rutas bajo `(dashboard)`.

## Datos y secretos

- Solo se usan keys publicas de Supabase en runtime app (`NEXT_PUBLIC_*`).
- No se usa `service_role` en codigo del repo.
- `.env*` esta ignorado por Git.

## Riesgos tecnicos observables

1. **Lectura global en RLS**
   - Cualquier usuario autenticado puede leer toda la data de negocio.
   - Si se requiere segmentacion por equipo/tenant, falta politica de aislamiento.

2. **Bucket publico de fotos**
   - `visit-photos` es publico por diseno; las URLs son accesibles con enlace directo.

3. **Sin rate limiting de aplicacion**
   - No hay limitacion explicita para acciones o uploads.

4. **Sin limites de tamano/MIME de upload en servidor**
   - Puede impactar costos y estabilidad.

5. **Grants amplios en migracion**
   - Se aplica `GRANT ALL` a `anon` y `authenticated`; la seguridad depende de RLS bien definido.

6. **Politicas de storage recreadas de forma global**
   - La migracion limpia policies en `storage.objects`; en proyectos con mas buckets puede ser riesgoso.

## Recomendaciones priorizadas

1. Definir politicas de lectura por ownership/equipo si aplica modelo multiusuario estricto.
2. Agregar validacion server-side de tamano y tipo de imagen antes de upload.
3. Incorporar rate limiting en acciones sensibles.
4. Revisar/ajustar estrategia de grants para reducir privilegios por defecto.
5. Evaluar bucket privado + signed URLs si las fotos requieren confidencialidad.
