import { neon } from '@neondatabase/serverless';
import { Pool } from 'pg';

// Choose client depending on DATABASE_URL
let sql: any = null;
if (process.env.DATABASE_URL) {
  const url = process.env.DATABASE_URL;
  // If the URL looks like a standard Postgres connection string, use node-postgres Pool
  if (url.startsWith('postgres://') || url.startsWith('postgresql://')) {
    const pool = new Pool({ connectionString: url });

    // Provide a tagged template function compatible with usage sql`SELECT ... WHERE id = ${id}`
    const tagged = (strings: TemplateStringsArray, ...values: any[]) => {
      const text = strings.reduce((acc, s, i) => acc + s + (i < values.length ? `$${i + 1}` : ''), '');
      return pool.query(text, values).then(res => res.rows);
    };

    // expose query and end for compatibility
  // Provide a direct query method compatible with node-postgres signature
  (tagged as any).query = (text: string, params?: any[]) => pool.query(text, params);
    (tagged as any).end = () => pool.end();
    sql = tagged as any;
  } else {
    // Otherwise, assume it's a Neon serverless endpoint and use the neon client (which uses fetch)
    sql = neon(url);
  }
}

export function getSql() {
  if (!sql) {
    throw new Error('Database not configured. Please set DATABASE_URL environment variable.');
  }
  return sql;
}

export { sql };
