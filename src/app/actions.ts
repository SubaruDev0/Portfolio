'use server'

import { Project, Certificate } from '@/types';
import { sql } from '@/lib/db';
import { revalidatePath } from 'next/cache';

// AUTHENTICATION
export async function verifyAdminAction(password: string) {
  try {
    const result = await sql`SELECT password_hash FROM admin_auth WHERE id = 'admin_secret' LIMIT 1`;
    if (result && result.length > 0) {
      const dbPassword = (result[0] as any).password_hash;
      // Case-insensitive comparison as requested
      const isMatch = dbPassword.toLowerCase() === password.toLowerCase();
      return { success: isMatch };
    }
    // Fallback if DB is empty or table doesn't exist yet
    // This allows initial access to run migrations
    const fallbackPassword = 'Mabel#zer0'; 
    return { success: password.toLowerCase() === fallbackPassword.toLowerCase() || password.toLowerCase() === 'mabel123' };
  } catch (error) {
    console.error('Auth error:', error);
    // Even if query fails (table not exists), allow the owner to enter and initialize
    return { success: password.toLowerCase() === 'mabel#zer0' || password.toLowerCase() === 'mabel123' };
  }
}

// Image Upload - Convert to Base64 to store in Database (FORCE UPDATE)
export async function uploadImageAction(formData: FormData) {
  try {
    const file = formData.get('file') as File;
    if (!file) throw new Error('No file provided');

    // Convert file to Buffer and then to Base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');
    const dataUrl = `data:${file.type};base64,${base64}`;

    // Returning the Data URL to be stored in Neon DB column image_url
    return { success: true, url: dataUrl };
  } catch (error) {
    console.error('Upload error:', error);
    return { success: false, error: String(error) };
  }
}

// PROJECTS
export async function addProjectAction(project: Project) {
  try {
    await sql`
      INSERT INTO projects (
        id, title, description, category, technologies, 
        github_url, live_url, image_url, gallery, 
        featured, is_starred, is_real_world, created_at
      ) VALUES (
        ${project.id}, ${project.title}, ${project.description}, ${project.category}, ${project.technologies},
        ${project.githubUrl || ''}, ${project.liveUrl || ''}, ${project.imageUrl || ''}, ${project.gallery || []},
        ${project.featured ?? true}, ${project.isStarred ?? false}, ${project.isRealWorld ?? false}, ${project.createdAt || new Date().toISOString()}
      )
    `;
    revalidatePath('/');
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error('Error al guardar el proyecto:', error);
    return { success: false, error: String(error) };
  }
}

export async function updateProjectAction(project: Project) {
  try {
    await sql`
      UPDATE projects SET
        title = ${project.title},
        description = ${project.description},
        category = ${project.category},
        technologies = ${project.technologies},
        github_url = ${project.githubUrl || ''},
        live_url = ${project.liveUrl || ''},
        image_url = ${project.imageUrl || ''},
        gallery = ${project.gallery || []},
        featured = ${project.featured ?? true},
        is_starred = ${project.isStarred ?? false},
        is_real_world = ${project.isRealWorld ?? false}
      WHERE id = ${project.id}
    `;
    revalidatePath('/');
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error('Update project error:', error);
    return { success: false, error: String(error) };
  }
}

export async function deleteProjectAction(id: string) {
  try {
    await sql`DELETE FROM projects WHERE id = ${id}`;
    revalidatePath('/');
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error('Error al borrar el proyecto:', error);
    return { success: false, error: String(error) };
  }
}

// CERTIFICATES
export async function addCertificateAction(certificate: Certificate) {
  try {
    await sql`
      INSERT INTO certificates (id, title, description, date, academy, image_url)
      VALUES (${certificate.id}, ${certificate.title}, ${certificate.description || ''}, ${certificate.date}, ${certificate.academy}, ${certificate.imageUrl || ''})
    `;
    revalidatePath('/');
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error('Error al guardar el certificado:', error);
    return { success: false, error: String(error) };
  }
}

export async function updateCertificateAction(certificate: Certificate) {
  try {
    await sql`
      UPDATE certificates SET
        title = ${certificate.title},
        description = ${certificate.description || ''},
        date = ${certificate.date},
        academy = ${certificate.academy},
        image_url = ${certificate.imageUrl || ''}
      WHERE id = ${certificate.id}
    `;
    revalidatePath('/');
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error('Update certificate error:', error);
    return { success: false, error: String(error) };
  }
}

export async function deleteCertificateAction(id: string) {
  try {
    await sql`DELETE FROM certificates WHERE id = ${id}`;
    revalidatePath('/');
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error('Error al borrar el certificado:', error);
    return { success: false, error: String(error) };
  }
}

export async function updateSettingsAction(settings: Record<string, string>) {
  try {
    for (const [key, value] of Object.entries(settings)) {
      await sql`
        INSERT INTO portfolio_settings (key, value)
        VALUES (${key}, ${value})
        ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value
      `;
    }
    revalidatePath('/');
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error('Update settings error:', error);
    return { success: false, error: String(error) };
  }
}

export async function reorderAction(type: 'projects' | 'certificates', id: string, direction: 'up' | 'down') {
  return { success: true };
}

export async function runMigration() {
  const { initDatabase } = await import('@/lib/init-db');
  await initDatabase();
  return { success: true };
}
