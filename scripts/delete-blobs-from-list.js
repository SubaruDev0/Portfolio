/*
Script: scripts/delete-blobs-from-list.js

Descripción:
  - Lee un archivo 'scripts/blobs-to-delete.txt' con una URL o key por línea y borra cada blob usando @vercel/blob.del

Uso (DRY RUN recomendado):
  DRY_RUN=true BLOB_READ_WRITE_TOKEN=ssb_... node scripts/delete-blobs-from-list.js

Notas:
  - El token debe tener permisos de lectura/escritura en el Storage.
  - El archivo puede contener URLs completas o claves (path dentro del storage).
*/

const { del } = require('@vercel/blob');
const fs = require('fs');
// Cargar .env.local si existe, si no usar .env
const dotenv = require('dotenv');
if (fs.existsSync('.env.local')) {
  dotenv.config({ path: '.env.local' });
} else if (fs.existsSync('.env')) {
  dotenv.config({ path: '.env' });
} else {
  dotenv.config();
}

const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;
const DRY_RUN = process.env.DRY_RUN === 'true';

if (!BLOB_TOKEN) {
  console.error('❌ BLOB_READ_WRITE_TOKEN not found in .env.local');
  process.exit(1);
}

const lines = fs.existsSync('scripts/blobs-to-delete.txt') ? fs.readFileSync('scripts/blobs-to-delete.txt', 'utf8').split(/\r?\n/).map(l => l.trim()).filter(Boolean) : [];

(async function main(){
  console.log(`Found ${lines.length} entries to process (DRY_RUN=${DRY_RUN})`);
  for (const entry of lines) {
    let key = entry;
    // If it's a URL, extract path
    try {
      if (entry.startsWith('http')) {
        const u = new URL(entry);
        key = u.pathname.replace(/^\//, '');
      }
    } catch (e) {
      // ignore
    }

    if (DRY_RUN) {
      console.log(`[DRY] Would delete: ${key}`);
      continue;
    }

    try {
      await del(entry, { token: BLOB_TOKEN });
      console.log(`Deleted: ${entry}`);
    } catch (err) {
      // try deleting by key
      try {
        await del(key, { token: BLOB_TOKEN });
        console.log(`Deleted by key: ${key}`);
      } catch (err2) {
        console.error(`Failed to delete ${entry}:`, err2?.message || err2);
      }
    }
  }
  console.log('Done');
})();
