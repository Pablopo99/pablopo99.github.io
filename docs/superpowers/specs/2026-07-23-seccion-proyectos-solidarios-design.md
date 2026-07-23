# Sección «Proyectos solidarios» — Diseño

Fecha: 2026-07-23

## Objetivo

Añadir al CV virtual una sección que ponga en valor la **iniciativa e impacto
social** de Pablo a través de **Almas Inquietas** y sus proyectos. Ángulo
principal: iniciativa + impacto social; el uso de IA y herramientas digitales
aparece como sello propio, sobre todo en *Ride the Wave*.

## Ubicación

- Nueva sección `#proyectos` **tras Trayectoria** y antes de Formación.
- Nuevo ítem en el menú: «Proyectos» (ES) / «Projects» (EN).
- Orden final: Perfil · Áreas · Trayectoria · **Proyectos** · Formación · Idiomas · Contacto.

## Formato

- **Almas Inquietas como paraguas**: intro breve (qué es + rol de Pablo) y debajo
  los tres proyectos.
- Cada proyecto es un **`<details>`/`<summary>` nativo** (desplegable, se abre al
  pulsar, **funciona sin JavaScript**). El *summary* siempre visible; el detalle
  al desplegar.
- **Impresión**: la hoja de impresión fuerza los desplegables **abiertos** para que
  el CV exportado a PDF muestre todo el contenido.
- **Bilingüe** con `data-i18n` (español en `index.html`, inglés en
  `content/en.json`); el verificador `tools/comprobar-i18n.mjs` debe quedar en verde.
- Estilo sobrio y coherente con las secciones actuales (`.seccion`, `.puesto`);
  nuevos estilos para `.proyecto`.

## Contenido

### Intro — Almas Inquietas

Colectivo solidario del que Pablo es **miembro asociado** y en el que **colabora en
la organización de los eventos** (sin cargo formal, coherente con su CV en PDF).
Idea: «el movimiento transforma» — organizan torneos y retos solidarios, crean
comunidad y convierten la actividad física en fondos para causas sociales.

### Proyecto 1 — Torneo de fútbol solidario

- Resumen: torneo benéfico organizado con Almas Inquietas; la recaudación se
  destinó a una ONG.
- **Pendiente de confirmar**: año y nombre exacto de la ONG beneficiaria
  (Pablo mencionó «Idiorama», por verificar).

### Proyecto 2 — Torneo de pádel solidario

- Resumen: análogo al de fútbol.
- **Pendiente de confirmar**: año y ONG beneficiaria.

### Proyecto 3 — Ride the Wave (en curso, 2026)

Datos **confirmados** (documento del proyecto + webs en vivo, jul 2026):

- **Qué es**: reto solidario en el que **Alejandro de Santiago («Álex»),
  cofundador**, recorre en bici de **Praga a Madrid** cruzando **9 países**
  (Chequia, Austria, Alemania, Suiza, Liechtenstein, Italia, Mónaco, Francia,
  España), y una comunidad suma kilómetros por Strava.
- **Modelo «Un Kilómetro, Un Euro»**: meta de **~4.000 km = 4.000 €**.
- **Beneficiaria: Fundación Verón** (entidad española con sede en Madrid que
  financia educación e inserción laboral de jóvenes en **Honduras**). Los fondos
  apoyan su programa **«Beca Comedor»**: 4.000 € cubren la beca comedor de **una
  clase entera durante un curso completo**.
- **Ángulo IA/digital** (papel de Pablo y el equipo): conteo de kilometraje **en
  tiempo real** integrando Strava, **web de la ruta con mapa y etapas en vivo**,
  **contador comunitario** con ranking, y **crowdfunding** — ejemplo real de uso
  de IA y herramientas digitales al servicio de una causa.
- **Estado**: iniciativa **en marcha** (arrancó en julio de 2026). Se presenta la
  meta de 4.000 €, **sin afirmar que ya se ha recaudado**.

**Enlaces propuestos** (a confirmar cuáles se muestran):
- Web de la ruta en vivo: `https://ride-the-wave-nine.vercel.app`
- Contador comunitario: `https://strava-counter-almas-inquietas.vercel.app`
- Instagram del colectivo: `@almasinquietas_org` (público)
- Crowdfunding: pendiente de que Pablo dé la URL.

## Datos pendientes de Pablo (no se publican hasta confirmar)

1. Torneos de fútbol y pádel: **años** y **ONG beneficiaria** (¿Idiorama?).
2. **URL del crowdfunding** de Ride the Wave.
3. Qué **enlaces** de los propuestos quiere mostrar en el CV.
4. Nombre de la sección: se propone «Proyectos solidarios» / «Social-impact
   projects» (alternativas: «Compromiso social», «Impacto»).

## Datos excluidos deliberadamente (veracidad / privacidad)

- **Datos personales de terceros**: teléfono y email de Alejandro de Santiago que
  aparecen en el documento **no se publican**.
- **Objetivos aspiracionales de la «Biblia» de Almas Inquietas** (maratón, carrera
  benéfica de 300 personas, recaudar 30.000 €, etc.): son planes de dic. 2024, no
  hechos ejecutados; no se presentan como logros.
- **Inconsistencias del propio dossier** (p. ej. «60 días» vs «70 días»): se evita
  dar un número exacto de días; se habla de un reto de aproximadamente dos meses.
- **Cifras del reto como logro**: los 4.000 km / 4.000 € son la **meta**, no lo
  recaudado a fecha de hoy.

## Accesibilidad e integración

- `<details>`/`<summary>` nativos: accesibles por teclado, contenido legible sin JS.
- Nuevas claves i18n ES/EN; actualizar el menú de navegación (ES en `index.html` +
  EN en `content/en.json`) con el ítem «Proyectos» / «Projects».
- No se toca el JSON-LD (la sección no cambia el `jobTitle` ni los datos de Person).
- Hoja de impresión: `@media print` abre los desplegables.
- Sin imágenes en esta primera versión; se podrán añadir después optimizadas.
