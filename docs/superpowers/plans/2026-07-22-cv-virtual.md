# CV virtual de Pablo Cansinos — Plan de implementación

> **Para agentes:** SUB-SKILL OBLIGATORIA: usa `superpowers:subagent-driven-development` (recomendada) o `superpowers:executing-plans` para implementar este plan tarea a tarea. Los pasos usan casillas (`- [ ]`) para el seguimiento.

**Objetivo:** construir una web de CV de una sola página, bilingüe español/inglés, sin frameworks ni compilación, que se publique como archivos estáticos.

**Arquitectura:** el contenido en español vive escrito en `index.html` para que se indexe y funcione sin JavaScript. El inglés vive en `content/en.json` y se aplica sustituyendo el texto de los elementos marcados con `data-i18n`. Un único archivo `app.js` gobierna idioma, tema, ofuscación del correo y revelado al hacer scroll. Todo el diseño se expresa como variables CSS, de modo que el tema oscuro es una capa fina y no una duplicación.

**Stack:** HTML5, CSS moderno (custom properties, grid, `color-mix`), JavaScript ES2022 sin dependencias. Node 26 solo para el servidor local de desarrollo y el script de verificación. Sin `package.json`, sin `npm install`, sin build.

**Especificación de referencia:** `docs/superpowers/specs/2026-07-21-cv-virtual-design.md`

## Restricciones globales

Estas reglas aplican a todas las tareas.

- **Cero peticiones externas en tiempo de ejecución.** Ninguna etiqueta `<script src>`, `<link href>`, `@import`, `fetch` ni `url()` puede apuntar a un dominio ajeno. Tipografías, imágenes y estilos se sirven desde el propio proyecto.
- **Sin dependencias de terceros.** No se crea `package.json` ni se instala ningún paquete npm.
- **Veracidad estricta.** No se escribe ninguna cifra, fecha, cargo, certificación ni afirmación que no figure en la sección 6 de la especificación. Los datos de la sección 7 no se publican: donde falte una cifra, la frase se redacta sin ella.
- **Prohibido presentar a Pablo** como desarrollador, ingeniero de IA, arquitecto de soluciones ni consultor senior. AiKit es diagnóstico y advisory, nunca implementación end-to-end.
- **Prohibidas las frases vetadas** de la sección 15 del documento de traspaso: «busco mi primer paso en consultoría», «aunque no vengo de consultoría», «candidato ideal», «empresa líder», «me apasiona la innovación», «aportar valor desde el primer día».
- **Sin barras de habilidad con porcentajes**, sin logotipos de empresas, sin testimonios, sin analítica, sin cookies, sin formularios.
- **Datos personales prohibidos:** teléfono, dirección postal, código postal, fecha de nacimiento, nacionalidad, DNI. El DNI aparece en `Transformación Digital.pdf`; no debe salir de ahí.
- **Idioma del código:** clases CSS, claves de i18n, nombres de archivo y mensajes de commit en español, sin tildes ni eñes en los identificadores (`data-i18n="perfil.titulo"`, no `data-i18n="perfíl.título"`).
- **Accesibilidad como suelo, no como extra:** contraste AA en ambos temas, foco visible siempre, HTML semántico, `prefers-reduced-motion` respetado.
- **Cada tarea termina con un commit** cuyo mensaje describe el entregable.

---

### Tarea 1: Andamiaje y servidor local

**Archivos:**
- Crear: `index.html`
- Crear: `assets/css/styles.css`
- Crear: `assets/js/app.js`
- Crear: `tools/servir.mjs`

**Interfaces:**
- Consume: nada.
- Produce: `index.html` con un `<main>` vacío y los enlaces a `styles.css` y `app.js` ya establecidos; `node tools/servir.mjs` sirve el directorio en `http://localhost:4321`.

- [ ] **Paso 1: crear el servidor de desarrollo**

Se necesita un servidor real (no `file://`) porque `fetch` de `content/en.json` está bloqueado en el protocolo de archivo.

`tools/servir.mjs`:

