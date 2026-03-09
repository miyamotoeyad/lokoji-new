import { getEgyptianMarketData } from "@/lib/Data/egMarketData";
import { MetadataRoute } from "next";

export const revalidate = 3600;

const siteUrl = process.env.NEXT_PUBLIC_DOMAIN_URL || "https://lokoji.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [egyStocks] = await Promise.all([getEgyptianMarketData()]);
  const links: MetadataRoute.Sitemap = [];

  egyStocks.forEach((stock) => {
    links.push({
      url: `${siteUrl}/eg-market/${stock.slug}`,
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
