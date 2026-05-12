# Despliegue - Trade Route Tracker

## Arquitectura de despliegue recomendada

- Frontend/app: Vercel (Next.js 16).
- Backend: Supabase (Auth + PostgreSQL + Storage).

## Requisitos

- Node.js compatible con Next.js 16.
- Proyecto Supabase con Auth habilitado.
- Bucket `visit-photos` creado manualmente.

## Variables de entorno

Configurar en Vercel y en desarrollo local:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SITE_URL`

Ejemplo produccion:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
NEXT_PUBLIC_SITE_URL=https://trade-route-tracker.vercel.app
```

## Build y arranque

Scripts del proyecto:

- `npm run dev`
- `npm run build`
- `npm run start`

Comandos tipicos:

```bash
npm ci
npm run build
```

## Provisionamiento de base de datos

1. Abrir Supabase SQL Editor.
2. Ejecutar `supabase/migrations/001_initial_schema.sql`.
3. Verificar tablas, policies y triggers creados.

## Provisionamiento de storage

1. Crear bucket `visit-photos` (publico).
2. Confirmar que las policies sobre `storage.objects` quedaron aplicadas por la migracion.

## Configuracion Auth en Supabase

### URL Configuration

Agregar al menos:

- `http://localhost:3000/auth/callback`
- `https://<dominio-prod>/auth/callback`

### Providers

- Google OAuth configurado y activo.
- GitHub opcional en Supabase, pero no usado por la UI actual.

## Deploy en Vercel

1. Conectar repositorio.
2. Configurar variables de entorno.
3. Ejecutar primer deploy.
4. Validar rutas clave:
   - `/login`
   - `/dashboard`
   - `/clientes`
   - `/rutas`
   - `/importar`

## Checklist post-deploy

- Login con Google funciona.
- Callback redirige correctamente a dashboard.
- Logout redirige a login.
- Crear cliente y visita funciona.
- Upload de fotos funciona en bucket `visit-photos`.
- Crear ruta funciona con politicas RLS vigentes.

## CI/CD

No hay workflow de CI en repo actualmente.
Sugerencia minima:

- `npm ci`
- `npm run build`
- (opcional) `npx tsc --noEmit`

## Escalabilidad y costos (resumen)

- Vercel escala automaticamente capa web.
- Supabase limita almacenamiento/DB segun plan.
- Upload de fotos sin compresion puede impactar costo de Storage y transferencia.