```js
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

const RAIZ = new URL('..', import.meta.url).pathname;
const PUERTO = 4321;
const TIPOS = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.pdf': 'application/pdf',
  '.ico': 'image/x-icon',
};

createServer(async (peticion, respuesta) => {
  const ruta = decodeURIComponent(new URL(peticion.url, 'http://localhost').pathname);
  const relativa = normalize(ruta === '/' ? '/index.html' : ruta).replace(/^(\.\.[/\\])+/, '');
  try {
    const contenido = await readFile(join(RAIZ, relativa));
    respuesta.writeHead(200, { 'Content-Type': TIPOS[extname(relativa)] ?? 'application/octet-stream' });
    respuesta.end(contenido);
  } catch {
    const noEncontrado = await readFile(join(RAIZ, '404.html')).catch(() => '404');
    respuesta.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    respuesta.end(noEncontrado);
  }
}).listen(PUERTO, () => console.log(`Sirviendo en http://localhost:${PUERTO}`));
```

- [ ] **Paso 2: crear el esqueleto de `index.html`**

```html
<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Pablo Cansinos — Consultoría, Estrategia y Gestión de Proyectos</title>
  <link rel="stylesheet" href="assets/css/styles.css">
</head>
<body>
  <main id="contenido"></main>
  <script src="assets/js/app.js" type="module"></script>
</body>
</html>
```

Crear `assets/css/styles.css` y `assets/js/app.js` vacíos (un comentario en cada uno).

- [ ] **Paso 3: verificar que el servidor responde**

Ejecutar: `node tools/servir.mjs &` seguido de `curl -s -o /dev/null -w "%{http_code}" http://localhost:4321/`
Esperado: `200`

Y comprobar el 404: `curl -s -o /dev/null -w "%{http_code}" http://localhost:4321/noexiste`
Esperado: `404`

- [ ] **Paso 4: commit**

```bash
git add index.html assets tools
git commit -m "Añadir andamiaje del sitio y servidor de desarrollo"
```

---

### Tarea 2: Dirección visual y sistema de tokens

**Archivos:**
- Modificar: `assets/css/styles.css`
- Crear: `assets/fonts/` (archivos `.woff2`)

**Interfaces:**
- Consume: el esqueleto de la Tarea 1.
- Produce: variables CSS con nombres estables que todas las tareas posteriores usan: `--color-fondo`, `--color-texto`, `--color-texto-suave`, `--color-acento`, `--color-borde`, `--color-superficie`, `--fuente-titulo`, `--fuente-cuerpo`, `--escala-1` … `--escala-6`, `--espacio-1` … `--espacio-8`, `--ancho-maximo`.

- [ ] **Paso 1: invocar la skill `frontend-design`**

Antes de escribir una sola línea de CSS, invocar `frontend-design` y producir su plan de diseño: paleta de 4 a 6 valores hex con nombre, dos o tres tipografías con su papel, concepto de maquetación y el elemento distintivo de la página.

Restricciones del brief que la skill debe respetar, tomadas de la especificación: azul profundo sobre blanco, mucho espacio en blanco, jerarquía tipográfica clara, animación mínima, sin degradados ni exceso de iconos. El público es un recruiter de consultoría que dedicará menos de un minuto. La página debe leerse como creíble y sobria, nunca como landing de startup ni como portfolio de desarrollador.

- [ ] **Paso 2: descargar las tipografías**

Elegir dos familias de licencia abierta acordes al plan de diseño y descargar sus `.woff2` a `assets/fonts/`. Fuente sugerida, sustituyendo `<ruta>` por la del archivo concreto:

```bash
curl -fsSL -o "assets/fonts/<nombre>.woff2" "https://raw.githubusercontent.com/google/fonts/main/<ruta>.woff2"
```

Verificar que se ha descargado un archivo real y no una página de error:

```bash
file assets/fonts/*.woff2
```
Esperado: cada archivo se identifica como `Web Open Font Format (Version 2)`.

**Si la descarga falla o el formato no es correcto:** borrar los archivos y usar pilas de tipografías del sistema en su lugar (por ejemplo `ui-serif, Georgia, serif` para titulares y `system-ui, -apple-system, "Segoe UI", sans-serif` para el cuerpo). No dejar `@font-face` apuntando a archivos inexistentes.

- [ ] **Paso 3: escribir los tokens y el tema oscuro**

En `assets/css/styles.css`, definir los tokens en `:root` con los valores del plan de diseño, y redefinir únicamente los de color en el bloque oscuro:

