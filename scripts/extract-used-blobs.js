/*
Script: scripts/extract-used-blobs.js

Descripción:
  - Extrae todas las URLs de blobs referenciadas desde la base de datos (projects.image_url, projects.gallery, certificates.image_url)
  - Convierte las URLs a "keys" (ruta dentro del storage) y las escribe en 'used_blobs.txt'.

Uso:
  cp .env.local .env.local.backup            # opcional, haz backup
  BLOB_TOKEN=ssb_... DATABASE_URL=... node scripts/extract-used-blobs.js

Salida:
  - scripts/used_blobs.txt (lista única, un key por línea)

Notas:
  - No lista objetos almacenados en Vercel; solo saca las referencias que hay en la DB.
  - Para encontrar objetos huérfanos: obtén la lista completa de blobs desde el dashboard de Vercel o mediante la API, y compara con este archivo.
*/

const { neon } = require('@neondatabase/serverless');
const fs = require('fs');
// Cargar .env.local si existe, si no usar .env
const dotenv = require('dotenv');
if (fs.existsSync('.env.local')) {
  dotenv.config({ path: '.env.local' });
} else if (fs.existsSync('.env')) {
  dotenv.config({ path: '.env' });
} else {
  // no hay .env disponible; dotenv quedará sin variables
  dotenv.config();
}

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL not found in .env.local');
  process.exit(1);
}

const sql = neon(DATABASE_URL);

function extractKeyFromUrl(url) {
  if (!url || typeof url !== 'string') return null;
  try {
    const u = new URL(url);
    // The path component without leading slash
    const p = u.pathname.replace(/^\//, '');
    if (p) return p;
    // fallback: if URL is like https://blob.vercel-storage.com/ssb_/folder/xxx then path works
    return null;
  } catch (e) {
    return null;
  }
}

(async function main(){
  try {
    console.log('Conectando a DB...');
    const projects = await sql`SELECT id, image_url, gallery FROM projects`;
    const certificates = await sql`SELECT id, image_url FROM certificates`;

    const used = new Set();

    for (const p of projects) {
      if (p.image_url && typeof p.image_url === 'string') {
        const k = extractKeyFromUrl(p.image_url);
        if (k) used.add(k);
      }
      if (p.gallery && Array.isArray(p.gallery)) {
        for (const img of p.gallery) {
          if (img && typeof img === 'string') {
            const k = extractKeyFromUrl(img);
            if (k) used.add(k);
          }
        }
      }
    }

    for (const c of certificates) {
      if (c.image_url && typeof c.image_url === 'string') {
        const k = extractKeyFromUrl(c.image_url);
        if (k) used.add(k);
      }
    }

    const out = Array.from(used).sort().join('\n');
    fs.writeFileSync('scripts/used_blobs.txt', out, 'utf8');
    console.log(`Hecho. ${used.size} claves escritas en scripts/used_blobs.txt`);
    console.log('Compara este archivo con la lista completa de blobs que obtengas desde Vercel para detectar huérfanos.');
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
})();
