MVP propuesto: “Trade Route Tracker”

Una app web simple para planificar rutas, registrar visitas a locales, actualizar estado del PDV y generar reportes semanales.

La idea central:

“Que Francisca pueda organizar su cartera de clientes por zona, marcar visitados/pendientes, registrar hallazgos de terreno y llegar los lunes con un reporte ordenado para el área comercial/trade.”

1. Problema que resuelve

Hoy tienes:

una cartera grande de clientes RM y V Región,
locales visitados y pendientes mezclados,
rutas que debes organizar manualmente,
información levantada en terreno en notas, fotos o memoria,
necesidad de presentar minutas semanales,
seguimiento de locales donde no pudiste hablar con administrador,
y poca visibilidad rápida de qué zona ya avanzaste.

La app debe resolver esto:

“No perder información de terreno y transformar las visitas en datos útiles para tomar decisiones comerciales.”

2. Usuario principal del MVP
Usuario 1: Practicante / Ejecutiva Trade Marketing

Necesita:

ver cartera por región/comuna/zona,
planificar ruta diaria o semanal,
marcar local como visitado,
registrar observaciones,
subir fotos,
anotar materiales POP,
dejar pendientes,
generar minuta semanal.
Usuario 2 futuro: Supervisor / Jefe On Trade

Necesita:

ver avance de visitas,
revisar oportunidades detectadas,
identificar locales críticos,
saber dónde falta material POP,
ver reportes por zona o ejecutivo.

Para el MVP, partimos pensando en Usuario 1, o sea tú.

3. Objetivo del MVP

El MVP no debe partir como “app perfecta con mapa avanzado”.

Debe partir como:

Una herramienta de seguimiento de visitas y rutas que permita cargar locales, organizarlos por zona, registrar visitas y generar un reporte semanal exportable.

Eso ya tiene valor real.

4. Funcionalidades del MVP
Módulo 1: Login simple

Necesario si vas a usar Supabase.

Funciones:

iniciar sesión con correo,
perfil de usuario,
rol básico: practicante / supervisor.

Para la primera versión puede ser solo tu usuario.

Módulo 2: Cartera de clientes

Vista tipo tabla con todos los locales.

Campos mínimos:

Campo	Ejemplo
Nombre local	Calabria
Dirección	General del Canto 45
Región	RM
Comuna	Providencia
Zona ruta	Providencia / Manuel Montt / Bilbao
Ejecutivo	Nombre
Día de visita sugerido	Lunes
Día despacho	Martes
Estado	Pendiente / Visitado / Seguimiento
Prioridad	Alta / Media / Baja

Estados recomendados:

Pendiente
Visitado
Seguimiento
No atendido
Coordinar hora
Administrador no disponible

Esto te sirve mucho para Antonia Lounge Bar o Tapas y Birras, por ejemplo.

Módulo 3: Zonas y rutas

Vista agrupada por zona.

Ejemplo RM:

Providencia / Manuel Montt / Bilbao
Ñuñoa / Plaza Ñuñoa
La Reina / Larraín
Las Condes / Vitacura
Santiago Centro / Bellavista
Otras comunas

Ejemplo V Región:

Viña del Mar
Valparaíso
Reñaca / Concón
Quilpué / Villa Alemana
Interior / pendientes

Cada zona debería mostrar:

total de locales,
visitados,
pendientes,
seguimiento,
porcentaje de avance.

Ejemplo:

Zona	Locales	Visitados	Pendientes	Avance
Providencia / Manuel Montt	30	7	23	23%
Ñuñoa / Plaza Ñuñoa	12	4	8	33%
5. Registro de visita

Este es el corazón de la app.

Cuando entras a un local, abres su ficha y registras:

Datos básicos
Fecha visita
Hora visita
Persona contactada
Cargo: administrador, garzón, jefe local, encargado barra
¿Se pudo conversar? Sí / No
Motivo si no se pudo: ocupado, no estaba, pedir hora, local cerrado
Posicionamiento de marca
¿Cuántas salidas totales de cerveza tiene?
¿Cuántas son Kross?
¿Marca más vendida?
Precio schop Kross
Precio marca más vendida
¿Kross está en carta?
¿Cómo aparece en carta? Correcto / incorrecto / no aparece
Ejecución y visibilidad
Material POP visible
Ojo de buey
Latón
Portaplacas
Vasos Kross
Menú / carta
Mesa / barra
Toldos / sombrillas
Refrigerador / sticker
Otro
Competencia
Marcas competidoras presentes
Marca con mayor visibilidad
Marca que recomienda el garzón
Observaciones de precio
Oportunidades
Falta material POP
Falta capacitación
Oportunidad de activación
Oportunidad de cambio de mix
Solicitan material
Solicitan visita comercial
Requiere seguimiento
Fotos
Fachada
Barra
Carta
Material POP
Salidas / schop
Competencia
Observación adicional
6. Reporte semanal automático

Este módulo es CLAVE para que tú llegues pro los lunes.

La app debería generar un resumen tipo minuta:

Reporte semanal — Trade Marketing On Trade

Semana: 4 al 9 de mayo
Ejecutiva: Francisca Contreras
Región: RM
Zonas trabajadas: Providencia / Ñuñoa / La Reina

Resumen ejecutivo

Durante la semana se realizaron visitas a locales de las zonas Providencia, Plaza Ñuñoa y La Reina, con foco en levantamiento de ejecución de marca, visibilidad Kross, presencia de competencia y oportunidades de mejora en PDV.

