'use server'

import fs from 'fs/promises';
import path from 'path';
import { Project, Certificate } from '@/types';
import { sql } from '@/lib/db';
import { revalidatePath } from 'next/cache';

// Image Upload remains the same for now (local storage)
export async function uploadImageAction(formData: FormData) {
  try {
    const file = formData.get('file') as File;
    if (!file) throw new Error('No file provided');

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    const publicPath = path.join(process.cwd(), 'public/projects', fileName);
    
    await fs.mkdir(path.dirname(publicPath), { recursive: true });
    await fs.writeFile(publicPath, buffer);

    return { success: true, url: `/projects/${fileName}` };
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

export async function reorderAction(type: 'projects' | 'certificates', id: string, direction: 'up' | 'down') {
  return { success: true };
}

export async function runMigration() {
  const { initDatabase } = await import('@/lib/init-db');
  await initDatabase();
  return { success: true };
}
