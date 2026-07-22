// Aplicacion del CV

// Marca que JavaScript esta activo. El revelado al hacer scroll (mas abajo)
// solo aplica su estado inicial oculto cuando esta clase esta presente en
// <html>, asi el contenido se ve completo si este script no llega a correr.
document.documentElement.classList.add('js');

// ---------------------------------------------------------------------------
// Idioma
// ---------------------------------------------------------------------------

const IDIOMA_POR_DEFECTO = 'es';
const textosEs = new Map();

// Idioma realmente aplicado en el DOM ahora mismo. Sirve para que, si un
// cambio de idioma falla a medio camino (por ejemplo el fetch de la
// traduccion), los botones sigan anunciando el idioma que de verdad se ve
// en pantalla y no el que se intento mostrar.
let idiomaActual = IDIOMA_POR_DEFECTO;

function leerIdiomaGuardado() {
  try {
    return localStorage.getItem('idioma');
  } catch (error) {
    console.warn('No se pudo leer el idioma guardado.', error);
    return null;
  }
}

function guardarIdioma(codigo) {
  try {
    localStorage.setItem('idioma', codigo);
  } catch (error) {
    console.warn('No se pudo guardar el idioma elegido.', error);
  }
}

function guardarTextosOriginales() {
  for (const nodo of document.querySelectorAll('[data-i18n]')) {
    const atributo = nodo.dataset.i18nAttr;
    textosEs.set(nodo.dataset.i18n, atributo ? nodo.getAttribute(atributo) : nodo.textContent);
  }
}

async function cargarTraducciones(codigo) {
  if (codigo === 'es') return null;
  const respuesta = await fetch(`content/${codigo}.json`);
  if (!respuesta.ok) throw new Error(`No se pudo cargar ${codigo}.json`);
  return respuesta.json();
}

function sincronizarBotones(codigo) {
  for (const boton of document.querySelectorAll('[data-idioma]')) {
    boton.setAttribute('aria-pressed', String(boton.dataset.idioma === codigo));
  }
}

export async function cambiarIdioma(codigo) {
  let traducciones;
  try {
    traducciones = await cargarTraducciones(codigo);
  } catch (error) {
    // El idioma que se ve en pantalla no ha cambiado: los botones y el
    // atributo lang deben seguir reflejando idiomaActual, no el codigo que
    // se intento cargar. Restaurar lang es imprescindible porque el script
    // en linea de index.html lo adelanta a "en" antes de saber si la
    // traduccion va a cargar; sin esto quedaria anunciando ingles sobre un
    // texto en espanol, que un lector de pantalla leeria mal.
    console.error(`No se pudo cambiar al idioma "${codigo}".`, error);
    document.documentElement.lang = idiomaActual;
    sincronizarBotones(idiomaActual);
    return;
  }

  for (const nodo of document.querySelectorAll('[data-i18n]')) {
    const clave = nodo.dataset.i18n;
    const texto = traducciones ? traducciones[clave] : textosEs.get(clave);
    if (texto === undefined) continue;
    const atributo = nodo.dataset.i18nAttr;
    if (atributo) {
      nodo.setAttribute(atributo, texto);
    } else {
      nodo.textContent = texto;
    }
  }

  document.documentElement.lang = codigo;
  idiomaActual = codigo;

  // El estado accesible se actualiza siempre, pase lo que pase con la
  // persistencia en localStorage (que puede fallar y no debe romper nada).
  sincronizarBotones(codigo);
  actualizarDescargaCv(codigo);
  guardarIdioma(codigo);
}

// El boton de descarga del inicio ofrece un unico CV: debe apuntar al del
// idioma que se esta viendo. La seccion de contacto ofrece los dos por
// separado y no lleva esta marca.
function actualizarDescargaCv(codigo) {
  const archivo = codigo === 'en'
    ? 'cv/Pablo_Cansinos_CV_EN.pdf'
    : 'cv/Pablo_Cansinos_CV_ES.pdf';
  for (const enlace of document.querySelectorAll('[data-cv-idioma]')) {
    enlace.href = archivo;
  }
}

