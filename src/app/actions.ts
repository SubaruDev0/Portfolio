'use server'

import { Project, Certificate } from '@/types';
import { getSql } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { put, del } from '@vercel/blob';

// AUTHENTICATION
export async function verifyAdminAction(password: string) {
  try {
    const sql = getSql();
    const result = await sql`SELECT password_hash FROM admin_auth WHERE id = 'admin_secret' LIMIT 1`;
    if (result && result.length > 0) {
      const dbPassword = (result[0] as any).password_hash;
      const isMatch = dbPassword.toLowerCase() === password.toLowerCase();
      return { success: isMatch };
    }
    const fallbackPassword = 'Mabel#zer0'; 
    return { success: password.toLowerCase() === fallbackPassword.toLowerCase() || password.toLowerCase() === 'mabel123' };
  } catch (error) {
    console.error('Auth error:', error);
    return { success: password.toLowerCase() === 'mabel#zer0' || password.toLowerCase() === 'mabel123' };
  }
}

// File Upload (Images & PDFs for CV)
export async function uploadFileAction(formData: FormData) {
  try {
    const file = formData.get('file') as File;
    if (!file) throw new Error('No file provided');

    // Server-side validation: accept images and PDFs, limit size to 10MB
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return { success: false, error: `File too large. Max allowed size is ${maxSize} bytes.` };
    }
    
    const isImage = file.type && file.type.startsWith('image/');
    const isPDF = file.type === 'application/pdf';
    
    if (!isImage && !isPDF) {
      return { success: false, error: 'Invalid file type. Only images and PDFs are allowed.' };
    }

    const timestamp = Date.now();
    const extension = file.name.split('.').pop() || (isPDF ? 'pdf' : 'png');
    const filename = `portfolio/${timestamp}-${Math.random().toString(36).substring(7)}.${extension}`;

    const blob = await put(filename, file, {
      access: 'public',
      addRandomSuffix: false,
    });

    return { success: true, url: blob.url };
  } catch (error) {
    console.error('Upload error:', error);
    return { success: false, error: String(error) };
  }
}

