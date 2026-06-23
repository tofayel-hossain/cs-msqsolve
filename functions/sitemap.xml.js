// Dynamic XML Sitemap for SEO drip feeding
// Path: /sitemap.xml

export async function onRequestGet(context) {
  try {
    const { env, request } = context;
    const { DB } = env;

    const url = new URL(request.url);
    const domain = `${url.protocol}//${url.host}`;

    // Query only currently active (released) posts from D1
    const { results } = await DB.prepare(
      "SELECT slug, published_at FROM posts WHERE status = 'published' AND published_at <= datetime('now') ORDER BY published_at DESC"
    ).all();

    // Build the XML response body
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // 1. Static Pages
    xml += `  <url>\n    <loc>${domain}/</loc>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;
    xml += `  <url>\n    <loc>${domain}/blogs</loc>\n    <changefreq>daily</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;

    // 2. Dynamic Study MCQs (Drip-fed)
    if (results && results.length > 0) {
      results.forEach((post) => {
        const lastMod = post.published_at ? post.published_at.split(' ')[0] : '2026-06-23';
        xml += `  <url>\n`;
        xml += `    <loc>${domain}/exam/${post.slug}</loc>\n`;
        xml += `    <lastmod>${lastMod}</lastmod>\n`;
        xml += `    <changefreq>weekly</changefreq>\n`;
        xml += `    <priority>0.8</priority>\n`;
        xml += `  </url>\n`;
      });
    }

    xml += `</urlset>`;

    // Return the response as xml format
    return new Response(xml, {
      headers: {
        "Content-Type": "application/xml; charset=UTF-8",
        "Cache-Control": "public, max-age=3600"
      }
    });
  } catch (err) {
    return new Response(`Error generating sitemap: ${err.message}`, {
      status: 500,
      headers: { "Content-Type": "text/plain" }
    });
  }
}
