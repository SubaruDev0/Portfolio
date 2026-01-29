// Use environment variable or fallback to domain
const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://subarudev.com';

const staticPages = [
  '/',
  '/#proyectos-anchor',
  '/#sobre-mi',
  '/#certificaciones-anchor',
  '/#contacto',
  '/admin'
];

export async function GET() {
  const sitemapEntries = staticPages.map((path) => {
    return `  <url>\n    <loc>${BASE}${path}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>`;
  }).join('\n');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapEntries}\n</urlset>`;

  return new Response(sitemap, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=0, s-maxage=3600'
    }
  });
}