```css
:root {
  color-scheme: light;
  /* Los valores hex concretos salen del plan de la Tarea 2, Paso 1 */
}

:root[data-tema="oscuro"] {
  color-scheme: dark;
  /* Solo se redefinen los tokens de color, nunca los de espaciado o tipografía */
}

@media (prefers-color-scheme: dark) {
  :root:not([data-tema="claro"]) {
    color-scheme: dark;
    /* Mismos valores que el bloque anterior */
  }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

Añadir también el reinicio base: `box-sizing: border-box`, tipografía del cuerpo, `line-height` cómodo, imágenes con `max-width: 100%`, y un `:focus-visible` con contorno bien visible en ambos temas.

- [ ] **Paso 4: verificar el contraste**

Comprobar con la calculadora de contraste que cada pareja texto/fondo definida en los tokens alcanza al menos 4.5:1 para texto normal y 3:1 para texto grande, en tema claro y en tema oscuro. Corregir los valores hex que no lleguen.

- [ ] **Paso 5: commit**

```bash
git add assets/css/styles.css assets/fonts
git commit -m "Definir sistema de diseño, tipografías y tema oscuro"
```

---

### Tarea 3: Contenido en español

**Archivos:**
- Modificar: `index.html`
- Modificar: `assets/css/styles.css`

**Interfaces:**
- Consume: los tokens CSS de la Tarea 2.
- Produce: el HTML completo en español, con un atributo `data-i18n` de clave única en cada elemento que contenga texto traducible. Estas claves son el contrato que consume la Tarea 4.

- [ ] **Paso 1: escribir la estructura semántica**

Secciones, en este orden, cada una con `<section>`, `aria-labelledby` y un encabezado real:

1. `#inicio` — nombre, título principal, frase de propuesta de valor, fotografía, botón de contacto y botón de descarga de CV.
2. `#perfil` — tres o cuatro líneas.
3. `#areas` — cuatro bloques: consultoría y estrategia; procesos y operaciones; proyectos y stakeholders; datos y negocio.
4. `#trayectoria` — AiKit, Expedia, ESIC y Orange en formato extenso; Payflow, Grupo Gmp y N2Growth en formato compacto.
5. `#formacion` — ESIC y las certificaciones, con enlace de verificación donde exista.
6. `#idiomas` — idiomas y experiencia internacional.
7. `#contacto` — correo, LinkedIn, Madrid.

Añadir una navegación con enlaces ancla y un enlace «Saltar al contenido» como primer elemento enfocable del documento.

- [ ] **Paso 2: escribir el contenido con los datos verificados**

Todo el contenido sale de la sección 6 de la especificación. Los cargos y fechas exactos son:

| Empresa | Cargo | Fechas |
|---|---|---|
| AiKit | Strategy Consultant & AI | mar. 2026 – actualidad |
| Expedia Group | Partner Success Associate — Business Performance & Partner Advisory | mar. 2025 – ago. 2025, Praga |
| ESIC University | International Project Manager | mar. 2023 – mar. 2025, Madrid |
| Orange | Sales Management Trainee | nov. 2022 – abr. 2023, Madrid |
| Grupo Gmp | Customer Experience Analyst Trainee | dic. 2021 – jun. 2022, Madrid |
| Payflow (YC S21) | Operations Analyst Intern | ene. 2021 – jun. 2021, Madrid |
| N2Growth | Executive Search Intern | oct. 2019 – mar. 2020, Madrid |

Cifras que sí pueden publicarse: 50+ sesiones de diagnóstico y 100+ informes revisados con una media de 8 recomendaciones por cliente en AiKit; 180+ hoteles en Expedia; 80+ movilidades de personal y 130.000 € en ayudas en ESIC; adopción de la aplicación del 18 % al 27 % en Payflow; 27 % de crecimiento de la base de usuarios en dos meses en Grupo Gmp.

Cifras confirmadas por Pablo el 22 de julio de 2026, que también se publican:

- ESIC: **+700 estudiantes al año** (queda descartado el 650+ que aparecía en documentos antiguos).
- Payflow: el **+170 %** es el aumento de contactos diarios por comercial, de 50 a 135 al día, medido como resultado real. Redactarlo explicando la magnitud, nunca como «+170 % de ventas» ni como capacidad potencial.

