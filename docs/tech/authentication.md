# Autenticacion - Trade Route Tracker

## Estado actual

La UI publica hoy habilita solo **Google OAuth**.

En `src/app/(auth)/login/page.tsx` existen funciones para Magic Link y GitHub, pero los bloques de UI estan comentados, por lo que no estan activos para usuarios finales.

## Flujo real de login

1. Usuario entra a `/login`.
2. Click en "Iniciar sesion con Google".
3. `supabase.auth.signInWithOAuth({ provider: "google" })` redirige a Supabase/Google.
4. Supabase redirige de vuelta a `/auth/callback?code=...`.
5. `GET /auth/callback` ejecuta `exchangeCodeForSession(code)`.
6. Se setean cookies de sesion y se redirige a `/dashboard`.

## Logout

- UI envia `POST` a `/api/auth/logout`.
- Handler hace `supabase.auth.signOut()` y redirige a `/login`.

## Capas de control de acceso

### 1) `src/proxy.ts`

Filtro de borde para navegacion:

- Permite rutas publicas (`/login`, `/auth/callback`, `/_next`, `/api/auth`).
- Redirige a `/login` cuando no hay sesion en rutas privadas.
- Redirige a `/dashboard` si ya hay sesion y se intenta abrir `/login`.

### 2) `verifySession()` en `src/lib/dals.ts`

Validacion fuerte en servidor:

- `supabase.auth.getUser()` para usuario autenticado real.
- Si no hay usuario, `redirect('/login')`.
- Lee perfil desde `profiles`.
- Si falta perfil, intenta crearlo automaticamente y aplica fallback seguro para no romper UI.

### 3) RLS (PostgreSQL)

Todas las tablas de negocio tienen RLS habilitado.
Las politicas controlan ownership o condicion de usuario autenticado segun tabla.

## Cookies/sesion

Supabase gestiona cookies y refresh token via `@supabase/ssr`.
El nombre exacto de cookie depende del proyecto Supabase (`sb-<project-ref>-auth-token`, etc.).

## Variables de entorno usadas en auth

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SITE_URL` (fallback de redirects en server)

## Configuracion necesaria en Supabase

### Authentication -> URL Configuration

- `Site URL`: dominio principal (ej: `http://localhost:3000` en dev).
- Redirect URL valida para callback:
  - `http://localhost:3000/auth/callback`
  - `https://<dominio-prod>/auth/callback`

### Authentication -> Providers

- Google: habilitado y configurado.
- GitHub: opcional en plataforma, pero no expuesto por la UI actual.

## Roles

El campo `profiles.role` existe con valores:

- `admin`
- `supervisor`
- `ejecutivo`
- `practicante`

Actualmente no hay autorizacion por rol en frontend; el rol se muestra en panel y se persiste en BD.
