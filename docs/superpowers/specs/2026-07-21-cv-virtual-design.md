# CV virtual de Pablo Cansinos — Especificación de diseño

Fecha: 21 de julio de 2026
Estado: aprobado por el usuario, pendiente de plan de implementación

## 1. Objetivo

Una web profesional de una sola página, bilingüe (español e inglés), que complemente
—no sustituya— los CV en PDF y posicione a Pablo hacia consultoría, estrategia,
transformación digital, análisis de negocio, operaciones y proyectos.

Un recruiter debe entender en menos de un minuto qué hace Pablo hoy, qué problemas
sabe analizar, qué evidencia puede demostrar y cómo contactarle.

## 2. Principio rector: veracidad

No se inventa ninguna experiencia, métrica, certificación, cliente ni nivel técnico.
Todo dato publicado procede de una fuente verificada. Ante discrepancias entre
documentos, prevalece LinkedIn (la fuente más reciente) y, por encima de él, la
confirmación directa de Pablo.

Límites de posicionamiento que la web respeta:

- AiKit se presenta como diagnóstico, advisory y adopción de IA. Nunca como
  implementación end-to-end, arquitectura de soluciones ni desarrollo de software.
- Pablo no se presenta como desarrollador, ingeniero de IA ni consultor senior.
- Las herramientas usadas no se convierten en competencias técnicas avanzadas.
- Sin barras de habilidad con porcentajes, sin logos falsos, sin testimonios
  inventados, sin frases genéricas de portfolio.

## 3. Decisiones tomadas

| Decisión | Valor |
|---|---|
| Alcance | Una sola página, español e inglés |
| Título principal | ES: «Consultoría, Estrategia y Gestión de Proyectos» · EN: «Consulting, Strategy & Project Management» |
| Stack | HTML, CSS y JavaScript sin frameworks ni build |
| Experiencias | AiKit, Expedia, ESIC, Orange, Payflow, Grupo Gmp, N2Growth. Se excluyen EULEN y NATURVIE |
| Casos de estudio | Sin sección propia: integrados en cada experiencia |
| Sección «Resultados» | Descartada. Las cifras viven dentro de su experiencia, con contexto |
| Estética | Sobria de consultoría: azul profundo sobre blanco, tipografía seria |
| Modo oscuro | Sí, con conmutador |
| Contacto | Email protegido contra scraping + LinkedIn. Sin teléfono |
| Descargas | Botones de CV en PDF, español e inglés |
| Fotografía | Sí. Provisionalmente se extrae la del CV antiguo |
| Formulario de contacto | No. Enlace `mailto:` directo |
| Analítica | No, hasta decidir política de cookies |

## 4. Arquitectura técnica

### Estructura de archivos

```
CV Virtual/
├── index.html              Página completa. Contenido en español escrito en el HTML
├── 404.html
├── assets/
│   ├── css/styles.css      Variables CSS: paleta, tipografía, tema claro/oscuro, impresión
│   ├── js/app.js           Idioma, tema, email ofuscado, revelado al hacer scroll
│   └── img/                Foto, favicon, imagen Open Graph
├── content/
│   └── en.json             Traducciones al inglés, indexadas por clave
├── cv/
│   ├── Pablo_Cansinos_CV_ES.pdf
│   └── Pablo_Cansinos_CV_EN.pdf
└── docs/superpowers/specs/ Esta especificación
```

### Bilingüismo

El español vive escrito directamente en el HTML: garantiza indexación en Google,
una vista previa correcta al compartir el enlace en LinkedIn y funcionamiento sin
JavaScript. El inglés vive en `content/en.json` y se aplica sustituyendo el texto
de los elementos marcados con `data-i18n`.

- El conmutador ES/EN guarda la elección en `localStorage` y actualiza `<html lang>`.
- Cada cadena traducible lleva una clave `data-i18n` estable.
- Añadir un tercer idioma consiste en añadir un archivo JSON: no requiere tocar el HTML.

