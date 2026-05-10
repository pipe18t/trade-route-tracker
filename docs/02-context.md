Sí. Te dejo un **contexto maestro listo para copiar y pegar en una IA programadora** tipo Cursor, Lovable, v0, Bolt, Replit AI o cualquier agente que programe.

Puedes decirle: **“Toma este contexto y construye el MVP”**.

---

# Contexto para IA programadora — MVP App Web Trade Marketing

Necesito desarrollar una app web responsive para seguimiento de rutas y visitas en terreno de Trade Marketing On Trade.

La app se llamará provisionalmente:

## PDV Tracker — Seguimiento de rutas y ejecución en terreno

El objetivo es que una ejecutiva/practicante de Trade Marketing pueda cargar una cartera de clientes, organizar locales por zonas, planificar rutas, registrar visitas a locales, subir fotos, marcar estado del local y generar una minuta semanal ordenada para presentar al supervisor.

La app debe estar pensada para usarse desde computador y celular, especialmente en terreno.

---

# 1. Stack técnico deseado

Usar:

* Next.js
* TypeScript
* Supabase
* PostgreSQL
* Supabase Auth
* Supabase Storage para fotos
* Tailwind CSS
* shadcn/ui
* React Hook Form
* Zod
* TanStack Table
* Recharts para dashboard
* Opcional: exportar reportes a PDF más adelante

Primera versión sin mapa integrado complejo. El MVP debe usar links a Google Maps desde la dirección del local.

---

# 2. Problema que resuelve

Actualmente existe una cartera de clientes de Región Metropolitana y Quinta Región con muchos locales On Trade. La información está en Excel y las visitas se registran de forma manual.

Se necesita una herramienta que permita:

* ordenar la cartera por región, comuna y zona,
* diferenciar locales visitados, pendientes y en seguimiento,
* registrar hallazgos de terreno,
* anotar oportunidades comerciales,
* subir fotos de evidencia,
* saber qué zonas tienen avance,
* generar reportes/minutas semanales,
* mantener histórico de visitas por local.

---

# 3. Usuario principal

Usuario principal:

**Ejecutiva o practicante de Trade Marketing On Trade**

Necesita:

* ver su cartera de clientes,
* planificar ruta diaria o semanal,
* filtrar locales por zona,
* abrir direcciones en Google Maps,
* registrar visitas desde celular,
* adjuntar fotos,
* dejar próximos pasos,
* generar resumen semanal.

Usuario secundario futuro:

**Supervisor / Jefe On Trade**

Necesita:

* revisar avance,
* ver locales críticos,
* identificar oportunidades,
* ver reportes por zona o ejecutivo.

En el MVP se debe priorizar al usuario principal.

---

# 4. Funcionalidades del MVP

## 4.1 Autenticación

Crear login con Supabase Auth.

Debe permitir:

* iniciar sesión con email y password,
* cerrar sesión,
* proteger rutas privadas.

Roles iniciales:

* admin
* supervisor
* ejecutivo
* practicante

Para MVP puede existir solo un usuario practicante, pero dejar la estructura preparada para roles.

---

## 4.2 Dashboard principal

El dashboard debe mostrar indicadores rápidos:

* total de locales,
* locales visitados,
* locales pendientes,
* locales en seguimiento,
* locales no atendidos,
* avance total en porcentaje,
* avance por región,
* avance por zona,
* cantidad de visitas de la semana,
* próximos seguimientos.

Estados de local:

* pendiente
* visitado
* seguimiento
* no_atendido
* coordinar_hora
* administrador_no_disponible

Mostrar tarjetas KPI y gráficos simples:

* gráfico de torta o donut por estado,
* gráfico de barras por zona,
* tabla de próximos seguimientos.

---

## 4.3 Cartera de clientes

Crear una página de cartera con tabla filtrable.

Columnas mínimas:

* nombre del local,
* dirección,
* región,
* comuna,
* zona,
* ejecutivo,
* día de visita sugerido,
* día de despacho,
* prioridad,
* estado,
* última visita,
* próxima acción,
* botón para ver ficha,
* botón para abrir en Google Maps.

Filtros:

* región,
* comuna,
* zona,
* estado,
* prioridad,
* día de visita,
* búsqueda por nombre.

La tabla debe ser cómoda para escritorio y responsive para celular.

---

## 4.4 Carga de clientes desde CSV o Excel

El MVP debe permitir cargar cartera desde archivo CSV, y si es posible también Excel.

Columnas esperadas del archivo:

