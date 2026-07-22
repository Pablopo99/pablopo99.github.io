// Aplicacion del CV

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
    // El idioma que se ve en pantalla no ha cambiado: los botones deben
    // seguir reflejando idiomaActual, no el codigo que se intento cargar.
    console.error(`No se pudo cambiar al idioma "${codigo}".`, error);
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
  guardarIdioma(codigo);
}

guardarTextosOriginales();

const idiomaGuardado = leerIdiomaGuardado() ?? IDIOMA_POR_DEFECTO;
if (idiomaGuardado !== IDIOMA_POR_DEFECTO) {
  cambiarIdioma(idiomaGuardado).catch((error) => {
    console.error('No se pudo aplicar el idioma guardado.', error);
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
// Tema, correo protegido y revelado al hacer scroll: pendiente (Tarea 5).
// ---------------------------------------------------------------------------
