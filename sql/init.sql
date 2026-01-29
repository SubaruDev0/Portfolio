-- init.sql: create tables used by the app

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
);

CREATE TABLE IF NOT EXISTS certificates (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  date TEXT,
  academy TEXT,
  image_url TEXT,
  sort_order INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS portfolio_settings (
  key TEXT PRIMARY KEY,
  value TEXT
);

CREATE TABLE IF NOT EXISTS admin_auth (
  id TEXT PRIMARY KEY DEFAULT 'admin_secret',
  password_hash TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert admin password (literal, for local dev only)
INSERT INTO admin_auth (id, password_hash)
VALUES ('admin_secret', 'Mabel#zer0')
ON CONFLICT (id) DO NOTHING;
