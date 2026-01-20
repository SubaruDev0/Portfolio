// Script para agregar columna secondary_category a la tabla projects
const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL);

async function migrate() {
  try {
    console.log('🔄 Ejecutando migración...');
    console.log('DATABASE_URL detectada:', process.env.DATABASE_URL ? '✅ Sí' : '❌ No');
    
    await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS secondary_category TEXT`;
    console.log('✅ Columna secondary_category agregada exitosamente!');
    
    // Verificar que se creó
    const result = await sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'projects' AND column_name = 'secondary_category'
    `;
    
    if (result.length > 0) {
      console.log('✅ Verificación: La columna existe en la base de datos');
    } else {
      console.log('⚠️  La columna no se encontró después de la migración');
    }
    
  } catch (e) {
    console.error('❌ Error:', e.message);
  }
}

migrate();
