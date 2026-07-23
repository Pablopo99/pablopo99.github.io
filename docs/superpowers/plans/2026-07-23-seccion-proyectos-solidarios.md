# Sección «Proyectos solidarios» — Plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Añadir al CV virtual una sección bilingüe «Proyectos solidarios» (Almas Inquietas + tres proyectos en desplegables `<details>`), tras Trayectoria.

**Architecture:** HTML estático en `index.html` (español por defecto) con atributos `data-i18n`; el inglés vive en `content/en.json` y lo aplica `assets/js/app.js`. Estilos en `assets/css/styles.css`. Los proyectos son `<details>/<summary>` nativos (desplegables sin JavaScript). Verificación con `tools/comprobar-i18n.mjs`, Playwright y `curl` en producción.

**Tech Stack:** HTML + CSS + JS vanilla, sin frameworks ni build. GitHub Pages (rama `master`, raíz). Node para el verificador de i18n.

## Global Constraints

- **Veracidad estricta:** solo datos confirmados (ver spec `docs/superpowers/specs/2026-07-23-seccion-proyectos-solidarios-design.md`). Los 4.000 km / 4.000 € son **meta**, no logro. No publicar teléfono ni email de terceros.
- **Bilingüe con paridad:** cada `data-i18n` nuevo en `index.html` debe tener su clave en `content/en.json`. `node tools/comprobar-i18n.mjs` debe imprimir «OK».
- **Sin dependencia de JavaScript:** el contenido debe leerse aunque el JS no cargue; los desplegables son `<details>` nativos.
- **Estética sobria:** reutilizar variables (`--color-*`, `--espacio-*`) y patrones existentes (`.seccion`, `.puesto`).
- **Publicar = commit + `git push origin master`;** Pages reconstruye en 1-2 min.
- **Rol de Pablo:** «miembro asociado» que «colabora en la organización de los eventos». Sin cargo formal.

---

### Task 1: Ítem de menú + sección HTML (ES) + traducciones (EN)

**Files:**
- Modify: `index.html` (nav ~línea 67; nueva sección tras `</section>` de Trayectoria, línea 229)
- Modify: `content/en.json` (añadir bloque de claves `nav.proyectos` y `proyectos.*`)
- Test: `tools/comprobar-i18n.mjs`

**Interfaces:**
- Produces: sección `#proyectos` con `data-i18n` cuyas claves consumen `en.json` y `app.js` (sin cambios en JS).

- [ ] **Step 1: Añadir el ítem de menú.** En `index.html`, tras la línea `<li><a href="#trayectoria" data-i18n="nav.trayectoria">Trayectoria</a></li>` (línea 67), insertar:

```html
          <li><a href="#proyectos" data-i18n="nav.proyectos">Proyectos</a></li>
```

- [ ] **Step 2: Insertar la sección.** En `index.html`, entre el `</section>` que cierra Trayectoria (línea 229) y el comentario `5. Formación y certificaciones` (línea 232), insertar:

