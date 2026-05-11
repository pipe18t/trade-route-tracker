# Trade Route Tracker — Manual de Uso

> **App web para seguimiento de rutas y visitas en terreno de Trade Marketing On Trade**
>
> Versión: MVP · Usuaria principal: Ejecutiva / Practicante Trade Marketing

---

## Índice

1. [Primeros pasos](#1-primeros-pasos)
2. [Dashboard](#2-dashboard)
3. [Zonas](#3-zonas)
4. [Cartera de clientes](#4-cartera-de-clientes)
5. [Importar desde Excel/CSV](#5-importar-desde-excelcsv)
6. [Ficha del local](#6-ficha-del-local)
7. [Registrar una visita](#7-registrar-una-visita) ★
8. [Planificar rutas](#8-planificar-rutas)
9. [Reporte semanal](#9-reporte-semanal)
10. [Uso en celular](#10-uso-en-celular)

---

## 1. Primeros pasos

### Iniciar sesión

1. Entra a la app desde tu computador o celular
2. Ingresa tu correo electrónico
3. Haz clic en **"Enviar enlace mágico"**
4. Revisa tu bandeja de entrada y abre el enlace
5. Quedarás autenticada automáticamente

> **Tip:** No necesitas contraseña. Cada vez que entres recibirás un enlace nuevo por correo.

### Pantalla principal

Al iniciar sesión verás el **Dashboard** con los indicadores de tu cartera.

### Cerrar sesión

- **Desktop:** Botón "Cerrar sesión" al final del sidebar izquierdo
- **Celular:** Menú "Más" en la barra inferior → "Cerrar sesión"

---

## 2. Dashboard

El dashboard te muestra de un vistazo el estado de tu cartera.

### KPIs rápidos

| Indicador | Qué significa |
|---|---|
| Total cartera | Todos los locales registrados |
| Visitados | Locales donde ya hiciste la visita |
| Pendientes | Locales que aún no has visitado |
| Seguimiento | Locales que requieren una segunda visita |
| Avance % | Porcentaje de locales gestionados sobre el total |
| Visitas semana | Cuántas visitas registraste esta semana |

### Distribución por estado

Barras de colores que muestran cuántos locales hay en cada estado:

- **Rojo:** Pendiente
- **Verde:** Visitado
- **Ámbar:** Seguimiento
- **Gris:** No atendido
- **Morado:** Coordinar hora
- **Azul:** Administrador no disponible

### Avance por zona

Tarjetas con barra de progreso por cada zona. Haz clic en una zona para ver solo los locales de esa zona.

### Próximos seguimientos

Lista de locales que requieren seguimiento, ordenados por fecha.

---

## 3. Zonas

Las zonas te permiten agrupar locales por área geográfica para organizar tus rutas.

### Ver zonas

Ve a **Zonas** desde el menú lateral. Verás dos tarjetas: Región Metropolitana y Quinta Región.

### Zonas incluidas por defecto

**RM:**
- Providencia / Manuel Montt / Bilbao
- Ñuñoa / Plaza Ñuñoa
- La Reina / Larraín
- Las Condes / Vitacura
- Santiago Centro / Bellavista
- Otras comunas RM

**V Región:**
- Viña del Mar
- Valparaíso
- Reñaca / Concón
- Quilpué / Villa Alemana
- Interior / pendientes

### Crear una zona nueva

1. Haz clic en **"Nueva zona"**
2. Asigna un nombre (ej: "Maipú / Cerrillos")
3. Selecciona la región (RM o V)
4. Opcional: agrega una descripción
5. Guarda

### Editar o eliminar

Cada zona tiene íconos de lápiz (editar) y papelera (eliminar).

> **Cuidado:** Si eliminas una zona, los locales asociados quedarán sin zona asignada.

---

## 4. Cartera de clientes

### Ver todos los locales

Ve a **Clientes** en el menú. Verás una tabla con todos los locales.

### Columnas

| Columna | Ejemplo |
|---|---|
| Nombre | Calabria |
| Dirección | General del Canto 45 |
| Zona | Providencia / Manuel Montt |
| Estado | Visitado |
| Prioridad | Alta |
| Visita | Lunes |

### Filtrar

Usa los filtros superiores para encontrar locales rápidamente:

- **Buscador:** Escribe parte del nombre
- **Región:** RM o V
- **Zona:** Filtra por una zona específica
- **Estado:** Pendiente, Visitado, Seguimiento, etc.
- **Prioridad:** Alta, Media, Baja

Ejemplo: filtra por **Zona = Providencia** y **Estado = Pendiente** para ver qué locales te faltan en esa zona.

### Abrir en Google Maps

Cada local tiene un botón **"Abrir en Google Maps"** que te lleva directo a la dirección.

### Crear un cliente manualmente

1. Haz clic en **"Nuevo cliente"**
2. Llena el formulario con los datos del local
3. Campos obligatorios: Nombre y Región
4. Selecciona la zona correspondiente
5. Define prioridad y estado
6. Guarda

### Editar un cliente

Desde la ficha del local, haz clic en el ícono de lápiz o ve a la sección de edición al final de la página.

### Eliminar

Usa el ícono de papelera en la tabla de clientes.

---

## 5. Importar desde Excel/CSV

Si ya tienes tu cartera en Excel, puedes importarla directamente.

### Preparar el archivo

1. Abre tu Excel
2. Guarda como **CSV (delimitado por comas)** o **CSV (delimitado por punto y coma)**
3. Asegúrate de que tenga estas columnas:

| Clientes | Región | Comuna | Ejecutivo | Día de Visita | Despacho |
|---|---|---|---|---|---|
| Calabria ; General Del Canto 45 | RM | Providencia | Francisca | Lunes | Martes |
| Dublin ; Manuel Montt 130 | RM | Providencia | Francisca | Lunes | Martes |

### Formato de la columna "Clientes"

Puedes poner el nombre y dirección juntos, separados por `;`:

```
Calabria ; General Del Canto 45
```

La app separará automáticamente:
- **Nombre:** "Calabria"
- **Dirección:** "General Del Canto 45"

Si no hay `;`, todo se guarda como nombre.

### Normalización automática

La app normaliza automáticamente:

| Escribes | Se convierte a |
|---|---|
| Concon | Concón |
| Quilpue | Quilpué |
| Maipu | Maipú |
| metropolitana, santiago | RM |
| valparaiso, quinta region | V |

### Duplicados

Si un local ya existe (mismo nombre + misma comuna), se omite automáticamente. Verás el conteo de "omitidos" al final.

### Pasos para importar

1. Ve a **Importar** en el menú
2. Arrastra tu archivo CSV o haz clic para seleccionarlo
3. Revisa la previsualización (primeros 50 registros)
4. Haz clic en **"Importar X clientes"**
5. Revisa el resultado: importados, omitidos y errores

---

## 6. Ficha del local

Desde la tabla de clientes, haz clic en el nombre para ver su ficha completa.

### Información que muestra

- Nombre y dirección
- Región, comuna y zona
- Estado actual (badge de color)
- Prioridad (badge)
- Día de visita y despacho
- Notas generales
- Botón **"Abrir en Google Maps"**

### Historial de visitas

Todas las visitas registradas a ese local, ordenadas de la más reciente a la más antigua. Cada visita muestra:
- Fecha y hora
- Persona contactada y cargo
- Estado final de la visita
- Notas y oportunidades detectadas

### Fotos

Galería de todas las fotos subidas en las visitas a este local. Haz clic en una foto para verla a tamaño completo.

### Registrar visita

Botón **"Registrar visita"** que te lleva al formulario de visita.

### Editar local

Al final de la página está el formulario de edición con todos los campos del local.

---

## 7. Registrar una visita ★

**Este es el módulo más importante de la app.**

### Cuándo usarlo

Cada vez que entras a un local en terreno, abres su ficha y registras la visita.

### Secciones del formulario

El formulario está dividido en 7 secciones:

#### 7.1 Datos básicos

| Campo | Ejemplo |
|---|---|
| Fecha de visita * | 2026-05-12 |
| Hora | 11:30 |
| Persona contactada | Carlos Muñoz |
| Cargo | Administrador |
| ¿Se pudo conversar? | Sí / No |

Si seleccionas **"No"**, se despliega un selector con el motivo:
- Administrador no disponible
- Administradora en reunión
- Pedir hora
- Local cerrado
- Encargado ocupado
- No corresponde visitar en ese horario
- Otro

> **Caso de uso:** Llegas a Tapas y Birras y la administradora está en reunión. Seleccionas "No" → "administradora en reunión". El local queda marcado para seguimiento.

#### 7.2 Posicionamiento de marca

| Campo | Ejemplo | Qué registrar |
|---|---|---|
| Salidas totales | 12 | ¿Cuántas llaves de cerveza tienen? |
| Salidas Kross | 3 | ¿Cuántas son Kross? |
| Marca más vendida | Torobayo | ¿Qué marca vende más? |
| Precio schop Kross | 3500 | Precio del schop Kross |
| Precio marca más vendida | 3200 | Precio de la competencia |
| ¿Kross en carta? | Sí / No | ¿Aparece en la carta? |
| Ejecución en carta | Correcto / Incorrecto / No aparece / Pendiente revisar | ¿Cómo está presentada? |

> **Caso de uso:** En Calabria ves que Kross está en carta pero mal escrito ("Kross" con una sola S). Seleccionas "Incorrecto" en ejecución en carta.

#### 7.3 Ejecución y visibilidad

Checkboxes de material POP visible:

- Ojo de buey
- Latón
- Portaplacas
- Vasos Kross
- Carta / menú
- Sticker
- Refrigerador
- Toldo / sombrilla
- Posavasos
- Ningún material visible
- Otro

> **Caso de uso:** En Mardoqueo Bilbao ves que tienen portaplacas, vasos Kross y sticker. Los marcas. Más adelante, en el reporte, sabrás que ese local tiene buena visibilidad.

#### 7.4 Competencia

| Campo | Ejemplo |
|---|---|
| Marca con mayor visibilidad | Torobayo |
| Marca recomendada por garzones | Kunstmann |
| Observaciones | Torobayo domina la barra con 4 llaves vs 1 de Kross |

#### 7.5 Oportunidades

Checkboxes de oportunidades detectadas:

- Falta material POP
- Mejorar visibilidad en barra
- Mejorar presencia en carta
- Oportunidad de capacitación
- Oportunidad de activación
- Oportunidad de cambio de mix
- Local solicita material
- Local solicita visita comercial
- Seguimiento con administrador
- Otro

> **Caso de uso:** En Antonia Lounge Bar detectas que falta material POP y el local solicita visita comercial. Marcas ambas. En el reporte semanal aparecerán agrupadas.

#### 7.6 Fotos

Sube fotos como evidencia de la visita:

1. Haz clic en el área punteada o arrastra imágenes
2. Selecciona el tipo de cada foto:
   - Fachada
   - Barra
   - Carta
   - Material POP
   - Competencia
   - Salidas
   - Otro
3. Puedes subir varias fotos a la vez

> **Tip en celular:** Te preguntará si quieres usar la cámara o la galería. Usa la cámara para sacar la foto en el momento.

#### 7.7 Estado final y próximo paso

| Campo | Ejemplo |
|---|---|
| Próxima acción | Coordinar capacitación para garzones |
| Fecha seguimiento | 2026-05-19 |
| Prioridad seguimiento | Alta / Media / Baja |
| Notas generales | El administrador pidió merchandising para el mes siguiente |
| Estado final * | Visitado / Seguimiento / No atendido / Coordinar hora / Adm. no disponible |

> **Importante:** El campo "Estado final" actualiza automáticamente el estado del local en la cartera.

### Guardar

Haz clic en **"Registrar visita"**. Los cambios se aplican inmediatamente:
- La visita queda registrada en el historial del local
- Las fotos se suben a la nube
- El estado del local se actualiza automáticamente
- El dashboard refleja los nuevos números

---

## 8. Planificar rutas

### Crear una ruta

1. Ve a **Rutas** y haz clic en **"Nueva ruta"**
2. Ponle un nombre (ej: "Ruta Providencia Lunes 12 mayo")
3. Selecciona fecha
4. Elige región y zona
5. Verás la lista de **locales pendientes** en esa zona
6. Haz clic en cada local para agregarlo a la ruta
7. Usa las flechas ↑↓ para ordenarlos en el orden que los visitarás

### Ver la ruta en Google Maps

Una vez creada la ruta, entra a su detalle. Verás:
- Lista numerada de locales
- Botón individual **"Abrir en Google Maps"** por cada local
- Botón grande **"Ver ruta en Google Maps"** con todos los locales (origen, waypoints, destino)

> **Caso de uso:** Planificas la ruta de Providencia con 5 locales. Abres "Ver ruta en Google Maps" y Google te traza la ruta óptima entre los 5 puntos.

### Gestionar el estado de la ruta

- **Iniciar:** Cuando sales a terreno
- **Completar:** Cuando terminaste todas las visitas
- **Cancelar:** Si no se hizo la ruta
- **Eliminar:** Borra la ruta permanentemente

---

## 9. Reporte semanal

**Este módulo es para llegar preparada los lunes.**

### Generar el reporte

1. Ve a **Reportes** en el menú
2. Selecciona el rango de fechas (por defecto: lunes a hoy)
3. Elige la región (o "Todas")
4. Opcional: filtra por una zona específica
5. Haz clic en **"Generar reporte"**

### ¿Qué contiene?

El reporte muestra:

- **Cabecera:** Semana, ejecutiva, región, zonas trabajadas
- **Resumen ejecutivo:** Texto dinámico con las zonas y foco del trabajo
- **Indicadores:**
  - Locales visitados
  - Locales con seguimiento
  - Locales no atendidos
  - Locales con oportunidad de mejora
- **Tabla de visitas:** Local, zona, estado y hallazgo de cada visita
- **Oportunidades detectadas:** Agrupadas por tipo con los nombres de los locales
- **Próximos pasos:** Acciones sugeridas con fechas de seguimiento

### Copiar para correo o documento

Haz clic en **"Copiar reporte"**. El reporte se copia como texto formateado, listo para pegar en:

- Un correo al supervisor
- Un documento de Google Docs
- Un PowerPoint
- WhatsApp / Teams

Ejemplo del formato copiado:

```
Reporte semanal — Trade Marketing On Trade
Semana: 12/05/2026 al 16/05/2026
Ejecutiva: Francisca Contreras
Región: RM
Zonas trabajadas: Providencia / Manuel Montt / Bilbao, Ñuñoa / Plaza Ñuñoa

────────────────────────────────────────
RESUMEN EJECUTIVO
────────────────────────────────────────
Durante la semana se realizaron visitas a locales de las zonas Providencia / Manuel Montt 
/ Bilbao, Ñuñoa / Plaza Ñuñoa, con foco en levantamiento de ejecución de marca, 
visibilidad Kross, presencia de competencia y oportunidades de mejora en PDV.

────────────────────────────────────────
INDICADORES
────────────────────────────────────────
• Locales visitados: 13
• Locales con seguimiento: 2
• Locales no atendidos: 0
• Locales con oportunidad de mejora: 5
...
```

---

## 10. Uso en celular

La app está diseñada para usarse en terreno desde el celular.

### Barra de navegación inferior

En celular verás una barra fija abajo con 5 botones:

| Botón | Te lleva a |
|---|---|
| Inicio | Dashboard |
| Clientes | Lista de clientes |
| Rutas | Tus rutas planificadas |
| Reporte | Generar reporte semanal |
| Más | Menú con Importar, Zonas y Cerrar sesión |

### Consejos para terreno

1. **Antes de salir:** Planifica la ruta en el computador. Así en celular solo abres la ruta y ves los locales ordenados.

2. **Durante la visita:** Abre la ficha del local → "Registrar visita". El formulario está optimizado para celular con secciones apiladas.

3. **Fotos:** Usa la cámara del celular directamente desde el botón de subir fotos. No necesitas salir de la app.

4. **Google Maps:** Cada local tiene el botón que abre Google Maps con un solo toque. Perfecto para navegar entre locales.

5. **Sin señal:** La app funciona con datos móviles normales. Si te quedas sin señal, la visita no se guardará hasta que recuperes conexión (estamos trabajando en modo offline para una versión futura).

### Check-list de terreno

Antes de salir a ruta:

- [ ] Revisar dashboard: ¿cuántos pendientes hay en la zona?
- [ ] Crear ruta con los locales a visitar
- [ ] Abrir ruta en Google Maps para ver el recorrido
- [ ] Verificar que tienes datos móviles

Al llegar a cada local:

- [ ] Abrir ficha del local desde la ruta
- [ ] Registrar visita
- [ ] Sacar fotos (fachada, barra, material POP)
- [ ] Marcar estado final

Al volver:

- [ ] Revisar dashboard actualizado
- [ ] Ver próximos seguimientos
- [ ] Generar reporte semanal
- [ ] Copiar y enviar al supervisor

---

## Flujo completo de ejemplo

### Lunes en la mañana (oficina)

1. Inicias sesión en la app
2. Dashboard muestra: 350 pendientes, 13 visitados, 3.5% avance
3. Vas a **Rutas → Nueva ruta**
4. Seleccionas: RM → Providencia / Manuel Montt / Bilbao
5. Agregas 5 locales pendientes, los ordenas
6. Guardas la ruta: "Ruta Providencia Lunes 12 mayo"
7. Haces clic en "Ver ruta en Google Maps"
8. El mapa te muestra el recorrido: Calabria → Los Fabulosos → Minga → Origin → Mardoqueo

### Lunes en terreno

1. Abres la app en el celular
2. Vas a **Rutas** → "Ruta Providencia Lunes 12 mayo"
3. Primer local: **Calabria**
   - Tocas "Visitar"
   - Registras: administrador disponible, 3 salidas Kross de 12 totales, material POP visible (ojo de buey, portaplacas)
   - Sacas foto de la barra
   - Marcas estado: **Visitado**
   - Guardas
4. Repites en cada local
5. En **Antonia Lounge Bar** (estaba en seguimiento): administradora sigue en reunión
   - Registras: "No se pudo conversar" → "administradora en reunión"
   - Próximo paso: "Volver a contactar jueves"
   - Estado: **Seguimiento**

### Viernes (preparando el lunes)

1. Vas a **Reportes**
2. Seleccionas: 12 mayo → 16 mayo, Región RM
3. Generas el reporte
4. Ves: 13 visitados, 2 seguimiento, 5 con oportunidad de mejora
5. Copias el reporte
6. Lo pegas en el correo al supervisor
7. Adjuntas las fotos clave (o compartes el link a la app)

---

## Preguntas frecuentes

### ¿Puedo usar la app sin conexión?

Por ahora no. El modo offline está planeado para una versión futura. Necesitas datos móviles o WiFi.

### ¿Las fotos ocupan espacio en mi celular?

No. Las fotos se suben a la nube de Supabase. Puedes verlas desde cualquier dispositivo. Solo ocupan espacio temporal durante la subida.

### ¿Qué hago si un local cambia de dirección?

Ve a la ficha del local, edita los datos y guarda. El historial de visitas se mantiene.

### ¿Puedo compartir el acceso con mi supervisor?

En esta versión MVP el acceso es personal. El supervisor puede recibir el reporte semanal que generas. En una versión futura tendrá su propio acceso con vista de supervisión.

### ¿Cómo agrego una zona nueva para una comuna que no está en la lista?

Ve a **Zonas → Nueva zona**, asígnale un nombre descriptivo y la región. Luego asigna los locales a esa zona desde su ficha.

### ¿Se puede exportar a PDF?

Por ahora el reporte se copia como texto para pegar en correo o documento. La exportación a PDF llegará en una versión futura.

---

## Atajos y tips

| Acción | Cómo hacerlo rápido |
|---|---|
| Ver pendientes de una zona | Dashboard → clic en tarjeta de zona |
| Abrir Google Maps | Botón en cada fila de la tabla o en la ficha |
| Subir varias fotos | Arrastra todas a la vez al área de upload |
| Copiar reporte | Un clic en "Copiar reporte" y ya está en el portapapeles |
| Ordenar ruta | Flechas ↑↓ al lado de cada local en la ruta |
| Buscar local | Escribe en el buscador de Clientes, busca por nombre parcial |

---

> **Trade Route Tracker v1.0 — MVP**
>
> ¿Encontraste un bug o tienes una sugerencia? Repórtalo en https://github.com/pipe18t/trade-route-tracker/issues
