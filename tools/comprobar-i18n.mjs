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