### Comportamiento del cliente

- **Tema**: claro por defecto; respeta `prefers-color-scheme` en la primera visita y
  recuerda la elección manual. Implementado con variables CSS, sin duplicar reglas.
- **Email**: se ensambla en JavaScript al activar el enlace. Nunca aparece completo
  en el HTML servido.
- **Movimiento**: revelado suave al hacer scroll mediante `IntersectionObserver`.
  Se desactiva por completo con `prefers-reduced-motion`.
- Sin dependencias externas: ninguna petición a CDN, fuentes ni terceros.

## 5. Estructura de contenido

1. **Hero** — nombre, título principal, una frase de propuesta de valor, fotografía y
   dos acciones: contactar y descargar CV.
2. **Perfil** — tres o cuatro líneas. Abre con lo que Pablo hace hoy en AiKit y cierra
   con hacia dónde se dirige.
3. **Áreas de especialización** — cuatro bloques: consultoría y estrategia; procesos y
   operaciones; proyectos y stakeholders; datos y negocio.
4. **Trayectoria**
   - Formato extenso (contexto → contribución → evidencia): AiKit, Expedia, ESIC, Orange.
   - Formato compacto (cargo, empresa, fechas, una o dos líneas): Payflow, Grupo Gmp, N2Growth.
5. **Formación y certificaciones** — ESIC más los certificados, con enlace de
   verificación en los que lo tienen.
6. **Idiomas y experiencia internacional** — español nativo, inglés C1 Cambridge,
   francés inicial; Colombia, Texas, Praga y las instituciones de cinco continentes.
7. **Contacto** — email protegido, LinkedIn, Madrid.

## 6. Datos verificados

Fechas y cargos confirmados con las capturas de LinkedIn de julio de 2026:

| Empresa | Cargo | Fechas |
|---|---|---|
| AiKit | Strategy Consultant & AI | mar. 2026 – actualidad |
| Expedia Group | Partner Success Associate \| Business Performance & Partner Advisory | mar. 2025 – ago. 2025, Praga, híbrido |
| ESIC University | International Project Manager | mar. 2023 – mar. 2025, Madrid |
| Orange | Sales Management Trainee | nov. 2022 – abr. 2023, Madrid, híbrido |
| Grupo Gmp | Customer Experience Analyst Trainee | dic. 2021 – jun. 2022 |
| Payflow (YC S21) | Operations Analyst Intern | ene. 2021 – jun. 2021, Madrid |
| N2Growth | Executive Search Intern | oct. 2019 – mar. 2020, Madrid |

Conflictos resueltos:

- ESIC empieza en **marzo** de 2023, no en abril.
- Payflow termina en **junio** de 2021, no en abril.
- Grupo Gmp termina en **junio** de 2022. Su métrica es **27 % de crecimiento de la
  base de usuarios en dos meses**; se descarta el 80 % del CV antiguo.
- El certificado de Wharton se titula **«AI Fundamentals for Non-Data Scientists»**,
  no «AI Fundamentals for Business» como figura en los CV actuales.
- La certificación Scrum pendiente es **Scrum Foundation Professional Certificate
  (SFPC™)**, Certiprof, 12/09/2025, credencial 109387780, válida hasta 12/09/2026.

Certificaciones con enlace público de verificación:

- Management Consulting, Emory University, 26/01/2026 — `coursera.org/verify/specialization/ACWOQKODWMR9`
- AI Fundamentals for Non-Data Scientists, University of Pennsylvania, 05/08/2025 — `coursera.org/verify/3M8OGR61QBZB`
- International Leadership and Organizational Behavior, Università Bocconi, 14/09/2020 — `coursera.org/verify/HG3Y6YHQ5YHZ`
- Curso en transformación y modelo de negocios digitales, Aicad Business School, 03/01/2023 — código de verificación `m7x6mT3I9j`

