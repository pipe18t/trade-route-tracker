# Guia de Desarrollo - Trade Route Tracker

## Stack real del repositorio

- Next.js 16 App Router
- TypeScript strict
- Supabase (`@supabase/ssr`, `@supabase/supabase-js`)
- Tailwind CSS v4 + componentes Base UI/shadcn
- Zod para validacion de payloads

## Estructura de trabajo

```text
src/app                 rutas y layouts
src/components          UI y formularios
src/lib/actions         Server Actions por dominio
src/lib/validations     schemas Zod
src/lib/supabase        cliente server/browser
src/lib/dals.ts         verifySession
src/proxy.ts            auth guard
supabase/migrations     esquema SQL
```

## Convenciones

- Archivos: `kebab-case`.
- Componentes React: `PascalCase`.
- Funciones: `camelCase`.
- Server Actions: verbo + sustantivo (`createClient`, `createVisit`, etc.).
- Tipos de dominio en `src/lib/types/database.ts`.

## Patrones recomendados

### Datos y mutaciones

- Preferir Server Actions para mutaciones de negocio.
- Usar cliente Supabase browser solo en Client Components cuando sea necesario.
- Mantener revalidaciones (`revalidatePath`) alineadas con vistas afectadas.

### Validacion

- Validar payload en servidor con Zod.
- Nunca confiar en inputs de cliente sin validacion.

### Sesion

- Rutas privadas dependen de `(dashboard)/layout.tsx` + `verifySession()`.
- No duplicar chequeos de auth en cada pagina salvo casos especiales.

## Flujos actuales por modulo

- Clientes: `client-form.tsx` -> `actions/clients.ts`.
- Visitas: `visit-form.tsx` -> `actions/visits.ts` + upload de fotos.
- Zonas: formularios server action en `actions/zones.ts`.
- Reportes: `reportes/semanal` usa action `generateWeeklyReport`.
- Importar: parse en cliente + import en `actions/import.ts`.
- Rutas: listado/detalle usan server actions, pero `rutas/nueva` inserta directo con cliente Supabase.

## Agregar una nueva pagina protegida

1. Crear ruta en `src/app/(dashboard)/<modulo>/page.tsx`.
2. Definir si sera Server Component o Client Component.
3. Si muta datos, crear action en `src/lib/actions/<dominio>.ts`.
4. Agregar validaciones Zod en `src/lib/validations/`.
5. Conectar navegacion (`sidebar.tsx` y `bottom-nav.tsx` si aplica).

## Agregar una nueva tabla en BD

1. Editar `supabase/migrations/001_initial_schema.sql`.
2. Crear indices y policies RLS.
3. Agregar grants necesarios.
4. Actualizar tipos en `src/lib/types/database.ts`.
5. Implementar actions y UI asociada.

## Comandos utiles

```bash
npm run dev
npm run build
npm run lint
npx tsc --noEmit
```

## Notas de mantenimiento

- `src/lib/actions/auth.ts` existe, pero el logout activo usa `/api/auth/logout`.
- Revisar periodicamente codigo no usado (ejemplo: `createRoute` action no utilizada por la pagina `rutas/nueva`).
- Cuando cambie auth/proveedores, sincronizar `docs/tech/authentication.md` y `docs/tech/security.md`.