AiKit está **en Madrid**. El viaje por Asia de agosto de 2025 a febrero de 2026 no se menciona en la web: el hueco entre Expedia y AiKit se deja sin explicación explícita.

Certificaciones, con su nombre exacto: Management Consulting (Emory University, enero de 2026); AI Fundamentals for Non-Data Scientists (University of Pennsylvania, agosto de 2025); Scrum Foundation Professional Certificate SFPC (Certiprof, septiembre de 2025); Curso en transformación y modelo de negocios digitales (Aicad Business School, enero de 2023); Principles of Data Analytics Professionals y Principles of Business Analytics (Microsoft, marzo de 2023); International Leadership and Organizational Behavior (Università Bocconi, septiembre de 2020); Excel Completo (Udemy, octubre de 2022); Cambridge C1 Advanced.

Enlaces de verificación en los cuatro que lo tienen: `https://coursera.org/verify/specialization/ACWOQKODWMR9`, `https://coursera.org/verify/3M8OGR61QBZB`, `https://coursera.org/verify/HG3Y6YHQ5YHZ` y el código `m7x6mT3I9j` de Aicad.

No incluir Google Analytics ni Data Studio como certificaciones: caducaron en 2024.

- [ ] **Paso 3: marcar cada texto traducible**

Cada elemento con texto visible traducible lleva `data-i18n` con una clave jerárquica y única, en minúsculas y sin tildes:

```html
<h2 data-i18n="perfil.titulo">Perfil</h2>
<p data-i18n="perfil.parrafo">…</p>
<h3 data-i18n="trayectoria.aikit.cargo">Strategy Consultant &amp; AI</h3>
```

Para atributos, usar `data-i18n-attr` indicando cuáles: `data-i18n-attr="aria-label"`.

No marcar lo que no se traduce: nombres propios de empresa, fechas numéricas ni el correo.

- [ ] **Paso 4: maquetar**

Escribir el CSS de las secciones usando exclusivamente los tokens de la Tarea 2. Móvil primero, ampliando con `min-width`. Vigilar la especificidad: no mezclar selectores de tipo y de clase que se anulen entre sí.

- [ ] **Paso 5: verificar sin JavaScript**

Ejecutar: `curl -s http://localhost:4321/ | grep -c "data-i18n"`
Esperado: un número mayor que 40, lo que confirma que el contenido está en el HTML servido y no inyectado por JavaScript.

Abrir la página con JavaScript desactivado y confirmar que todo el contenido en español es legible y navegable.

- [ ] **Paso 6: commit**

```bash
git add index.html assets/css/styles.css
git commit -m "Añadir el contenido completo en español"
```

---

### Tarea 4: Versión en inglés y verificación de paridad

**Archivos:**
- Crear: `content/en.json`
- Crear: `tools/comprobar-i18n.mjs`
- Modificar: `assets/js/app.js`

**Interfaces:**
- Consume: los atributos `data-i18n` de la Tarea 3.
- Produce: `window.cambiarIdioma(codigo)` donde `codigo` es `'es'` o `'en'`; `content/en.json` como objeto plano cuyas claves coinciden exactamente con los `data-i18n` del HTML.

- [ ] **Paso 1: escribir la comprobación que falla**

`tools/comprobar-i18n.mjs`:

```js
import { readFile } from 'node:fs/promises';

const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const traducciones = JSON.parse(await readFile(new URL('../content/en.json', import.meta.url), 'utf8'));

const clavesHtml = new Set([...html.matchAll(/data-i18n="([^"]+)"/g)].map((m) => m[1]));
const clavesJson = new Set(Object.keys(traducciones));

const sinTraducir = [...clavesHtml].filter((clave) => !clavesJson.has(clave));
const sobrantes = [...clavesJson].filter((clave) => !clavesHtml.has(clave));
const vacias = Object.entries(traducciones).filter(([, valor]) => !String(valor).trim());

for (const clave of sinTraducir) console.error(`FALTA en en.json: ${clave}`);
for (const clave of sobrantes) console.error(`SOBRA en en.json: ${clave}`);
for (const [clave] of vacias) console.error(`VACIA en en.json: ${clave}`);

if (sinTraducir.length || sobrantes.length || vacias.length) {
  console.error(`\n${sinTraducir.length + sobrantes.length + vacias.length} problemas de paridad.`);
  process.exit(1);
}
console.log(`OK: ${clavesHtml.size} claves con paridad completa.`);
```

