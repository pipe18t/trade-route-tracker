# Testing — Trade Route Tracker

## Estado actual

**No se han implementado tests automatizados.** El MVP se validó con build verification (`npx tsc --noEmit` + `npm run build`) y pruebas manuales de los flujos principales.

## Frameworks recomendados

| Herramienta | Propósito |
|---|---|
| **Vitest** | Unit + integration tests |
| **@testing-library/react** | Component tests |
| **Playwright** | E2E tests |
| **MSW** | API mocking (Supabase) |

## Cómo ejecutar tests (cuando se implementen)

```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Coverage
npm run test:coverage
```

## Áreas prioritarias para testing

### 1. Server Actions (crítico)

```typescript
// tests/actions/clients.test.ts (ejemplo)
import { createClient } from "@/lib/actions/clients";

test("createClient valida nombre requerido", async () => {
  const fd = new FormData();
  // sin nombre → debe fallar
  const result = await createClient(fd);
  expect(result.error).toBeDefined();
});
```

### 2. CSV Parser

```typescript
// tests/utils/csv-parser.test.ts (ejemplo)
import { parseCSV } from "@/lib/utils/csv-parser";

test("parsea nombre;dirección correctamente", () => {
  const csv = `"Clientes";"Región"
"Calabria ; General Del Canto 45";"RM"`;
  const result = parseCSV(csv);
  expect(result[0].name).toBe("Calabria");
  expect(result[0].address).toBe("General Del Canto 45");
});
```

### 3. Validación Zod

```typescript
// tests/validations/visit.test.ts (ejemplo)
import { visitSchema } from "@/lib/validations/visit.schema";

test("could_talk=false requiere no_contact_reason", () => {
  const result = visitSchema.safeParse({
    client_id: "uuid",
    visit_date: "2026-01-01",
    could_talk: false,
    final_status: "visitado",
  });
  expect(result.success).toBe(false);
});
```

### 4. Componentes UI

```typescript
// tests/components/status-badge.test.tsx (ejemplo)
import { render } from "@testing-library/react";
import { StatusBadge } from "@/components/shared/status-badge";

test("muestra label correcto para visitado", () => {
  const { getByText } = render(<StatusBadge status="visitado" />);
  expect(getByText("Visitado")).toBeDefined();
});
```

### 5. Flujos E2E

```
1. Login → Dashboard con KPIs visibles
2. Clientes → Filtrar por zona → Ver tabla
3. Cliente detail → Registrar visita → Ver en historial
4. Rutas → Crear ruta → Ver en Google Maps
5. Reportes → Generar → Copiar al portapapeles
```

## Cobertura actual

| Área | Cobertura |
|---|---|
| TypeScript types | ✅ Compilación estricta |
| Build verification | ✅ `npm run build` |
| Unit tests | ❌ 0% |
| Integration tests | ❌ 0% |
| E2E tests | ❌ 0% |
| Manual testing | ✅ Flujos principales |

## Plan de testing recomendado

1. **Fase 1**: Unit tests para Server Actions y Zod schemas (mayor ROI)
2. **Fase 2**: Component tests para formularios complejos (VisitForm, ClientForm)
3. **Fase 3**: E2E tests para flujos críticos (login, visita, reporte)
4. **Fase 4**: Coverage target > 70%