* Clientes
* Región
* Comuna
* Ejecutivo
* Día de Visita
* Despacho

Importante: en la columna “Clientes” puede venir el nombre del local y dirección juntos separados por punto y coma.

Ejemplo:

```txt
Calabria ; General Del Canto 45
Dublin ; Manuel Montt 130
```

La app debe intentar separar:

* nombre_local = texto antes del punto y coma
* dirección = texto después del punto y coma

Si no existe punto y coma, guardar todo como nombre y dejar dirección vacía.

---

## 4.5 Zonas de ruta

La app debe asignar zonas manualmente o por comuna.

Zonas sugeridas para Región Metropolitana:

* Providencia / Manuel Montt / Bilbao
* Ñuñoa / Plaza Ñuñoa
* La Reina / Larraín
* Las Condes / Vitacura
* Santiago Centro / Bellavista
* Otras comunas RM

Zonas sugeridas para Quinta Región:

* Viña del Mar
* Valparaíso
* Reñaca / Concón
* Quilpué / Villa Alemana
* Interior / pendientes

Debe existir una tabla o configuración de zonas para poder editar nombres de zonas.

---

## 4.6 Ficha del local

Cada local debe tener una ficha individual con:

* datos generales,
* dirección,
* región,
* comuna,
* zona,
* estado actual,
* prioridad,
* ejecutivo,
* día de visita sugerido,
* despacho,
* botón “Abrir en Google Maps”,
* historial de visitas,
* última visita,
* próxima acción,
* observaciones generales.

Desde la ficha se debe poder:

* editar datos del local,
* registrar nueva visita,
* cambiar estado,
* ver fotos asociadas.

---

## 4.7 Registro de visita

Este es el módulo más importante.

Crear formulario “Nueva visita”.

Campos:

### Datos básicos

* local_id
* fecha de visita
* hora de visita
* persona contactada
* cargo de persona contactada
* se pudo conversar: sí/no
* motivo si no se pudo conversar

Opciones para motivo:

* administrador no disponible
* administradora en reunión
* pedir hora
* local cerrado
* encargado ocupado
* no corresponde visitar en ese horario
* otro

### Posicionamiento de marca

* salidas totales de cerveza
* salidas Kross
* marca de mayor venta
* precio schop Kross
* precio marca más vendida
* Kross aparece en carta: sí/no
* ejecución en carta

Opciones ejecución en carta:

* correcto
* incorrecto
* no aparece
* pendiente revisar

### Ejecución y visibilidad

Campo múltiple para material POP visible:

* ojo de buey
* latón
* portaplacas
* vasos Kross
* carta / menú
* sticker
* refrigerador
* toldo / sombrilla
* posavasos
* ningún material visible
* otro

### Competencia

* marcas competidoras presentes
* marca con mayor visibilidad
* marca recomendada por garzones
* observaciones de competencia

### Oportunidades

Campo múltiple:

* falta material POP
* mejorar visibilidad en barra
* mejorar presencia en carta
* oportunidad de capacitación
* oportunidad de activación
* oportunidad de cambio de mix
* local solicita material
* local solicita visita comercial
* seguimiento con administrador
* otro

### Próximo paso

* próxima acción
* fecha sugerida de seguimiento
* prioridad del seguimiento: alta/media/baja
* notas generales

### Estado final de la visita

Al guardar la visita, permitir actualizar estado del local a:

* visitado
* seguimiento
* no_atendido
* coordinar_hora
* administrador_no_disponible

---

## 4.8 Fotos de visita

Permitir subir fotos desde celular o computador.

Tipos de foto:

* fachada
* barra
* carta
* material POP
* competencia
* salidas de cerveza
* otro

Usar Supabase Storage.

Cada foto debe quedar asociada a una visita.

---

## 4.9 Planificación de ruta

Crear página “Rutas”.

Debe permitir:

* seleccionar región,
* seleccionar zona,
* ver locales pendientes de esa zona,
* seleccionar locales para una ruta diaria,
* marcar ruta como “planificada”,
* abrir direcciones en Google Maps.

MVP simple:

Cada local debe tener un botón:

```txt
Abrir en Google Maps
```

Y si se seleccionan varios locales, generar un link de Google Maps con origen/destino/paradas si es posible.

Si es muy complejo, crear solo links individuales por local.

---

## 4.10 Reporte semanal

Crear página “Reporte semanal”.

El usuario debe poder elegir:

* fecha inicio,
* fecha fin,
* región,
* zona opcional.

El sistema debe generar un resumen automático con:

