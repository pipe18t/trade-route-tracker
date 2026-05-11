# Seguridad — Trade Route Tracker

## Autenticación

- **Supabase Auth** gestiona el flujo completo (OAuth, sesiones, refresh tokens)
- **Sin contraseñas**: solo Google OAuth y magic link
- **proxy.ts** verifica cookies en cada request (capa optimista)
- **verifySession()** en DAL verifica contra Supabase (capa real)
- **RLS** en PostgreSQL como última barrera

## Autorización (RLS)

| Tabla | SELECT | INSERT | UPDATE | DELETE |
|---|---|---|---|---|
| profiles | `true` | `auth.uid() = id` | `auth.uid() = id` | — |
| zones | `true` | auth req | auth req | auth req |
| clients | `true` | auth req | auth req | auth req |
| visits | `true` | own user_id | own user_id | own user_id |
| visit_photos | `true` | visit ownership | — | visit ownership |
| routes | `true` | own user_id | own user_id | own user_id |
| route_clients | `true` | route ownership | — | route ownership |

## Validación de inputs

- **Zod** en todos los Server Actions (`visitSchema`, `clientSchema`)
- Validate on server, never trust client input
- `FormData` parseado y validado antes de cualquier inserción

## Protección contra ataques comunes

| Ataque | Protección |
|---|---|
| CSRF | Next.js Server Actions incluyen CSRF protection nativa |
| XSS | React escapa por defecto; Supabase storage URLs son del dominio de Supabase |
| SQL Injection | Supabase JS client usa consultas parametrizadas; no hay SQL raw en el código |
| Inyección CSV | `csv-parser.ts` valida estructura antes de insertar |
| Path traversal | No se usa sistema de archivos del servidor para uploads (Supabase Storage) |
| Rate limiting | No implementado en esta versión (Vercel + Supabase tienen límites por defecto) |

## Manejo de credenciales

- `.env.local` contiene solo claves públicas (`NEXT_PUBLIC_*`)
- `service_role` key no está en el código ni en variables de entorno del frontend
- `.gitignore` excluye `.env*`
- Las credenciales de Vercel se configuran en el dashboard (no en el repo)

## Superficie de ataque

### Endpoints expuestos sin auth

| Ruta | Método | Riesgo |
|---|---|---|
| `/login` | GET | Ninguno (solo renderiza UI) |
| `/auth/callback` | GET | Bajo (requiere código OTP/OAuth válido de Supabase) |

### Endpoints con auth

Todas las rutas bajo `(dashboard)` requieren sesión verificada.

## Riesgos detectados

1. **Sin rate limiting**: Un usuario autenticado podría hacer muchas requests. Mitigado parcialmente por límites de Supabase.
2. **Sin compresión de imágenes**: Fotos de celular se suben sin resize. Riesgo de almacenamiento, no de seguridad.
3. **Storage bucket público**: Las fotos son accesibles por URL pública. Por diseño (necesario para mostrarlas en la UI).
4. **Sin sanitización de nombres de archivo**: Los nombres de archivo de foto se preservan. Podrían contener caracteres especiales, pero Supabase Storage los maneja.
5. **CSV sin límite de tamaño**: Archivos muy grandes podrían causar problemas de memoria en el parser. No hay límite de upload size en el input.

## Mejoras de seguridad recomendadas

1. Agregar rate limiting con `@upstash/ratelimit` o similar
2. Comprimir imágenes antes del upload (canvas resize)
3. Agregar límite de tamaño al input de CSV (`accept` + validación)
4. Implementar `Content-Security-Policy` headers
5. Rotar tokens de Supabase periódicamente
6. Agregar logging de errores de autenticación