Indicadores
Indicador	Resultado
Locales visitados	13
Locales con seguimiento pendiente	2
Locales sin administrador disponible	2
Locales con material POP visible	X
Locales con oportunidad de mejora	X
Locales visitados
Local	Zona	Estado	Hallazgo
Calabria	Providencia	Visitado	Levantamiento realizado
Mardoqueo Bilbao	Providencia/Bilbao	Visitado	Revisar presencia vs competencia
Antonia Lounge Bar	Ñuñoa	Seguimiento	Solicitan coordinar hora
Tapas y Birras	Ñuñoa	Seguimiento	Administradora en reunión
Oportunidades detectadas
Mejorar visibilidad en locales sin material POP.
Reforzar presencia en carta.
Identificar locales donde Torobayo supera a Kross pese a diferencia de precio.
Evaluar capacitación a garzones sobre variedades Kross.
Coordinar seguimiento con administradores no disponibles.
Próximos pasos
Agendar visita con Antonia Lounge Bar.
Volver a contactar Tapas y Birras.
Continuar ruta en Las Condes / Vitacura.
Priorizar locales con alta presencia de competencia.
7. Dashboard inicial

Pantalla principal:

KPIs rápidos
Total cartera
Visitados
Pendientes
Seguimiento
Avance semanal
Avance por región
Avance por zona

Ejemplo:

KPI	Resultado
Total locales cartera	363
Visitados	13
Pendientes	350
Seguimientos	2
Avance total	3,5%
Gráficos simples

Para MVP:

barra por zona,
torta de estados,
tabla de próximos seguimientos.

Nada demasiado complejo al inicio.

8. Mapa: versión MVP realista

Para el MVP no partiría con mapa ultra avanzado.

Primera versión:

tabla filtrable por zona,
chips de color por estado,
link a Google Maps por dirección,
vista de ruta por día.

Después agregamos mapa interactivo.

Versión 1 del mapa

Cada local tiene botón:

“Abrir en Google Maps”

Y la app permite seleccionar varios locales para una ruta.

Ejemplo:

Calabria
Los Fabulosos Manuel Montt
Minga Pizzería
Origin Bar
Mardoqueo Bilbao

Botón:

“Ver ruta en Google Maps”

Versión 2 futura

Mapa integrado con:

pins verdes: visitado,
pins rojos: pendiente,
pins amarillos: seguimiento,
filtros por zona,
filtros por estado,
clustering de puntos.
9. Priorización MVP: qué entra y qué NO entra
Sí entra en MVP
Login
Carga de cartera desde Excel/CSV
Tabla de locales
Filtros por región, comuna, zona y estado
Ficha de local
Registro de visita
Estado visitado/pendiente/seguimiento
Subida de fotos
Dashboard básico
Reporte semanal exportable
Link a Google Maps
No entra todavía
App móvil nativa
GPS en tiempo real
IA para optimizar rutas automáticamente
Integración directa con CRM
Notificaciones push
Roles complejos
Aprobaciones del supervisor
Mapa con rutas inteligentes avanzado
Offline mode

Eso puede venir después.

10. Stack recomendado
Frontend

Next.js

Ideal porque puedes hacer:

dashboard,
vistas protegidas,
formularios,
reportes,
exportaciones,
app web responsive.
Backend / Base de datos

Supabase

Ideal para:

autenticación,
base de datos PostgreSQL,
almacenamiento de fotos,
permisos por usuario,
API automática.
UI
Tailwind CSS
shadcn/ui
React Hook Form
Zod para validar formularios
TanStack Table para tablas
Recharts para gráficos
Mapas

Primera etapa:

Google Maps links

Segunda etapa:

Mapbox
Leaflet
Google Maps API

Para MVP, partiría con Google Maps links para no complicarse.

11. Modelo de datos inicial
Tabla: users
Campo	Tipo
id	uuid
name	text
email	text
role	text
created_at	timestamp

Roles:

admin
supervisor
ejecutivo
practicante
Tabla: clients
Campo	Tipo
id	uuid
name	text
address	text
region	text
comuna	text
zone	text
executive	text
visit_day	text
dispatch_day	text
priority	text
status	text
google_maps_url	text
created_at	timestamp
Tabla: visits
Campo	Tipo
id	uuid
client_id	uuid
user_id	uuid
visit_date	date
visit_time	time
contact_name	text
contact_role	text
could_talk	boolean
no_contact_reason	text
total_taps	integer
kross_taps	integer
best_selling_brand	text
kross_price	integer
competitor_price	integer
kross_on_menu	text
pop_material	text[]
competitors	text[]
opportunity_type	text[]
notes	text
next_action	text
created_at	timestamp
Tabla: visit_photos
Campo	Tipo
id	uuid
visit_id	uuid
photo_url	text
photo_type	text
created_at	timestamp

Tipos de foto:

fachada
barra
carta
material POP
competencia
otro
Tabla: zones
Campo	Tipo
id	uuid
name	text
region	text
description	text
12. Flujo de uso ideal
Antes de salir a ruta
Entras a la app.
Filtras por región: RM.
Filtras por zona: Providencia / Manuel Montt / Bilbao.
Ves pendientes.
Seleccionas locales para visitar.
Abres ruta en Google Maps.
Sales a terreno.
Durante la visita
Abres ficha del local.
Presionas “Registrar visita”.
Llenas formulario.
Subes fotos.
Defines estado:
visitado,
seguimiento,
no atendido.
Guardas.
Después de terreno
Revisas dashboard.
Ves oportunidades detectadas.
Generas minuta semanal.
Exportas PDF o copias texto para correo/reunión.