// El idioma de la URL (?lang=en) tiene prioridad sobre el guardado: asi el
// enlace hreflang y los que se comparten en ingles aterrizan en ingles.
function leerIdiomaUrl() {
  try {
    const lang = new URLSearchParams(location.search).get('lang');
    return lang === 'es' || lang === 'en' ? lang : null;
  } catch (error) {
    return null;
  }
}

guardarTextosOriginales();

const idiomaInicial = leerIdiomaUrl() ?? leerIdiomaGuardado() ?? IDIOMA_POR_DEFECTO;
if (idiomaInicial !== IDIOMA_POR_DEFECTO) {
  cambiarIdioma(idiomaInicial).catch((error) => {
    console.error('No se pudo aplicar el idioma inicial.', error);
  });
}

for (const boton of document.querySelectorAll('[data-idioma]')) {
  boton.addEventListener('click', () => {
    cambiarIdioma(boton.dataset.idioma).catch((error) => {
      console.error('No se pudo cambiar de idioma.', error);
    });
  });
}

window.cambiarIdioma = cambiarIdioma;

// ---------------------------------------------------------------------------
// Tema
// ---------------------------------------------------------------------------

function leerTemaGuardado() {
  try {
    return localStorage.getItem('tema');
  } catch (error) {
    console.warn('No se pudo leer el tema guardado.', error);
    return null;
  }
}

function guardarTema(tema) {
  try {
    localStorage.setItem('tema', tema);
  } catch (error) {
    console.warn('No se pudo guardar el tema elegido.', error);
  }
}

// Oscuro esta activo si se eligio a mano, o si no se ha elegido nada y el
// sistema prefiere oscuro (mismo criterio que el CSS de la Tarea 2).
function oscuroActivo() {
  return document.documentElement.dataset.tema === 'oscuro'
    || (!document.documentElement.dataset.tema
        && matchMedia('(prefers-color-scheme: dark)').matches);
}

function sincronizarBotonTema() {
  document.querySelector('[data-conmutar-tema]')
    ?.setAttribute('aria-pressed', String(oscuroActivo()));
}

const temaGuardado = leerTemaGuardado();
if (temaGuardado) document.documentElement.dataset.tema = temaGuardado;
// El script en linea del <head> ya adelanto data-tema de forma sincrona para
// evitar el destello; esto reafirma el mismo valor y, sobre todo, deja el
// boton con el aria-pressed correcto ya en la carga inicial.
sincronizarBotonTema();

document.querySelector('[data-conmutar-tema]')?.addEventListener('click', () => {
  const nuevo = oscuroActivo() ? 'claro' : 'oscuro';
  document.documentElement.dataset.tema = nuevo;
  guardarTema(nuevo);
  sincronizarBotonTema();
});

// ---------------------------------------------------------------------------
// Correo protegido
// ---------------------------------------------------------------------------

// El enlace de contacto lleva data-i18n en un nodo hijo (el texto "Escribeme"
// / "Get in touch"), no en el propio <a>. Asi cambiarIdioma() puede reescribir
// ese hijo en cada cambio de idioma sin tocar el nodo de la direccion que
// anadimos aqui, que vive aparte y no lleva data-i18n.
function protegerCorreo() {
  for (const enlace of document.querySelectorAll('[data-correo]')) {
    const [usuario, dominio] = enlace.dataset.correo.split('|');
    const direccion = `${usuario}@${dominio}`;
    enlace.href = `mailto:${direccion}`;

    let nodoDireccion = enlace.querySelector('.contacto__correo-direccion');
    if (!nodoDireccion) {
      nodoDireccion = document.createElement('span');
      nodoDireccion.className = 'contacto__correo-direccion';
      enlace.append(document.createTextNode(' '), nodoDireccion);
    }
    nodoDireccion.textContent = direccion;
  }
}

protegerCorreo();

// ---------------------------------------------------------------------------
// Revelado al hacer scroll
// ---------------------------------------------------------------------------

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