```html

    <!-- ==================================================================
         5. Proyectos solidarios
         ================================================================== -->
    <section class="seccion" id="proyectos" aria-labelledby="proyectos-titulo" data-revelar>
      <div class="seccion__etiqueta">
        <h2 class="seccion__titulo" id="proyectos-titulo" data-i18n="proyectos.titulo">Proyectos solidarios</h2>
      </div>
      <div class="seccion__cuerpo">
        <p data-i18n="proyectos.intro">Formo parte de Almas Inquietas, un colectivo solidario que convierte el deporte en un bien colectivo: organizamos torneos y retos benéficos, creamos comunidad y destinamos lo recaudado a causas sociales. Colaboro como miembro asociado en la organización de los eventos.</p>
        <p class="proyectos__enlaces">
          <a href="https://www.instagram.com/almasinquietas_org" target="_blank" rel="noopener noreferrer" data-i18n="proyectos.almas.instagram">Instagram de Almas Inquietas</a>
          <a href="https://www.linkedin.com/company/almas-inquietas/" target="_blank" rel="noopener noreferrer" data-i18n="proyectos.almas.linkedin">LinkedIn de Almas Inquietas</a>
        </p>

        <details class="proyecto">
          <summary class="proyecto__resumen">
            <span class="proyecto__nombre" data-i18n="proyectos.futbol.nombre">Torneo de fútbol solidario</span>
            <span class="proyecto__fecha" data-i18n="proyectos.futbol.fecha">septiembre de 2025</span>
          </summary>
          <div class="proyecto__detalle">
            <p data-i18n="proyectos.futbol.texto">Torneo benéfico organizado con Almas Inquietas cuya recaudación se destinó a Ideorama, asociación sin ánimo de lucro centrada en intervención educativa, uso responsable de la tecnología y ocio saludable para jóvenes.</p>
            <p class="proyecto__meta" data-i18n="proyectos.futbol.patrocinadores">Con el apoyo de patrocinadores como Día, Telepizza y el Ayuntamiento de Pozuelo.</p>
            <p class="proyecto__enlace"><a href="https://ideorama.org" target="_blank" rel="noopener noreferrer" data-i18n="proyectos.futbol.enlace">Conoce Ideorama</a></p>
          </div>
        </details>

        <details class="proyecto">
          <summary class="proyecto__resumen">
            <span class="proyecto__nombre" data-i18n="proyectos.padel.nombre">Torneo de pádel solidario</span>
            <span class="proyecto__fecha" data-i18n="proyectos.padel.fecha">diciembre de 2025</span>
          </summary>
          <div class="proyecto__detalle">
            <p data-i18n="proyectos.padel.texto">Segundo torneo benéfico con Almas Inquietas, de nuevo a beneficio de Ideorama.</p>
            <p class="proyecto__meta" data-i18n="proyectos.padel.patrocinadores">Con el apoyo de patrocinadores como MG Albian Motor, Padel Bularas, Blas Méndez Ponce, Minigymrats, Cañas y Tapas, Día y Herbalife.</p>
            <p class="proyecto__enlace"><a href="https://ideorama.org" target="_blank" rel="noopener noreferrer" data-i18n="proyectos.padel.enlace">Conoce Ideorama</a></p>
          </div>
        </details>

        <details class="proyecto">
          <summary class="proyecto__resumen">
            <span class="proyecto__nombre" data-i18n="proyectos.rtw.nombre">Ride the Wave</span>
            <span class="proyecto__fecha" data-i18n="proyectos.rtw.fecha">2026</span>
          </summary>
          <div class="proyecto__detalle">
            <p data-i18n="proyectos.rtw.texto">Reto solidario de Almas Inquietas: Alejandro de Santiago, cofundador, recorre en bicicleta de Praga a Madrid cruzando nueve países mientras una comunidad suma kilómetros por Strava. Bajo el lema «un kilómetro, un euro», la meta es reunir 4.000 € para el programa Beca Comedor de la Fundación Verón, que financia educación e inserción laboral de jóvenes en Honduras: 4.000 € cubren el comedor de una clase entera durante un curso completo.</p>
            <p data-i18n="proyectos.rtw.contribucion">Colaboro en el proyecto, que se apoya en herramientas digitales e inteligencia artificial: conteo de kilometraje en tiempo real integrado con Strava, una web de la ruta con mapa y etapas en vivo, un contador comunitario y una campaña de crowdfunding.</p>
            <p class="proyecto__enlace">
              <a href="https://ride-the-wave-nine.vercel.app" target="_blank" rel="noopener noreferrer" data-i18n="proyectos.rtw.enlace.ruta">Sigue la ruta en vivo</a>
              <a href="https://strava-counter-almas-inquietas.vercel.app" target="_blank" rel="noopener noreferrer" data-i18n="proyectos.rtw.enlace.contador">Contador de la comunidad</a>
            </p>
          </div>
        </details>
      </div>
    </section>
```

- [ ] **Step 3: Añadir las claves inglesas.** En `content/en.json`, tras la línea `"nav.trayectoria": ...` añadir `"nav.proyectos": "Projects",` y, en el bloque temático que corresponda (p. ej. tras las claves de trayectoria), añadir:

