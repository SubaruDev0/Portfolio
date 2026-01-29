
import { getSql } from './db';

export async function initDatabase() {
  try {
    console.log('Initializing database...');

    // Create projects table
    await getSql()`
      CREATE TABLE IF NOT EXISTS projects (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        category TEXT,
        secondary_category TEXT,
        technologies TEXT[],
        github_url TEXT,
        live_url TEXT,
        image_url TEXT,
        gallery TEXT[],
        featured BOOLEAN DEFAULT false,
        is_starred BOOLEAN DEFAULT false,
        is_real_world BOOLEAN DEFAULT false,
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create certificates table
    await getSql()`
      CREATE TABLE IF NOT EXISTS certificates (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        date TEXT,
        academy TEXT,
        image_url TEXT,
        sort_order INTEGER DEFAULT 0
      )
    `;

    // Create portfolio settings table
    await getSql()`
      CREATE TABLE IF NOT EXISTS portfolio_settings (
        key TEXT PRIMARY KEY,
        value TEXT
      )
    `;

    // Create admin_auth table
    await getSql()`
      CREATE TABLE IF NOT EXISTS admin_auth (
        id TEXT PRIMARY KEY DEFAULT 'admin_secret',
        password_hash TEXT NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    console.log('Tables created successfully.');

    // Add sort_order column to existing tables if it doesn't exist
    try {
      await getSql()`ALTER TABLE projects ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0`;
      await getSql()`ALTER TABLE certificates ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0`;
      await getSql()`ALTER TABLE projects ADD COLUMN IF NOT EXISTS secondary_category TEXT`;
      console.log('Migration: sort_order and secondary_category columns added.');
    } catch (e) {
      console.log('Migration info:', e);
    }

    // Initialize admin password if not exists (Mabel#zer0)
    // Note: In a real app we should hash this, but we'll use literal for now as per user request context
    await getSql()`
      INSERT INTO admin_auth (id, password_hash)
      VALUES ('admin_secret', 'Mabel#zer0')
      ON CONFLICT (id) DO NOTHING
    `;

    console.log('Admin auth initialized.');
    console.log('Database tables verified.');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}