* total de locales visitados,
* total de locales en seguimiento,
* total no atendidos,
* zonas trabajadas,
* oportunidades detectadas,
* locales con administrador no disponible,
* locales que requieren seguimiento,
* principales hallazgos,
* tabla de visitas.

Formato del reporte:

```txt
Reporte semanal — Trade Marketing On Trade

Semana: [fecha inicio] al [fecha fin]
Ejecutiva: [nombre usuario]
Región: [región]
Zonas trabajadas: [zonas]

Resumen ejecutivo:
Durante la semana se realizaron visitas a locales de las zonas [zonas], con foco en levantamiento de ejecución de marca, visibilidad Kross, presencia de competencia y oportunidades de mejora en PDV.

Indicadores:
- Locales visitados:
- Locales con seguimiento:
- Locales no atendidos:
- Locales con oportunidad de mejora:

Locales visitados:
Tabla con local, zona, estado, hallazgo, próximo paso.

Oportunidades detectadas:
Lista agrupada por tipo de oportunidad.

Próximos pasos:
Lista de locales y acciones sugeridas.
```

Debe existir botón para:

* copiar reporte,
* descargar PDF más adelante,
* exportar CSV más adelante.

Para MVP, basta con botón “Copiar reporte”.

---

# 5. Modelo de base de datos Supabase

Crear estas tablas.

## profiles

```sql
id uuid primary key references auth.users(id) on delete cascade,
full_name text,
email text,
role text default 'practicante',
created_at timestamp with time zone default now()
```

Roles posibles:

```txt
admin
supervisor
ejecutivo
practicante
```

---

## zones

```sql
id uuid primary key default gen_random_uuid(),
name text not null,
region text not null,
description text,
created_at timestamp with time zone default now()
```

---

## clients

```sql
id uuid primary key default gen_random_uuid(),
name text not null,
address text,
region text,
comuna text,
zone_id uuid references zones(id),
executive text,
visit_day text,
dispatch_day text,
priority text default 'media',
status text default 'pendiente',
google_maps_url text,
general_notes text,
created_at timestamp with time zone default now(),
updated_at timestamp with time zone default now()
```

Priority options:

```txt
alta
media
baja
```

Status options:

```txt
pendiente
visitado
seguimiento
no_atendido
coordinar_hora
administrador_no_disponible
```

---

## visits

```sql
id uuid primary key default gen_random_uuid(),
client_id uuid references clients(id) on delete cascade,
user_id uuid references profiles(id),
visit_date date not null,
visit_time time,
contact_name text,
contact_role text,
could_talk boolean,
no_contact_reason text,
total_taps integer,
kross_taps integer,
best_selling_brand text,
kross_price integer,
competitor_price integer,
kross_on_menu text,
menu_execution text,
pop_material text[],
competitors text[],
most_visible_competitor text,
recommended_brand_by_staff text,
competitor_notes text,
opportunity_type text[],
next_action text,
follow_up_date date,
follow_up_priority text,
general_notes text,
final_status text,
created_at timestamp with time zone default now()
```

---

## visit_photos

```sql
id uuid primary key default gen_random_uuid(),
visit_id uuid references visits(id) on delete cascade,
client_id uuid references clients(id) on delete cascade,
photo_url text not null,
photo_type text,
created_at timestamp with time zone default now()
```

Photo types:

```txt
fachada
barra
carta
material_pop
competencia
salidas_cerveza
otro
```

---

## routes

```sql
id uuid primary key default gen_random_uuid(),
user_id uuid references profiles(id),
name text not null,
region text,
zone_id uuid references zones(id),
route_date date,
status text default 'planificada',
created_at timestamp with time zone default now()
```

Status:

```txt
planificada
en_progreso
completada
cancelada
```

---

## route_clients

```sql
id uuid primary key default gen_random_uuid(),
route_id uuid references routes(id) on delete cascade,
client_id uuid references clients(id) on delete cascade,
position integer,
created_at timestamp with time zone default now()
```

---

# 6. Reglas de negocio

Cuando se crea una visita:

* debe quedar asociada a un local,
* debe quedar asociada al usuario,
* si `final_status` viene informado, actualizar `clients.status`,
* si hay `follow_up_date`, el local debe quedar visible en próximos seguimientos,
* las fotos deben guardarse en Supabase Storage y registrarse en `visit_photos`.

Cuando se importa cartera:

* no duplicar locales si ya existe uno con mismo nombre y comuna,
* normalizar región:

  * RM
  * V