- [ ] **Paso 2: ejecutarla para verificar que falla**

Crear `content/en.json` con el contenido `{}` y ejecutar: `node tools/comprobar-i18n.mjs`
Esperado: FALLA, listando todas las claves como `FALTA en en.json`, y termina con código de salida 1.

- [ ] **Paso 3: escribir las traducciones**

Rellenar `content/en.json` con una entrada por cada clave. El inglés no es una traducción literal: el título principal es «Consulting, Strategy & Project Management», y el registro es el del CV en inglés de 2026, más directo que el español. Mantener las mismas restricciones de veracidad.

- [ ] **Paso 4: ejecutarla para verificar que pasa**

Ejecutar: `node tools/comprobar-i18n.mjs`
Esperado: `OK: N claves con paridad completa.` y código de salida 0.

- [ ] **Paso 5: implementar el cambio de idioma**

En `assets/js/app.js`:

```js
const IDIOMA_POR_DEFECTO = 'es';
const textosEs = new Map();

function guardarTextosOriginales() {
  for (const nodo of document.querySelectorAll('[data-i18n]')) {
    textosEs.set(nodo.dataset.i18n, nodo.textContent);
  }
}

async function cargarTraducciones(codigo) {
  if (codigo === 'es') return null;
  const respuesta = await fetch(`content/${codigo}.json`);
  if (!respuesta.ok) throw new Error(`No se pudo cargar ${codigo}.json`);
  return respuesta.json();
}

export async function cambiarIdioma(codigo) {
  const traducciones = await cargarTraducciones(codigo);
  for (const nodo of document.querySelectorAll('[data-i18n]')) {
    const clave = nodo.dataset.i18n;
    const texto = traducciones ? traducciones[clave] : textosEs.get(clave);
    if (texto !== undefined) nodo.textContent = texto;
  }
  document.documentElement.lang = codigo;
  localStorage.setItem('idioma', codigo);
  for (const boton of document.querySelectorAll('[data-idioma]')) {
    boton.setAttribute('aria-pressed', String(boton.dataset.idioma === codigo));
  }
}

guardarTextosOriginales();
const idiomaGuardado = localStorage.getItem('idioma') ?? IDIOMA_POR_DEFECTO;
if (idiomaGuardado !== IDIOMA_POR_DEFECTO) cambiarIdioma(idiomaGuardado);
for (const boton of document.querySelectorAll('[data-idioma]')) {
  boton.addEventListener('click', () => cambiarIdioma(boton.dataset.idioma));
}
window.cambiarIdioma = cambiarIdioma;
```

Añadir en el HTML los dos botones del conmutador, con `data-idioma="es"` y `data-idioma="en"`, dentro de un grupo con `aria-label`.

- [ ] **Paso 6: verificar en el navegador**

Abrir `http://localhost:4321/`, pulsar EN y comprobar que cambia toda la página y que `<html lang>` pasa a `en`. Recargar y comprobar que sigue en inglés. Volver a ES y comprobar que recupera el español sin recargar.

- [ ] **Paso 7: commit**

```bash
git add content tools/comprobar-i18n.mjs assets/js/app.js index.html
git commit -m "Añadir versión en inglés y comprobación de paridad de claves"
```

---

### Tarea 5: Tema, correo protegido y revelado al hacer scroll

**Archivos:**
- Modificar: `assets/js/app.js`
- Modificar: `index.html`

**Interfaces:**
- Consume: los tokens de tema de la Tarea 2 y el conmutador de idioma de la Tarea 4.
- Produce: el atributo `data-tema` en `<html>` con valor `claro` u `oscuro`; el enlace de correo con `href` real solo después de la interacción.

- [ ] **Paso 1: implementar el conmutador de tema**

