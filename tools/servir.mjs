import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

const RAIZ = decodeURIComponent(new URL('..', import.meta.url).pathname);
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
