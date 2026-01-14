/**
 * Utilería para limpiar texto de Markdown.
 * Útil para previsualizaciones de texto.
 */
export function removeMarkdown(md: string): string {
  if (!md) return "";

  return md
    // Eliminar encabezados (### Titulo)
    .replace(/^#+\s+/gm, "")
    // Eliminar negritas y cursivas (**strong**, *em*, __strong__, _em_)
    .replace(/(\*\*|__)(.*?)\1/g, "$2")
    .replace(/(\*|_)(.*?)\1/g, "$2")
    // Eliminar tachado (~~strike~~)
    .replace(/~~(.*?)~~/g, "$1")
    // Eliminar bloques de código (```code```)
    .replace(/```[\s\S]*?```/g, "")
    // Eliminar código en línea (`code`)
    .replace(/`(.*?)`/g, "$1")
    // Eliminar enlaces ([text](url)) - mantiene el texto
    .replace(/\[(.*?)\]\(.*?\)/g, "$1")
    // Eliminar imágenes (![alt](url)) - elimina todo
    .replace(/!\[.*?\]\(.*?\)/g, "")
    // Eliminar citas (> Quote)
    .replace(/^>\s+/gm, "")
    // Eliminar listas (- Item, * Item, 1. Item)
    .replace(/^(\s*([-*]|\d+\.)\s+)/gm, "")
    // Eliminar líneas horizontales (---, ***)
    .replace(/^([-*_])\1{2,}$/gm, "")
    // Limpiar saltos de línea excesivos
    .replace(/\n+/g, " ")
    .trim();
}