* normalizar comunas con tildes:

  * Concon → Concón
  * Quilpue → Quilpué
  * Maipu → Maipú
  * Peñalolen → Peñalolén

Cuando se calcula avance:

```txt
avance = visitados / total locales de la zona
```

Considerar como visitados:

* visitado
* seguimiento
* no_atendido
* coordinar_hora
* administrador_no_disponible

Porque igual hubo gestión de visita.

Pero en dashboard mostrar separado el estado real.

---

# 7. Diseño visual

Estilo:

* limpio,
* profesional,
* corporativo,
* fácil de leer,
* pensado para uso en terreno.

Colores sugeridos:

* Azul oscuro para navegación principal.
* Verde para visitado.
* Rojo para pendiente.
* Amarillo/naranjo para seguimiento.
* Gris para no atendido.

Componentes:

* sidebar en desktop,
* bottom navigation o menú simple en mobile,
* cards KPI,
* tablas limpias,
* badges de estado,
* formularios por secciones.

---

# 8. Páginas necesarias

Crear estas rutas:

```txt
/login
/dashboard
/clientes
/clientes/[id]
/clientes/[id]/nueva-visita
/rutas
/rutas/nueva
/reportes/semanal
/configuracion/zonas
/importar
```

---

# 9. Componentes necesarios

Crear componentes reutilizables:

```txt
StatusBadge
PriorityBadge
ClientTable
ClientFilters
ClientCardMobile
VisitForm
PhotoUploader
KpiCard
ZoneProgressCard
WeeklyReportPreview
GoogleMapsButton
RoutePlanner
```

---

# 10. Datos iniciales sugeridos

Crear zonas iniciales:

## Región Metropolitana

```txt
Providencia / Manuel Montt / Bilbao
Ñuñoa / Plaza Ñuñoa
La Reina / Larraín
Las Condes / Vitacura
Santiago Centro / Bellavista
Otras comunas RM
```

## Quinta Región

```txt
Viña del Mar
Valparaíso
Reñaca / Concón
Quilpué / Villa Alemana
Interior / pendientes
```

Crear algunos locales de ejemplo:

```txt
Calabria — Providencia — visitado
Manuel Montt — Providencia — visitado
Los Fabulosos Manuel Montt — Providencia — visitado
Minga Pizzería — Providencia — visitado
Origin Bar — Providencia — visitado
Mardoqueo Bilbao — Providencia — visitado
Mardoqueo La Reina — La Reina — visitado
Mister Fish Bilbao — Providencia — visitado
Fogón del Gaucho La Reina — La Reina — visitado
Casa Vecchia Larraín — La Reina — visitado
Sanbar Plaza Ñuñoa — Ñuñoa — visitado
Lechuza Plaza Ñuñoa — Ñuñoa — visitado
Antonia Lounge Bar — Ñuñoa — coordinar_hora
Tapas y Birras Plaza Ñuñoa — Ñuñoa — administrador_no_disponible
```

---

# 11. Formularios y validación

Usar Zod para validar.

Ejemplo reglas:

* nombre del local obligatorio,
* región obligatoria,
* comuna obligatoria,
* fecha de visita obligatoria,
* estado final obligatorio al registrar visita,
* si `could_talk = false`, pedir motivo,
* si se suben fotos, exigir tipo de foto.

---

# 12. Entregable esperado

Construir una primera versión funcional con:

1. Login.
2. Dashboard con KPIs.
3. CRUD de clientes.
4. Importación CSV.
5. Ficha de local.
6. Registro de visitas.
7. Subida de fotos.
8. Cambio de estado del local.
9. Página de rutas básica.
10. Reporte semanal copiable.
11. Diseño responsive.

No construir todavía:

* mapa interactivo complejo,
* optimización automática de rutas,
* app móvil nativa,
* CRM avanzado,
* notificaciones push.

---

# 13. Prioridad de desarrollo

Construir en este orden:

1. Base Supabase y Auth.
2. Layout general.
3. Tabla clientes.
4. CRUD clientes.
5. Importador CSV.
6. Ficha local.
7. Formulario de visita.
8. Subida fotos.
9. Dashboard.
10. Reporte semanal.
11. Planificador de rutas.

---

# 14. Criterio de éxito del MVP

El MVP se considera exitoso si permite que la usuaria pueda:

* cargar su cartera,
* filtrar locales por zona,
* marcar visitados y pendientes,
* registrar una visita desde el celular,
* subir evidencia fotográfica,
* ver avance por zona,
* generar una minuta semanal clara para su supervisor.

---

