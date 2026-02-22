/**
 * Script para migrar imágenes de Base64 (en Neon DB) a Vercel Blob Storage
 * 
 * Uso:
 *   node scripts/migrate-images-to-blob.js
 * 
 * O modo dry-run (solo ver qué se migraría):
 *   DRY_RUN=true node scripts/migrate-images-to-blob.js
 */

const { neon } = require('@neondatabase/serverless');
const { put } = require('@vercel/blob');

// Load environment variables (.env.local preferred, fallback to .env)
const fs = require('fs');
const dotenv = require('dotenv');
if (fs.existsSync('.env.local')) {
  dotenv.config({ path: '.env.local' });
} else if (fs.existsSync('.env')) {
  dotenv.config({ path: '.env' });
} else {
  dotenv.config();
}

const DATABASE_URL = process.env.DATABASE_URL;
const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;
const DRY_RUN = process.env.DRY_RUN === 'true';

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL not found in .env.local');
  process.exit(1);
}

if (!BLOB_TOKEN) {
  console.error('❌ BLOB_READ_WRITE_TOKEN not found in .env.local');
  process.exit(1);
}

const sql = neon(DATABASE_URL);

/**
 * Check if a string is a base64 data URL
 */
function isBase64(str) {
  return str && str.startsWith('data:');
}

/**
 * Convert base64 data URL to a Blob/Buffer for upload
 */
function base64ToBuffer(dataUrl) {
  const matches = dataUrl.match(/^data:(.+);base64,(.+)$/);
  if (!matches) throw new Error('Invalid base64 data URL');
  
  const mimeType = matches[1];
  const base64Data = matches[2];
  const buffer = Buffer.from(base64Data, 'base64');
  
  return { buffer, mimeType };
}

/**
 * Get file extension from mime type
 */
function getExtension(mimeType) {
  const map = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/gif': 'gif',
    'image/webp': 'webp',
    'image/svg+xml': 'svg',
  };
  return map[mimeType] || 'png';
}

/**
 * Upload a base64 image to Vercel Blob
 */
async function uploadToBlob(base64Url, folder, id) {
  const { buffer, mimeType } = base64ToBuffer(base64Url);
  const extension = getExtension(mimeType);
  const filename = `${folder}/${id}-${Date.now()}.${extension}`;
  
  const blob = await put(filename, buffer, {
    access: 'public',
    contentType: mimeType,
    addRandomSuffix: false,
    token: BLOB_TOKEN,
  });
  
  return blob.url;
}

/**
 * Migrate projects
 */
async function migrateProjects() {
  console.log('\n📦 Migrando proyectos...\n');
  
  const projects = await sql`SELECT id, title, image_url, gallery FROM projects`;
  
  let migrated = 0;
  let skipped = 0;
  
  for (const project of projects) {
    const updates = {};
    
    // Check main image
    if (isBase64(project.image_url)) {
      if (DRY_RUN) {
        console.log(`  🔍 [DRY-RUN] Migraría imagen principal de: ${project.title}`);
      } else {
        try {
          const newUrl = await uploadToBlob(project.image_url, 'projects', project.id);
          updates.image_url = newUrl;
          console.log(`  ✅ Imagen principal migrada: ${project.title}`);
          console.log(`     URL: ${newUrl}`);
        } catch (err) {
          console.error(`  ❌ Error migrando ${project.title}:`, err.message);
        }
      }
      migrated++;
    } else {
      skipped++;
    }
    
    // Check gallery images
    if (project.gallery && Array.isArray(project.gallery)) {
      const newGallery = [];
      let galleryChanged = false;
      
      for (let i = 0; i < project.gallery.length; i++) {
        const img = project.gallery[i];
        if (isBase64(img)) {
          if (DRY_RUN) {
            console.log(`  🔍 [DRY-RUN] Migraría imagen de galería ${i + 1} de: ${project.title}`);
            newGallery.push(img);
          } else {
            try {
              const newUrl = await uploadToBlob(img, 'projects/gallery', `${project.id}-${i}`);
              newGallery.push(newUrl);
              galleryChanged = true;
              console.log(`  ✅ Galería ${i + 1} migrada: ${project.title}`);
            } catch (err) {
              console.error(`  ❌ Error migrando galería ${i + 1} de ${project.title}:`, err.message);
              newGallery.push(img); // Keep original on error
            }
          }
        } else {
          newGallery.push(img);
        }
      }
      
      if (galleryChanged) {
        updates.gallery = newGallery;
      }
    }
    
    // Update database
    if (!DRY_RUN && Object.keys(updates).length > 0) {
      if (updates.image_url && updates.gallery) {
        await sql`
          UPDATE projects 
          SET image_url = ${updates.image_url}, gallery = ${updates.gallery}
          WHERE id = ${project.id}
        `;
      } else if (updates.image_url) {
        await sql`
          UPDATE projects 
          SET image_url = ${updates.image_url}
          WHERE id = ${project.id}
        `;
      } else if (updates.gallery) {
        await sql`
          UPDATE projects 
          SET gallery = ${updates.gallery}
          WHERE id = ${project.id}
        `;
      }
    }
  }
  
  console.log(`\n  📊 Proyectos: ${migrated} migrados, ${skipped} ya tenían URL\n`);
}

/**
 * Migrate certificates
 */
async function migrateCertificates() {
  console.log('\n📜 Migrando certificados...\n');
  
  const certificates = await sql`SELECT id, title, image_url FROM certificates`;
  
  let migrated = 0;
  let skipped = 0;
  
  for (const cert of certificates) {
    if (isBase64(cert.image_url)) {
      if (DRY_RUN) {
        console.log(`  🔍 [DRY-RUN] Migraría imagen de: ${cert.title}`);
      } else {
        try {
          const newUrl = await uploadToBlob(cert.image_url, 'certificates', cert.id);
          await sql`
            UPDATE certificates 
            SET image_url = ${newUrl}
            WHERE id = ${cert.id}
          `;
          console.log(`  ✅ Certificado migrado: ${cert.title}`);
          console.log(`     URL: ${newUrl}`);
        } catch (err) {
          console.error(`  ❌ Error migrando ${cert.title}:`, err.message);
        }
      }
      migrated++;
    } else {
      skipped++;
    }
  }
  
  console.log(`\n  📊 Certificados: ${migrated} migrados, ${skipped} ya tenían URL\n`);
}

/**
 * Main migration function
 */
async function main() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('   🚀 MIGRACIÓN DE IMÁGENES: Base64 → Vercel Blob');
  console.log('═══════════════════════════════════════════════════════════');
  
  if (DRY_RUN) {
    console.log('\n⚠️  MODO DRY-RUN: No se realizarán cambios reales\n');
  }
  
  try {
    await migrateProjects();
    await migrateCertificates();
    
    console.log('═══════════════════════════════════════════════════════════');
    if (DRY_RUN) {
      console.log('   ✅ Dry-run completado. Ejecuta sin DRY_RUN para migrar.');
    } else {
      console.log('   ✅ ¡Migración completada exitosamente!');
    }
    console.log('═══════════════════════════════════════════════════════════\n');
  } catch (error) {
    console.error('\n❌ Error durante la migración:', error);
    process.exit(1);
  }
}

main();