export async function deleteImageAction(url: string) {
  try {
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
        COALESCE((SELECT MIN(sort_order) FROM projects), 0) - 1,
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
    // Primero obtener la imagen/gallería previa para eliminar blobs huérfanos si cambian
    const sql = getSql();
    const prev = await sql`SELECT image_url, gallery FROM projects WHERE id = ${project.id} LIMIT 1`;
    const prevRow = (prev && prev.length > 0) ? (prev[0] as any) : null;

    await sql`
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

    // Si la imagen principal cambió y la previa está en Vercel Blob, eliminarla
    if (prevRow && prevRow.image_url && prevRow.image_url !== project.imageUrl && String(prevRow.image_url).includes('blob.vercel-storage.com')) {
      try {
        await deleteImageAction(prevRow.image_url);
      } catch (e) {
        console.error('Error eliminando blob previo (main):', e);
      }
    }

    // Para la galería, eliminar imágenes previas que no estén en la galería nueva
    try {
      const prevGallery: string[] = prevRow && prevRow.gallery ? prevRow.gallery : [];
      const newGallery: string[] = project.gallery || [];
      for (const img of prevGallery) {
        if (img && img.includes('blob.vercel-storage.com') && !newGallery.includes(img)) {
          try {
            await deleteImageAction(img);
          } catch (e) {
            console.error('Error eliminando blob previo (gallery):', e);
          }
        }
      }
    } catch (e) {
      // ignore gallery cleanup errors
    }
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
    const sql = getSql();
    // Obtener URLs asociadas para limpiar blobs en Vercel
    try {
      const rows = await sql`SELECT image_url, gallery FROM projects WHERE id = ${id} LIMIT 1`;
      const row = (rows && rows.length > 0) ? (rows[0] as any) : null;
      if (row) {
        if (row.image_url && String(row.image_url).includes('blob.vercel-storage.com')) {
          try { await deleteImageAction(row.image_url); } catch (e) { console.error('Error eliminando blob (main) al borrar proyecto:', e); }
        }
        const gallery: string[] = row.gallery || [];
        for (const img of gallery) {
          if (img && String(img).includes('blob.vercel-storage.com')) {
            try { await deleteImageAction(img); } catch (e) { console.error('Error eliminando blob (gallery) al borrar proyecto:', e); }
          }
        }
      }
    } catch (e) {
      console.error('Error obteniendo imágenes previas antes de borrar proyecto:', e);
    }

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
    await getSql()`
      INSERT INTO certificates (id, title, description, date, academy, image_url, sort_order)
      VALUES (
        ${certificate.id}, 
        ${certificate.title}, 
        ${certificate.description || ''}, 
        ${certificate.date}, 
        ${certificate.academy}, 
        ${certificate.imageUrl || ''},
        COALESCE((SELECT MIN(sort_order) FROM certificates), 0) - 1
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
    const sql = getSql();
    const prev = await sql`SELECT image_url FROM certificates WHERE id = ${certificate.id} LIMIT 1`;
    const prevRow = (prev && prev.length > 0) ? (prev[0] as any) : null;

    await sql`
      UPDATE certificates SET
        title = ${certificate.title},
        description = ${certificate.description || ''},
        date = ${certificate.date},
        academy = ${certificate.academy},
        image_url = ${certificate.imageUrl || ''}
      WHERE id = ${certificate.id}
    `;

    if (prevRow && prevRow.image_url && prevRow.image_url !== certificate.imageUrl && String(prevRow.image_url).includes('blob.vercel-storage.com')) {
      try { await deleteImageAction(prevRow.image_url); } catch (e) { console.error('Error eliminando blob previo (cert):', e); }
    }
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
    const sql = getSql();
    try {
      const rows = await sql`SELECT image_url FROM certificates WHERE id = ${id} LIMIT 1`;
      const row = (rows && rows.length > 0) ? (rows[0] as any) : null;
      if (row && row.image_url && String(row.image_url).includes('blob.vercel-storage.com')) {
        try { await deleteImageAction(row.image_url); } catch (e) { console.error('Error eliminando blob (cert) al borrar certificado:', e); }
      }
    } catch (e) {
      console.error('Error obteniendo imagen previa antes de borrar certificado:', e);
    }

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
    const sql = getSql();
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

export async function saveOrderAction(type: 'projects' | 'certificates', orderedIds: string[]) {
  try {
    const sql = getSql();
    const isProjects = type === 'projects';
    
    for (let i = 0; i < orderedIds.length; i++) {
        if (isProjects) {
            await sql`UPDATE projects SET sort_order = ${i} WHERE id = ${orderedIds[i]}`;
        } else {
            await sql`UPDATE certificates SET sort_order = ${i} WHERE id = ${orderedIds[i]}`;
        }
    }
    
    // REVALIDAR SOLO AL FINAL DEL BUCLE
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
    const sql = getSql();
    const isProjects = type === 'projects';
    const items = (isProjects
      ? await sql`SELECT id, sort_order FROM projects ORDER BY sort_order ASC, created_at DESC`
      : await sql`SELECT id, sort_order FROM certificates ORDER BY sort_order ASC, date DESC`) as { id: string; sort_order: number }[];
    
    const orders = new Set(items.map((i) => i.sort_order));
    if (orders.size < items.length) {
      for (let i = 0; i < items.length; i++) {
        if (isProjects) {
          await sql`UPDATE projects SET sort_order = ${i} WHERE id = ${items[i].id}`;
        } else {
          await sql`UPDATE certificates SET sort_order = ${i} WHERE id = ${items[i].id}`;
        }
        items[i].sort_order = i;
      }
    }

    const index = items.findIndex(item => item.id === id);
    if (index === -1) return { success: false, error: 'Item no encontrado' };

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return { success: true };

    const currentItem = items[index];
    const targetItem = items[targetIndex];

    if (isProjects) {
      await sql`UPDATE projects SET sort_order = ${targetItem.sort_order} WHERE id = ${currentItem.id}`;
      await sql`UPDATE projects SET sort_order = ${currentItem.sort_order} WHERE id = ${targetItem.id}`;
    } else {
      await sql`UPDATE certificates SET sort_order = ${targetItem.sort_order} WHERE id = ${currentItem.id}`;
      await sql`UPDATE certificates SET sort_order = ${currentItem.sort_order} WHERE id = ${targetItem.id}`;
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