```js
const temaGuardado = localStorage.getItem('tema');
if (temaGuardado) document.documentElement.dataset.tema = temaGuardado;

document.querySelector('[data-conmutar-tema]')?.addEventListener('click', () => {
  const oscuroActivo = document.documentElement.dataset.tema === 'oscuro'
    || (!document.documentElement.dataset.tema
        && matchMedia('(prefers-color-scheme: dark)').matches);
  const nuevo = oscuroActivo ? 'claro' : 'oscuro';
  document.documentElement.dataset.tema = nuevo;
  localStorage.setItem('tema', nuevo);
});
```

- [ ] **Paso 2: proteger el correo**

En el HTML, el enlace no contiene la dirección:

```html
<a class="contacto__correo" data-correo="cansinospablo|gmail.com" href="#contacto">
  Escríbeme
</a>
```

En `app.js`:

```js
for (const enlace of document.querySelectorAll('[data-correo]')) {
  const [usuario, dominio] = enlace.dataset.correo.split('|');
  enlace.href = `mailto:${usuario}@${dominio}`;
  enlace.textContent = `${usuario}@${dominio}`;
}
```

- [ ] **Paso 3: implementar el revelado al hacer scroll**

```js
const prefiereMenosMovimiento = matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!prefiereMenosMovimiento && 'IntersectionObserver' in window) {
  const observador = new IntersectionObserver((entradas) => {
    for (const entrada of entradas) {
      if (entrada.isIntersecting) {
        entrada.target.classList.add('es-visible');
        observador.unobserve(entrada.target);
      }
    }
  }, { rootMargin: '0px 0px -10% 0px' });
  for (const seccion of document.querySelectorAll('[data-revelar]')) observador.observe(seccion);
} else {
  for (const seccion of document.querySelectorAll('[data-revelar]')) seccion.classList.add('es-visible');
}
```

En CSS, `[data-revelar]` parte con opacidad reducida y un desplazamiento mínimo, y `.es-visible` lo restaura con una transición. Sin JavaScript, el contenido debe verse igualmente: aplicar el estado inicial solo cuando `<html>` tenga la clase `js`, que `app.js` añade al arrancar.

- [ ] **Paso 4: verificar**

Comprobar los tres comportamientos: el tema cambia y persiste tras recargar; el correo no aparece en `curl -s http://localhost:4321/ | grep -i "cansinospablo@"` (esperado: sin coincidencias) pero el enlace funciona en el navegador; con movimiento reducido activado en el sistema, todo se ve sin animación.

- [ ] **Paso 5: commit**

```bash
git add assets/js/app.js assets/css/styles.css index.html
git commit -m "Añadir conmutador de tema, correo protegido y revelado al hacer scroll"
```

---

### Tarea 6: Imágenes, metadatos y página 404

**Archivos:**
- Crear: `404.html`
- Crear: `assets/img/pablo.webp`, `assets/img/pablo.jpg`, `assets/img/og.png`, `assets/img/favicon.svg`
- Modificar: `index.html`
- Modificar: `cv/` con los dos PDF

**Interfaces:**
- Consume: la maquetación de la Tarea 3.
- Produce: metadatos completos en el `<head>` y los archivos de imagen referenciados.

- [ ] **Paso 1: preparar la fotografía**

Partiendo de `assets/img/pablo-original.png` (595×842, ya generada desde `Foto.pdf`), recortar a un encuadre cuadrado o 4:5 centrado en la cara y exportar a dos formatos:

```bash
sips -c 700 560 assets/img/pablo-original.png --out assets/img/pablo.jpg
sips -s format jpeg -s formatOptions 82 assets/img/pablo.jpg --out assets/img/pablo.jpg
```

Ajustar los valores de `-c` (alto y ancho) hasta que el encuadre sea correcto, comprobándolo visualmente. Servir con `<img loading="lazy" decoding="async" width height alt="Retrato de Pablo Cansinos">`, con `width` y `height` explícitos para evitar saltos de maquetación.

Si tras reiniciar está disponible la skill `pdf`, extraer antes la imagen incrustada de `Foto.pdf` a su resolución original y usar esa como origen: dará mejor calidad que los 595×842 rasterizados.

- [ ] **Paso 2: escribir los metadatos**

