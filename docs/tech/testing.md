# Testing - Trade Route Tracker

## Estado actual

No hay tests automatizados configurados en `package.json`.

Validaciones actuales en flujo de desarrollo:

- `npm run build`
- `npm run lint`
- pruebas manuales de rutas principales

## Riesgo actual

Al no existir suite automatizada, hay mayor riesgo de regresiones en:

- formularios complejos (`VisitForm`, `ClientForm`)
- importacion CSV
- RLS/flujo de rutas con Supabase

## Cobertura actual (estimada)

| Area | Estado |
|---|---|
| Type checking | Parcial (durante build) |
| Lint | Disponible |
| Unit tests | 0% |
| Integration tests | 0% |
| E2E tests | 0% |

## Prioridades de testing

### 1) Unit tests

- `src/lib/utils/csv-parser.ts`
- `src/lib/validations/client.schema.ts`
- `src/lib/validations/visit.schema.ts`
- helpers de constantes/normalizacion

### 2) Integration tests (Server Actions)

- `createClient` / `updateClient`
- `createVisit` + comportamiento de error
- `importClients` (duplicados + mapeo zona)
- `generateWeeklyReport` con filtros

### 3) E2E

Flujos minimos sugeridos:

1. Login con Google -> dashboard.
2. Crear cliente -> ver en listado.
3. Registrar visita con estado final -> verificar estado actualizado del cliente.
4. Crear ruta y abrir detalle.
5. Importar CSV y validar conteo de importados/omitidos.

## Propuesta de stack

- Unit/integration: Vitest.
- Componentes React: Testing Library.
- E2E: Playwright.
- Mocking de Supabase: MSW o doubles de cliente.

## Plan incremental recomendado

1. Montar Vitest + Testing Library.
2. Cubrir parser CSV y schemas Zod.
3. Cubrir Server Actions criticas.
4. Agregar smoke E2E para rutas clave.
5. Definir umbral inicial (ej. 50%) y subir progresivamente.
