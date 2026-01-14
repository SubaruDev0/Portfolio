
import { sql } from './db';
import { Project, Certificate } from '@/types';

export async function getProjects(): Promise<Project[]> {
  try {
    const result = await sql`
      SELECT 
        id, 
        title, 
        description, 
        category, 
        technologies, 
        github_url as "githubUrl", 
        live_url as "liveUrl", 
        image_url as "imageUrl", 
        gallery, 
        featured, 
        is_starred as "isStarred", 
        is_real_world as "isRealWorld", 
        created_at as "createdAt"
      FROM projects 
      ORDER BY created_at DESC
    `;
    return result as unknown as Project[];
  } catch (error: any) {
    if (error.message?.includes('relation "projects" does not exist')) {
      console.log('Table "projects" does not exist yet. Returning empty array.');
      return [];
    }
    throw error;
  }
}

export async function getCertificates(): Promise<Certificate[]> {
  try {
    const result = await sql`
      SELECT 
        id, 
        title, 
        description, 
        date, 
        academy, 
        image_url as "imageUrl"
      FROM certificates 
      ORDER BY date DESC
    `;
    return result as unknown as Certificate[];
  } catch (error: any) {
    throw error;
  }
}

export async function getPortfolioSettings(): Promise<Record<string, string>> {
  try {
    const result = await sql`SELECT key, value FROM portfolio_settings`;
    const settings: Record<string, string> = {};
    (result as any[]).forEach(row => {
      settings[row.key] = row.value;
    });
    return settings;
  } catch (error: any) {
    if (error.message?.includes('relation "portfolio_settings" does not exist')) {
      return {};
    }
    throw error;
  }
}

