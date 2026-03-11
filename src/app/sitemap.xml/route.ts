export const revalidate = 3600;

const siteUrl = process.env.NEXT_PUBLIC_DOMAIN_URL || "https://lokoji.com";

const siteMaps = [
  "sitemap-pages/sitemap.xml",
  "articles/sitemap.xml",
  "articles/images/sitemap.xml",
  "infographics/sitemap.xml",
  "eg-market/sitemap.xml",
  "world-market/sitemap.xml",
  "world-stocks/sitemap.xml",
  "etfs/sitemap.xml",
  "crypto/sitemap.xml",
];

export async function GET() {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${siteMaps
  .map(
    (s) => `  <sitemap>
    <loc>${siteUrl}/${s}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>`,
  )
  .join("\n")}
</sitemapindex>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": `s-maxage=${revalidate}`,
    },
  });
}
