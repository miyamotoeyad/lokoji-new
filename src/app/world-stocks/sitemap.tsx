import { WORLD_STOCKS_CONFIG } from "@/lib/Array/WorldCompanyList";
import { MetadataRoute } from "next";

export const revalidate = 3600;

const siteUrl = process.env.NEXT_PUBLIC_DOMAIN_URL || "https://lokoji.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const links: MetadataRoute.Sitemap = [];

  WORLD_STOCKS_CONFIG.forEach(({ slug }) => {
    links.push({
      url: siteUrl+ "/world-stocks/" + slug,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.7,
    });
  });

  const seen = new Set<string>();
  return links.filter(({ url }) => {
    if (seen.has(url)) return false;
    seen.add(url);
    return true;
  });
}
