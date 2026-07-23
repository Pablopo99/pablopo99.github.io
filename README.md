# CV virtual de Pablo Cansinos

Web de una sola página, bilingüe español/inglés, sin frameworks ni compilación.
Son archivos estáticos: se sirven tal cual, sin `npm install` ni paso de build.

## Cómo verlo en local

`fetch` de las traducciones no funciona con el protocolo `file://`, así que hace
falta un servidor. El proyecto trae uno mínimo en Node (sin dependencias):

```bash
node tools/servir.mjs
```

Abre <http://localhost:4321>. Para pararlo, Ctrl+C.

## Cómo cambiar un texto

El español vive escrito en `index.html`. El inglés vive en `content/en.json`,
indexado por la clave `data-i18n` de cada elemento.

- **Cambiar un texto en español:** edita el elemento correspondiente en
  `index.html`.
- **Cambiar el mismo texto en inglés:** edita su clave en `content/en.json`.
- **Añadir un texto nuevo:** ponle un `data-i18n="seccion.elemento"` único en
  `index.html` (en minúsculas, sin tildes ni eñes) y añade esa misma clave a
  `content/en.json`.

**Obligatorio tras cualquier cambio de texto**, comprobar que el español y el
inglés siguen teniendo exactamente las mismas claves:

```bash
node tools/comprobar-i18n.mjs
```

Debe decir `OK: N claves con paridad completa.`. Si falla, lista qué clave falta,
sobra o está vacía. No publiques con este comprobador en rojo.

## Cómo sustituir la fotografía

La página sirve `assets/img/pablo.jpg` (recorte 4:5, optimizado). Para cambiarla,
sustituye ese archivo por el nuevo retrato con el mismo nombre y proporción, y
mantenlo ligero (el sitio entero sin los PDF debe quedar por debajo de 150 KB).
El `width`/`height` del `<img>` en `index.html` debe seguir cuadrando con la
proporción de la imagen para no provocar saltos de maquetación.

## Cómo sustituir los CV en PDF

Los botones de descarga apuntan a `cv/Pablo_Cansinos_CV_ES.pdf` y
`cv/Pablo_Cansinos_CV_EN.pdf`. Reemplaza esos dos archivos conservando los
nombres.

## Imprimir o exportar a PDF

Desde el navegador, «Imprimir» → «Guardar como PDF». La hoja de impresión oculta
la navegación y los conmutadores, fuerza el tema claro y evita cortar bloques a
la mitad. Salen unas tres páginas.

## Estructura

```
index.html              Página completa. Contenido en español.
404.html                Página de error, misma hoja de estilos.
content/en.json         Traducciones al inglés, una por clave data-i18n.
assets/css/styles.css   Sistema de diseño, temas claro/oscuro e impresión.
assets/js/app.js        Idioma, tema, correo protegido y revelado al hacer scroll.
assets/fonts/           Tipografías servidas desde el propio proyecto.
assets/img/             Foto, favicon e imagen para compartir (Open Graph).
cv/                     Los dos CV en PDF descargables.
tools/servir.mjs        Servidor de desarrollo local.
tools/comprobar-i18n.mjs  Verifica la paridad de claves español/inglés.
docs/                   Especificación, plan y capturas de verificación.
```

Sin dependencias de CDN ni tipografías de terceros: fuentes y estilos se sirven
desde el propio repositorio. La única petición a un tercero en tiempo de ejecución
es la analítica anónima **GoatCounter** (`gc.zgo.at` → `pablo-cansinos.goatcounter.com`),
sin cookies ni datos personales; el fragmento está al final de `index.html` y el
panel privado es `https://pablo-cansinos.goatcounter.com`. El correo se ensambla en
JavaScript y no aparece completo en el HTML servido.

## Estado de publicación

**Publicado el 23 de julio de 2026** en `https://pablopo99.github.io/`. El
repositorio `Pablopo99/pablopo99.github.io` es **público** (GitHub Pages no sirve
desde repositorios privados en el plan gratuito, y se optó por público al ser un CV
sin datos sensibles). GitHub Pages sirve la rama `master` desde la raíz.

Salvedades vivas (no impiden que el sitio esté en línea, pero conviene resolverlas):

1. **Los CV en PDF de `cv/` no incluyen AiKit.** Son los CV de 2026 anteriores a
   la incorporación; Pablo los está actualizando. Hay que sustituirlos (mismos
   nombres de archivo) y hacer push.
2. **La fotografía es provisional.** `assets/img/pablo.jpg` está recortada del
   retrato disponible; pendiente de la definitiva que dé Pablo.

Los datos que en su día estuvieron pendientes (estudiantes de ESIC, indicador de
Payflow, ubicación de AiKit, hueco de agosto de 2025 a febrero de 2026, fechas de
las titulaciones) quedaron confirmados por Pablo el 22 de julio de 2026 y ya están
en la web. El detalle está en la sección 6 de
`docs/superpowers/specs/2026-07-21-cv-virtual-design.md`.

## Actualizar el sitio publicado

No hay paso de compilación: GitHub Pages sirve la raíz del repositorio tal cual.
Para publicar cualquier cambio basta con `git push origin master`; Pages reconstruye
solo en uno o dos minutos. Para reemplazar los PDF, sobrescribe los archivos de
`cv/` conservando sus nombres y haz push. El correo protegido, las traducciones y la
hoja de impresión funcionan igual servidos desde Pages que en local.