```html
<meta name="description" content="Pablo Cansinos, consultor de estrategia y gestión de proyectos en Madrid. Diagnóstico de negocio, adopción de IA, análisis y proyectos internacionales.">
<link rel="canonical" href="https://EJEMPLO.com/">
<link rel="alternate" hreflang="es" href="https://EJEMPLO.com/">
<link rel="alternate" hreflang="en" href="https://EJEMPLO.com/?lang=en">
<meta property="og:type" content="profile">
<meta property="og:title" content="Pablo Cansinos — Consultoría, Estrategia y Gestión de Proyectos">
<meta property="og:description" content="Consultor de estrategia en Madrid. Diagnóstico de negocio, adopción de IA y proyectos internacionales.">
<meta property="og:image" content="https://EJEMPLO.com/assets/img/og.png">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="assets/img/favicon.svg" type="image/svg+xml">
```

Sustituir `EJEMPLO.com` por el dominio real cuando se decida. Hasta entonces, dejar el marcador y anotarlo en el README para no publicar con él.

Añadir el JSON-LD:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Pablo Cansinos",
  "jobTitle": "Strategy Consultant & AI",
  "address": { "@type": "PostalAddress", "addressLocality": "Madrid", "addressCountry": "ES" },
  "sameAs": ["https://www.linkedin.com/in/pablo-cansinos-17b56214a"],
  "alumniOf": { "@type": "CollegeOrUniversity", "name": "ESIC Business & Marketing School" }
}
</script>
```

- [ ] **Paso 3: crear la imagen de Open Graph y el favicon**

`og.png` de 1200×630, generada a partir de la propia página: nombre, título y fondo del tema claro. El favicon, un SVG con las iniciales sobre el color de acento.

- [ ] **Paso 4: copiar los CV en PDF**

```bash
mkdir -p cv
cp "../Antiguo/Pablo_Cansinos_CV_ES_2026.pdf" cv/Pablo_Cansinos_CV_ES.pdf
cp "../Antiguo/Pablo_Cansinos_CV_EN_2026.pdf" cv/Pablo_Cansinos_CV_EN.pdf
```

Estos PDF **no incluyen AiKit todavía**. Anotarlo como bloqueante de publicación en el README.

- [ ] **Paso 5: crear `404.html`**

Página mínima con la misma hoja de estilos, un mensaje breve en español y un enlace de vuelta a la portada.

- [ ] **Paso 6: verificar**

Ejecutar: `curl -s http://localhost:4321/ | grep -c "og:"`
Esperado: al menos `4`.

Comprobar que ninguna referencia apunta fuera del proyecto:

```bash
grep -nE '(src|href)="https?://' index.html | grep -v linkedin.com | grep -v coursera.org | grep -v EJEMPLO.com
```
Esperado: sin resultados. Los únicos enlaces externos permitidos son los de LinkedIn y los de verificación de certificados, que son enlaces de navegación, no recursos cargados.

- [ ] **Paso 7: commit**

```bash
git add index.html 404.html assets/img cv
git commit -m "Añadir imágenes, metadatos, JSON-LD, CV descargables y página 404"
```

---

### Tarea 7: Hoja de estilos de impresión

**Archivos:**
- Modificar: `assets/css/styles.css`

**Interfaces:**
- Consume: la maquetación completa de las tareas 3 a 6.
- Produce: una salida de impresión de una sola página.

- [ ] **Paso 1: escribir el bloque de impresión**

```css
@media print {
  :root { color-scheme: light; }
  .navegacion, .conmutador-tema, .conmutador-idioma, .boton-descarga,
  [data-revelar] { animation: none; opacity: 1; transform: none; }
  .navegacion, .conmutador-tema, .conmutador-idioma { display: none; }
  body { font-size: 10pt; }
  section { break-inside: avoid; page-break-inside: avoid; }
  a[href^="http"]::after { content: " (" attr(href) ")"; font-size: 8pt; }
  @page { margin: 12mm; }
}
```

Ajustar tamaños y espaciados hasta que el resultado quepa en una página.

- [ ] **Paso 2: verificar**

Imprimir a PDF desde el navegador y comprobar: cabe en una página, no aparecen los controles de navegación, idioma ni tema, el texto es legible y ningún bloque queda cortado a la mitad.

- [ ] **Paso 3: commit**

```bash
git add assets/css/styles.css
git commit -m "Añadir hoja de estilos de impresión para exportar el CV a PDF"
```

---

