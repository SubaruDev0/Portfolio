'use server'

import { Project, Certificate } from '@/types';
import { getSql } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { put, del } from '@vercel/blob';

// AUTHENTICATION
export async function verifyAdminAction(password: string) {
  try {
    const sql = getSql();
    const result = await getSql()`SELECT password_hash FROM admin_auth WHERE id = 'admin_secret' LIMIT 1`;
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

// Image Upload - Upload to Vercel Blob Storage
export async function uploadImageAction(formData: FormData) {
  try {
    const file = formData.get('file') as File;
    if (!file) throw new Error('No file provided');

    // Generate unique filename
    const timestamp = Date.now();
    const extension = file.name.split('.').pop() || 'png';
    const filename = `portfolio/${timestamp}-${Math.random().toString(36).substring(7)}.${extension}`;

    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: 'public',
      addRandomSuffix: false,
    });

    // Return the public URL
    return { success: true, url: blob.url };
  } catch (error) {
    console.error('Upload error:', error);
    return { success: false, error: String(error) };
  }
}

// Delete image from Vercel Blob (optional cleanup)
export async function deleteImageAction(url: string) {
  try {
    // Only delete if it's a Vercel Blob URL (not base64)
    if (url && url.includes('blob.vercel-storage.com')) {
      await del(url);
    }
    return { success: true };
  } catch (error) {
    console.error('Delete image error:', error);
    return { success: false, error: String(error) };
  }
}

// PROJECTS
export async function addProjectAction(project: Project) {
  try {
    await getSql()`
      INSERT INTO projects (
        id, title, description, category, secondary_category, technologies, 
        github_url, live_url, image_url, gallery, 
        featured, is_starred, is_real_world, sort_order, created_at
      ) VALUES (
        ${project.id}, ${project.title}, ${project.description}, ${project.category}, ${project.secondaryCategory || null}, ${project.technologies},
        ${project.githubUrl || ''}, ${project.liveUrl || ''}, ${project.imageUrl || ''}, ${project.gallery || []},
        ${project.featured ?? true}, ${project.isStarred ?? false}, ${project.isRealWorld ?? false},
        COALESCE((SELECT MAX(sort_order) FROM projects), 0) + 1,
        ${project.createdAt || new Date().toISOString()}
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
    await getSql()`
      UPDATE projects SET
        title = ${project.title},
        description = ${project.description},
        category = ${project.category},
        secondary_category = ${project.secondaryCategory || null},
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
    await getSql()`DELETE FROM projects WHERE id = ${id}`;
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
    await getSql()`
      INSERT INTO certificates (id, title, description, date, academy, image_url, sort_order)
      VALUES (
        ${certificate.id}, 
        ${certificate.title}, 
        ${certificate.description || ''}, 
        ${certificate.date}, 
        ${certificate.academy}, 
        ${certificate.imageUrl || ''},
        COALESCE((SELECT MAX(sort_order) FROM certificates), 0) + 1
      )
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
    await getSql()`
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
    await getSql()`DELETE FROM certificates WHERE id = ${id}`;
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
      await getSql()`
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

export async function saveOrderAction(type: 'projects' | 'certificates', orderedIds: string[]) {
  try {
    const isProjects = type === 'projects';
    const tableName = isProjects ? 'projects' : 'certificates';
    
    // Usamos transacciones implícitas de Postgres simplemente ejecutando los updates
    // Para mejorar performance, podríamos usar una sola query pero con subaru esto es más seguro
    for (let i = 0; i < orderedIds.length; i++) {
        if (isProjects) {
            await getSql()`UPDATE projects SET sort_order = ${i} WHERE id = ${orderedIds[i]}`;
        } else {
            await getSql()`UPDATE certificates SET sort_order = ${i} WHERE id = ${orderedIds[i]}`;
        }
    }
    
    revalidatePath('/');
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error('Error al guardar orden:', error);
    return { success: false, error: String(error) };
  }
}

export async function reorderAction(type: 'projects' | 'certificates', id: string, direction: 'up' | 'down') {
  try {
    const isProjects = type === 'projects';
    const items = (isProjects
      ? await getSql()`SELECT id, sort_order FROM projects ORDER BY sort_order ASC, created_at DESC`
      : await getSql()`SELECT id, sort_order FROM certificates ORDER BY sort_order ASC, date DESC`) as { id: string; sort_order: number }[];
    
    // Normalize sort_order if they are all 0 or duplicates
    let normalized = false;
  const orders = new Set(items.map((i) => i.sort_order));
    if (orders.size < items.length) {
      for (let i = 0; i < items.length; i++) {
        if (isProjects) {
          await getSql()`UPDATE projects SET sort_order = ${i} WHERE id = ${items[i].id}`;
        } else {
          await getSql()`UPDATE certificates SET sort_order = ${i} WHERE id = ${items[i].id}`;
        }
        items[i].sort_order = i;
      }
      normalized = true;
    }

    const index = items.findIndex(item => item.id === id);
    if (index === -1) return { success: false, error: 'Item no encontrado' };

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return { success: true };

    const currentItem = items[index];
    const targetItem = items[targetIndex];

    if (isProjects) {
      await getSql()`UPDATE projects SET sort_order = ${targetItem.sort_order} WHERE id = ${currentItem.id}`;
      await getSql()`UPDATE projects SET sort_order = ${currentItem.sort_order} WHERE id = ${targetItem.id}`;
    } else {
      await getSql()`UPDATE certificates SET sort_order = ${targetItem.sort_order} WHERE id = ${currentItem.id}`;
      await getSql()`UPDATE certificates SET sort_order = ${currentItem.sort_order} WHERE id = ${targetItem.id}`;
    }

    revalidatePath('/');
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error('Reorder error:', error);
    return { success: false, error: String(error) };
  }
}

export async function runMigration() {
  const { initDatabase } = await import('@/lib/init-db');
  await initDatabase();
  return { success: true };
}
