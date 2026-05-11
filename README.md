# Trade Route Tracker

**Seguimiento de rutas y ejecución en terreno para Trade Marketing On Trade.**

Aplicación web fullstack (Next.js + Supabase) que permite a una ejecutiva de Trade Marketing gestionar su cartera de 300+ locales, planificar rutas de visita, registrar hallazgos en terreno, subir fotos de evidencia y generar minutas semanales para el supervisor.

## Stack

| Capa | Tecnología |
|---|---|
| Framework | Next.js 16.2.6 (App Router) |
| Lenguaje | TypeScript 5 (strict) |
| UI | Tailwind CSS v4 + shadcn/ui v4 (Base UI) |
| Base de datos | PostgreSQL (Supabase) |
| Auth | Supabase Auth (Google OAuth + Magic Link) |
| Storage | Supabase Storage |
| Formularios | React Hook Form + Zod 4 |
| Gráficos | Recharts |
| Toasts | Sonner |
| Iconos | Lucide React |
| Deploy | Vercel |

## Módulos

| Módulo | Ruta | Descripción |
|---|---|---|
| Dashboard | `/dashboard` | KPIs, distribución por estado, avance por zona, seguimientos |
| Clientes | `/clientes` | Cartera con filtros, CRUD, ficha con historial y fotos |
| Visitas | `/clientes/[id]/nueva-visita` | Formulario con 7 secciones, photo uploader |
| Rutas | `/rutas` | Planificador con Google Maps waypoints |
| Reportes | `/reportes/semanal` | Minuta semanal con copiar al portapapeles |
| Importar | `/importar` | Carga CSV con parser (nombre;dirección) |
| Zonas | `/configuracion/zonas` | CRUD de zonas de ruta |

## Inicio rápido

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.local.example .env.local
# Editar .env.local con tus credenciales de Supabase

# Ejecutar migración en Supabase SQL Editor
# Copiar supabase/migrations/001_initial_schema.sql

# Desarrollo
npm run dev

# Build
npm run build -- --webpack  # Windows sin Turbopack
```

## Variables de entorno

```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
NEXT_PUBLIC_SITE_URL=https://trade-route-tracker.vercel.app
```

## Documentación técnica

- [Arquitectura](docs/tech/architecture.md)
- [Base de datos](docs/tech/database.md)
- [API y rutas](docs/tech/api.md)
- [Autenticación](docs/tech/authentication.md)
- [Despliegue](docs/tech/deployment.md)
- [Guía de desarrollo](docs/tech/developer-guide.md)
- [Seguridad](docs/tech/security.md)
- [Testing](docs/tech/testing.md)
- [OpenAPI Spec](openapi.yaml)

## Manual de usuario

[Manual de uso completo](docs/manual-de-uso.md) con ejemplos y casos prácticos.

## Licencia

Privada — MVP.