### Tarea 8: Auditoría y verificación visual

**Archivos:**
- Modificar: los que la auditoría señale.
- Crear: `docs/capturas/` con las capturas de verificación.

**Interfaces:**
- Consume: el sitio completo.
- Produce: un sitio que pasa la auditoría y ocho capturas de verificación.

- [ ] **Paso 1: auditar con `web-design-guidelines`**

Invocar la skill sobre `index.html`, `assets/css/styles.css` y `assets/js/app.js`. Corregir todos los hallazgos de accesibilidad y semántica. Los hallazgos estéticos se valoran contra el plan de diseño de la Tarea 2: si contradicen una decisión deliberada, se documenta el motivo en lugar de aplicarlos.

- [ ] **Paso 2: verificar la paridad de idiomas otra vez**

Ejecutar: `node tools/comprobar-i18n.mjs`
Esperado: `OK` y código de salida 0. Si las tareas 5 a 7 añadieron texto, aquí se detecta.

- [ ] **Paso 3: capturar con Playwright**

Con el servidor en marcha, capturar las ocho combinaciones: español e inglés × tema claro y oscuro × 390×844 (móvil) y 1440×900 (escritorio). Guardarlas en `docs/capturas/`.

Revisar cada captura y corregir lo que se vea mal: desbordamientos, saltos de línea desafortunados, jerarquía poco clara, espaciados irregulares.

- [ ] **Paso 4: comprobar el desbordamiento horizontal**

En Playwright, a 390 px de ancho, evaluar:

```js
document.documentElement.scrollWidth <= document.documentElement.clientWidth
```
Esperado: `true`.

- [ ] **Paso 5: comprobar el peso total**

Ejecutar:

```bash
du -ch index.html 404.html assets content cv/../assets 2>/dev/null | tail -1
du -ch index.html 404.html assets/css assets/js assets/img assets/fonts content | tail -1
```
Esperado: por debajo de 150 KB sin contar los PDF del CV. Si se pasa, la causa
habitual es la fotografía: reducirla de calidad o de tamaño.

- [ ] **Paso 6: comprobar la navegación por teclado**

Recorrer la página con el tabulador desde el principio. Verificar que el primer elemento enfocable es «Saltar al contenido», que el foco es visible en todo momento en ambos temas, y que se puede llegar a los conmutadores de idioma y tema y activarlos con Intro o Espacio.

- [ ] **Paso 7: commit**

```bash
git add -A
git commit -m "Corregir hallazgos de la auditoría y añadir capturas de verificación"
```

---

### Tarea 9: Preparación para publicar

**Archivos:**
- Crear: `README.md`

**Interfaces:**
- Consume: el sitio terminado.
- Produce: instrucciones de actualización y la lista de bloqueantes.

- [ ] **Paso 1: escribir el README**

Debe explicar, para alguien que no ha visto el proyecto: cómo arrancar el servidor local, cómo cambiar un texto en español (editar `index.html`), cómo cambiar un texto en inglés (editar `content/en.json`), la obligación de ejecutar `node tools/comprobar-i18n.mjs` tras cualquier cambio de texto, y cómo sustituir la fotografía o los PDF.

- [ ] **Paso 2: listar los bloqueantes de publicación**

En el README, una sección con lo que todavía impide publicar. Los bloqueantes de datos de la sección 7 de la especificación quedaron resueltos el 22 de julio de 2026 y **no** deben listarse. Los que siguen abiertos son:

- Los CV en PDF de `cv/` no incluyen AiKit; Pablo los está actualizando.
- La fotografía es provisional hasta que Pablo dé la definitiva.
- El marcador `EJEMPLO.com` de los metadatos: el sitio se publicará gratis en GitHub Pages con una URL `*.github.io`, pendiente del nombre exacto de usuario y repositorio. No se compra dominio propio.

- [ ] **Paso 3: commit**

```bash
git add README.md
git commit -m "Añadir README con instrucciones de actualización y bloqueantes de publicación"
```

---

## Fuera de este plan

La elección de hosting y dominio, la compra del dominio y el despliegue quedan fuera: dependen de decisiones que Pablo aún no ha tomado. Cuando las tome, el despliegue de un sitio estático consiste en subir la carpeta, sin pasos de compilación.
