import getArticles from "@/utils/Content/getArticles";
import { MetadataRoute } from "next";

export const revalidate = 3600;

const siteUrl = process.env.NEXT_PUBLIC_DOMAIN_URL || "https://lokoji.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [contentfulRes] = await Promise.all([getArticles()]);
  const links: MetadataRoute.Sitemap = [];

  contentfulRes.forEach((post) => {
    const fields = post.fields as Record<string, unknown>;
    const slug = fields.slug as string | undefined;
    if (!slug) return;
    links.push({
      url: siteUrl + "/post/" + slug,
      lastModified: new Date(post.sys.updatedAt),
      changeFrequency: "weekly",
      priority: 0.8,
    });
  });

  const seen = new Set<string>();
  return links.filter(({ url }) => {
    if (seen.has(url)) return false;
    seen.add(url);
    return true;
  });
}
