# Guía de Desarrollo — Trade Route Tracker

## Convenciones

### Nombres

| Regla | Ejemplo |
|---|---|
| Archivos: kebab-case | `client-form.tsx`, `google-maps-button.tsx` |
| Componentes: PascalCase | `ClientForm`, `StatusBadge` |
| Funciones: camelCase | `getClients`, `createVisit` |
| Server Actions: verbo + sustantivo | `createClient`, `updateRouteStatus` |
| Tipos: PascalCase con sufijo descriptivo | `ClientStatus`, `VisitFormData` |
| Constantes: UPPER_SNAKE_CASE | `STATUS_LABELS`, `POP_MATERIALS` |

### Estructura de archivos

```
src/
├── app/              # Rutas (Next.js file-based routing)
│   ├── (auth)/       # Route group: páginas públicas
│   ├── (dashboard)/  # Route group: páginas protegidas
│   └── api/          # API routes (mínimo)
├── components/       # Componentes React
│   ├── ui/           # shadcn/ui (autogenerado, NO modificar)
│   ├── shared/       # Reutilizables cross-module
│   ├── clients/      # Específicos del módulo clientes
│   ├── visits/       # Específicos del módulo visitas
│   ├── dashboard/    # Específicos del dashboard
│   └── layout/       # Sidebar, navegación
├── lib/
│   ├── actions/      # Server Actions (1 archivo por dominio)
│   ├── supabase/     # Clientes Supabase
│   ├── types/        # Definiciones de tipos
│   ├── validations/  # Schemas Zod
│   ├── utils/        # Utilidades
│   ├── constants.ts  # Constantes compartidas
│   ├── dals.ts       # Data Access Layer
│   └── url.ts        # Resolvedor de URLs
└── proxy.ts          # Middleware de auth
```

## Cómo agregar una nueva página

1. Crear `src/app/(dashboard)/nueva-ruta/page.tsx`
2. Si carga datos: Server Component con `export default async function`
3. Si tiene interactividad: Client Component con `"use client"`
4. Si necesita proteccion: el layout `(dashboard)/layout.tsx` ya llama a `verifySession()`
5. Agregar la ruta al sidebar en `components/layout/sidebar.tsx`

## Cómo agregar un nuevo modelo/tabla

1. Agregar `CREATE TABLE IF NOT EXISTS` en `supabase/migrations/001_initial_schema.sql`
2. Agregar RLS policies
3. Agregar índices si es necesario
4. Agregar GRANT al final
5. Crear tipos en `lib/types/database.ts`
6. Crear Server Actions en `lib/actions/nuevo-dominio.ts`
7. Crear validación Zod en `lib/validations/`
8. Crear componentes y página

## Cómo agregar un nuevo Server Action

```typescript
// src/lib/actions/mi-dominio.ts
"use server";

import { createClient as createSupabaseClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { miSchema } from "@/lib/validations/mi.schema";

export async function crearEntidad(formData: FormData) {
  const supabase = await createSupabaseClient();

  // 1. Obtener usuario
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No autorizado");

  // 2. Parsear y validar
  const raw = {
    campo1: formData.get("campo1") as string,
    campo2: formData.get("campo2") as string,
  };
  const parsed = miSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: "Datos inválidos" };
  }

  // 3. Insertar
  const { error } = await supabase.from("tabla").insert({
    ...parsed.data,
    user_id: user.id,
  });
  if (error) return { error: error.message };

  // 4. Revalidar caché
  revalidatePath("/ruta");

  return { success: true };
}
```

## Cómo usar el cliente Supabase

### En Server Components / Server Actions

```typescript
import { createClient } from "@/lib/supabase/server";
const supabase = await createClient();
```

### En Client Components

```typescript
"use client";
import { createClient } from "@/lib/supabase/client";
const supabase = createClient();
```

### Restricciones

- Solo usar browser client en Client Components para **lecturas** o mutaciones simples
- Mutaciones complejas siempre mediante Server Actions
- No exponer el browser client fuera de componentes React

## Estilo de código

- **TypeScript strict mode** activado
- **Zod** para validación de inputs (servidor)
- **No `any`** sin razón justificada
- **Prefer `??` sobre `\|\|`** para valores que pueden ser `0` o `""`
- **Importar constantes** de `lib/constants.ts`, no redefinir
- **Usar `cn()`** de `lib/utils.ts` para clases condicionales

## Flujo de desarrollo recomendado

1. `npm run dev` para desarrollo local
2. Probar en `http://localhost:3000`
3. Verificar TypeScript: `npx tsc --noEmit`
4. Build de prueba: `npm run build -- --webpack`
5. Commit y push → Vercel deploy automático