Los certificados de Google Analytics y Data Studio caducaron en enero y febrero de
2024, y no figuran en los CV de 2026. Se omiten de la web. Google Analytics y
Looker Studio siguen apareciendo como herramientas conocidas, sin atribuirles
certificación vigente.

## 7. Datos pendientes de confirmar

Ningún dato de esta lista se publica hasta que Pablo lo confirme. Si sigue sin
resolverse, la frase correspondiente se publica sin cifra.

1. **ESIC**: ¿650+ o 700+ estudiantes internacionales al año?
2. **Payflow**: qué indicador exacto mejoró un 170 %. El CV en inglés dice
   «user growth»; el traspaso lo deja ambiguo entre comunicación y adquisición.
3. **AiKit**: ubicación que debe publicarse.
4. **AiKit**: qué información puede mostrarse públicamente y si existe alguna
   cláusula de confidencialidad aplicable.
5. **Hueco de ago. 2025 a feb. 2026** (viaje por Asia): decisión aplazada. Se deja
   sin mencionar por ahora; hay que retomarlo antes de publicar.
6. **CV en PDF**: los actuales no incluyen AiKit. Deben actualizarse antes del
   lanzamiento.
7. **Fotografía**: se usa la del CV antiguo de forma provisional.

## 8. Dirección visual

Punto de partida, que se afinará con la skill `frontend-design` durante la
implementación:

- Azul profundo sobre blanco. Mucho espacio en blanco. Jerarquía tipográfica clara.
- Una tipografía con carácter en titulares y otra muy legible en el cuerpo, ambas
  servidas localmente.
- Animación mínima: revelado al hacer scroll y nada más.
- Sin degradados, sin exceso de iconos, sin efectos decorativos.
- Un único elemento distintivo que dé personalidad a la página, con todo lo demás
  en silencio a su alrededor.

## 9. Requisitos no funcionales

- **Responsive**: móvil, tableta y escritorio. El cuerpo nunca hace scroll horizontal.
- **Accesibilidad**: contraste AA en ambos temas, navegación completa por teclado con
  foco visible, HTML semántico, textos alternativos en imágenes.
- **SEO**: título, meta descripción, Open Graph, `hreflang` y JSON-LD de tipo `Person`,
  todo estático en el `<head>`.
- **Rendimiento**: sin dependencias externas; objetivo por debajo de 150 KB en total.
- **Impresión**: hoja de estilos que genera un CV de una página al imprimir a PDF,
  con la misma identidad visual que la web.
- **Privacidad**: sin analítica, sin cookies, sin formularios, sin datos personales
  innecesarios. Nada de teléfono, dirección, fecha de nacimiento, nacionalidad ni DNI.

## 10. Fuera de alcance

Descartado deliberadamente de esta versión: páginas individuales por caso de estudio,
blog o sección de artículos, gestor de contenidos, formulario con backend, analítica,
testimonios, línea temporal interactiva, FAQ y logotipos de empresas.

## 11. Criterios de aceptación

1. El sitio no requiere compilación ni instalación de dependencias: se publica
   subiendo la carpeta tal cual. La vista previa local se hace con el servidor
   incluido en `tools/servir.mjs`, necesario porque el navegador bloquea la lectura
   del archivo de traducciones bajo el protocolo `file://`.
2. Con JavaScript desactivado, todo el contenido en español sigue siendo legible.
3. El conmutador ES/EN traduce la página completa y recuerda la elección.
4. El conmutador de tema funciona en ambos sentidos y respeta la preferencia del sistema.
5. El email no aparece en el HTML servido, pero el enlace de contacto funciona.
6. No aparece ningún dato de la sección 7 sin haber sido confirmado.
7. Contraste AA verificado en tema claro y oscuro.
8. Verificación real con Playwright: capturas en móvil y escritorio, ambos idiomas
   y ambos temas.
9. Imprimir la página produce un PDF de una página bien maquetado.