```json
  "proyectos.titulo": "Social-impact projects",
  "proyectos.intro": "I'm part of Almas Inquietas, a grassroots collective that turns sport into a common good: we organize charity tournaments and challenges, build community and channel what we raise to social causes. I collaborate as an associate member in organizing the events.",
  "proyectos.almas.instagram": "Almas Inquietas on Instagram",
  "proyectos.almas.linkedin": "Almas Inquietas on LinkedIn",
  "proyectos.futbol.nombre": "Charity football tournament",
  "proyectos.futbol.fecha": "September 2025",
  "proyectos.futbol.texto": "Charity tournament organized with Almas Inquietas; proceeds went to Ideorama, a non-profit focused on educational programs, responsible use of technology and healthy leisure for young people.",
  "proyectos.futbol.patrocinadores": "Backed by sponsors including Día, Telepizza and Pozuelo Town Council.",
  "proyectos.futbol.enlace": "About Ideorama",
  "proyectos.padel.nombre": "Charity padel tournament",
  "proyectos.padel.fecha": "December 2025",
  "proyectos.padel.texto": "Second charity tournament with Almas Inquietas, again in support of Ideorama.",
  "proyectos.padel.patrocinadores": "Backed by sponsors including MG Albian Motor, Padel Bularas, Blas Méndez Ponce, Minigymrats, Cañas y Tapas, Día and Herbalife.",
  "proyectos.padel.enlace": "About Ideorama",
  "proyectos.rtw.nombre": "Ride the Wave",
  "proyectos.rtw.fecha": "2026",
  "proyectos.rtw.texto": "A charity challenge by Almas Inquietas: co-founder Alejandro de Santiago cycles from Prague to Madrid across nine countries while a community adds kilometres via Strava. Under the motto 'one kilometre, one euro', the goal is to raise €4,000 for Fundación Verón's school-meals program, which funds education and job training for young people in Honduras: €4,000 covers school meals for an entire class for a full year.",
  "proyectos.rtw.contribucion": "I collaborate on the project, which runs on digital tools and artificial intelligence: real-time mileage tracking integrated with Strava, a live route site with map and stages, a community counter and a crowdfunding campaign.",
  "proyectos.rtw.enlace.ruta": "Follow the live route",
  "proyectos.rtw.enlace.contador": "Community counter",
```

- [ ] **Step 4: Verificar la paridad i18n.**

Run: `node tools/comprobar-i18n.mjs`
Expected: `OK: 126 claves con paridad completa.` (105 previas + 21 nuevas). Si informa de claves huérfanas, revisar que cada `data-i18n` del Step 2 tenga su clave en el Step 3 y viceversa.

- [ ] **Step 5: Commit.**

```bash
git add index.html content/en.json
git commit -m "Añadir sección Proyectos solidarios (contenido ES/EN)"
```

---

### Task 2: Estilos de la sección y regla de impresión

**Files:**
- Modify: `assets/css/styles.css` (nuevo bloque de estilos; regla dentro de `@media print`, línea 757)
- Test: navegador (Playwright) + emulación de impresión

**Interfaces:**
- Consumes: clases del Task 1 (`.proyectos__enlaces`, `.proyecto`, `.proyecto__resumen`, `.proyecto__nombre`, `.proyecto__fecha`, `.proyecto__detalle`, `.proyecto__meta`, `.proyecto__enlace`).

- [ ] **Step 1: Añadir los estilos.** Al final de la sección temática de secciones en `assets/css/styles.css` (antes del bloque `@media print`), añadir:

```css
/* ==========================================================================
   Proyectos solidarios
   ========================================================================== */

.proyectos__enlaces {
  display: flex;
  flex-wrap: wrap;
  gap: var(--espacio-3) var(--espacio-5);
  margin-top: var(--espacio-4);
}

.proyecto {
  border-top: 1px solid var(--color-borde);
  padding-block: var(--espacio-4);
}

.proyecto:last-of-type {
  border-bottom: 1px solid var(--color-borde);
}

.proyecto__resumen {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: var(--espacio-2) var(--espacio-4);
  cursor: pointer;
  list-style: none;
}

.proyecto__resumen::-webkit-details-marker {
  display: none;
}

.proyecto__resumen::after {
  content: "+";
  margin-inline-start: auto;
  color: var(--color-acento);
  font-weight: 600;
}

.proyecto[open] > .proyecto__resumen::after {
  content: "–";
}

.proyecto__nombre {
  font-weight: 600;
}

.proyecto__fecha {
  color: var(--color-texto-suave);
}

.proyecto__detalle {
  margin-top: var(--espacio-3);
}

.proyecto__detalle > p + p {
  margin-top: var(--espacio-3);
}

.proyecto__meta {
  color: var(--color-texto-suave);
}

.proyecto__enlace {
  display: flex;
  flex-wrap: wrap;
  gap: var(--espacio-3) var(--espacio-5);
}
```

