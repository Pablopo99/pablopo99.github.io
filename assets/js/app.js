// Aplicacion del CV

// ---------------------------------------------------------------------------
// Idioma
// ---------------------------------------------------------------------------

const IDIOMA_POR_DEFECTO = 'es';
const textosEs = new Map();

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

export async function cambiarIdioma(codigo) {
  const traducciones = await cargarTraducciones(codigo);
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
