import { getInfographicSlugs } from "@/utils/Content/getInfograhic";
import { MetadataRoute } from "next";

export const revalidate = 3600;

const siteUrl = process.env.NEXT_PUBLIC_DOMAIN_URL || "https://lokoji.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
const infographicSlugs = await getInfographicSlugs();

  const infographicUrls: MetadataRoute.Sitemap = infographicSlugs.map((slug) => ({
    url: `${siteUrl}/infographics/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const seen = new Set<string>();
  return infographicUrls.filter(({ url }) => {
    if (seen.has(url)) return false;
    seen.add(url);
    return true;
  });
}