- [ ] **Step 2: Forzar desplegables abiertos en impresión.** Dentro del bloque `@media print { ... }` (línea 757), añadir:

```css
  /* Los desplegables de Proyectos se imprimen abiertos para que el PDF
     exportado muestre todo el contenido. */
  .proyecto > .proyecto__detalle {
    display: block !important;
  }
  .proyecto__resumen::after {
    content: "" !important;
  }
```

- [ ] **Step 3: Comprobar en el navegador (local).** Servir el sitio y abrirlo con Playwright:

```bash
node tools/servir.mjs &
```
Navegar a `http://localhost:8080/` (o el puerto que imprima el servidor), hacer snapshot y verificar: la sección «Proyectos solidarios» aparece tras Trayectoria; los tres `summary` se ven; al hacer clic en uno, se despliega su detalle. Detener el servidor al terminar.
Expected: sección visible, desplegables funcionales, sin errores de consola.

- [ ] **Step 4: Comprobar la impresión.** Con Playwright, emular medios de impresión y comprobar que `.proyecto__detalle` es visible aun con el `<details>` cerrado:

```js
() => { const d = document.querySelector('.proyecto__detalle'); return getComputedStyle(d).display; }
```
Expected (con emulación `print`): `block`. Si fuese `none`, el `!important` del Step 2 no está bastando; añadir además `.proyecto:not([open]) > .proyecto__detalle { display: block !important; }` en el `@media print`.

- [ ] **Step 5: Commit.**

```bash
git add assets/css/styles.css
git commit -m "Estilar la sección Proyectos solidarios y abrir desplegables en impresión"
```

---

### Task 3: Publicar y verificar en producción

**Files:**
- Ninguno nuevo (push de lo commiteado)
- Test: `curl` + Playwright contra `https://pablopo99.github.io/`

**Interfaces:**
- Consumes: Tasks 1 y 2 commiteados.

- [ ] **Step 1: Push.**

```bash
git push origin master
```

- [ ] **Step 2: Esperar el build de Pages.** Sondear hasta `built`:

```bash
gh api repos/Pablopo99/pablopo99.github.io/pages/builds/latest --jq '.commit[0:7]+" "+.status'
```
Expected: `status` = `built` con el commit esperado (la API puede ir con retraso; el contenido servido es la fuente de verdad).

- [ ] **Step 3: Verificar el contenido servido (ES y EN).**

```bash
curl -sS "https://pablopo99.github.io/?cb=$RANDOM" | grep -o "Proyectos solidarios\|Ride the Wave\|Torneo de pádel solidario"
curl -sS "https://pablopo99.github.io/content/en.json?cb=$RANDOM" | grep -o "Social-impact projects\|Charity padel tournament\|Follow the live route"
```
Expected: aparecen las cadenas ES en el HTML y las EN en el JSON.

- [ ] **Step 4: Verificar funcional con Playwright.** Navegar a `https://pablopo99.github.io/`, snapshot, comprobar: nuevo ítem «Proyectos» en el menú; sección presente; desplegar los tres proyectos; conmutar a inglés (botón EN) y confirmar que título, intro y proyectos se traducen; consola sin errores.
Expected: todo correcto en ES y EN, sin errores de consola.

- [ ] **Step 5: Verificar i18n una última vez.**

Run: `node tools/comprobar-i18n.mjs`
Expected: `OK: 126 claves con paridad completa.`

---

## Notas de futuro (fuera de alcance de este plan)

- **Crowdfunding:** cuando Pablo dé la URL, añadir un enlace `proyectos.rtw.enlace.crowdfunding` al proyecto 3 (mismo patrón que los otros enlaces).
- **Logos y fotos** de torneos/patrocinadores: si Pablo los aporta, se añadirían optimizados; en esta versión los patrocinadores van en texto.
