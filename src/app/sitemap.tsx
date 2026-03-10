import { MetadataRoute } from "next";

export const revalidate = 3600;

const siteUrl = process.env.NEXT_PUBLIC_DOMAIN_URL || "https://lokoji.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const links: MetadataRoute.Sitemap = [];
  
  const siteMaps = [
    { url: "/sitemap-pages/sitemap.xml", priority: 1.0, freq: "daily" },
    { url: "/articles/sitemap.xml", priority: 0.9, freq: "daily" },
    { url: "/articles/images/sitemap.xml", priority: 0.9, freq: "daily" },
    { url: "/infographics/sitemap.xml", priority: 0.9, freq: "daily" },
    { url: "/eg-market/sitemap.xml", priority: 0.9, freq: "hourly" },
    { url: "/world-market/sitemap.xml", priority: 0.9, freq: "hourly" },
    { url: "/world-stocks/sitemap.xml", priority: 0.9, freq: "hourly" },
    { url: "/etfs/sitemap.xml", priority: 0.9, freq: "hourly" },
    { url: "/crypto/sitemap.xml", priority: 0.8, freq: "hourly" },
  ] as const;

  siteMaps.forEach(({ url, priority, freq }) => {
    links.push({
      url: siteUrl + url,
      lastModified: new Date(),
      changeFrequency: freq,
      priority,
    });
  });

  const seen = new Set<string>();
  return links.filter(({ url }) => {
    if (seen.has(url)) return false;
    seen.add(url);
    return true;
  });
}
