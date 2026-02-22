/**
 * Normaliza una lista de blobs (URLs completas o claves) a claves (paths)
 * Lee 'scripts/all_blobs_from_vercel.txt' y escribe 'scripts/all_blobs_paths.txt'
 *
 * Uso:
 *   node scripts/normalize-blob-urls.js
 */

const fs = require('fs');

const inFile = 'scripts/all_blobs_from_vercel.txt';
const outFile = 'scripts/all_blobs_paths.txt';

if (!fs.existsSync(inFile)) {
  console.error(`${inFile} no existe. Pega la lista completa de blobs desde Vercel en ese archivo (una entrada por línea).`);
  process.exit(1);
}

const lines = fs.readFileSync(inFile, 'utf8').split(/\r?\n/).map(l => l.trim()).filter(Boolean);

const paths = lines.map(line => {
  // Si es una URL, extraer pathname
  if (/^https?:\/\//i.test(line)) {
    try {
      const u = new URL(line);
      return u.pathname.replace(/^\//, '');
    } catch (e) {
      return line;
    }
  }
  // Si ya parece una key/path, devolver tal cual
  return line;
});

fs.writeFileSync(outFile, Array.from(new Set(paths)).join('\n'), 'utf8');
console.log(`Hecho. ${paths.length} entradas normalizadas en ${outFile}`);
