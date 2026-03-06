import { MetadataRoute } from "next";
import { client } from "@/utils/contentful";
import { getETFs } from "@/lib/Data/etfData";
import { getEgyptianMarketData } from "@/lib/Data/egMarketData";
import { NavLinks } from "@/lib/Menus/navMenu";

export const revalidate = 3600; // revalidate every hour

const siteUrl = process.env.NEXT_PUBLIC_DOMAIN_URL || "https://lokoji.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // ── Fetch dynamic data in parallel ──────────────────────────────────────
  const [contentfulRes, etfs, stocks] = await Promise.all([
    client.getEntries({ content_type: "articles", limit: 1000 }),
    getETFs(),
    getEgyptianMarketData(),
  ]);

  const links: MetadataRoute.Sitemap = [];

  // ── Static core pages ────────────────────────────────────────────────────
  const staticPages = [
    { url: "/", priority: 1.0, freq: "daily" },
    { url: "/articles", priority: 0.9, freq: "daily" },
    { url: "/eg-market", priority: 0.9, freq: "hourly" },
    { url: "/etfs", priority: 0.9, freq: "hourly" },
    { url: "/commodities", priority: 0.8, freq: "hourly" },
    { url: "/exchange", priority: 0.8, freq: "hourly" },
    { url: "/crypto", priority: 0.8, freq: "hourly" },
    { url: "/infographics", priority: 0.7, freq: "weekly" },
    { url: "/about", priority: 0.6, freq: "monthly" },
    { url: "/contact", priority: 0.6, freq: "monthly" },
    { url: "/support", priority: 0.5, freq: "monthly" },
    { url: "/privacy-policy", priority: 0.4, freq: "monthly" },
    { url: "/search-results", priority: 0.4, freq: "monthly" },
  ] as const;

  staticPages.forEach(({ url, priority, freq }) => {
    links.push({
      url: `${siteUrl}${url}`,
      lastModified: new Date(),
      changeFrequency: freq,
      priority,
    });
  });

  // ── NavLinks — auto-sync any future pages ────────────────────────────────
  NavLinks.forEach((nav) => {
    if (nav.link && nav.link !== "/") {
      nav.subLinks?.forEach((sub) => {
        links.push({
          url: `${siteUrl}${sub.link}`,
          lastModified: new Date(),
          changeFrequency: "hourly",
          priority: 0.8,
        });
      });
    }
  });

  // ── Contentful articles → /post/[slug] ───────────────────────────────────
  contentfulRes.items.forEach((post) => {
    const fields = post.fields as Record<string, unknown>;
    const slug = fields.slug as string | undefined;
    if (!slug) return;
    links.push({
      url: `${siteUrl}/post/${slug}`,
      lastModified: new Date(post.sys.updatedAt),
      changeFrequency: "weekly",
      priority: 0.8,
    });
  });

  // ── ETF detail pages → /etfs/[slug] ─────────────────────────────────────
  etfs.forEach((etf) => {
    links.push({
      url: `${siteUrl}/etfs/${etf.slug}`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.7,
    });
  });

  // ── EGX stock pages → /eg-market/[slug] ─────────────────────────────────
  stocks.forEach((stock) => {
    links.push({
      url: `${siteUrl}/eg-market/${stock.slug}`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.7,
    });
  });

  // Deduplicate by URL
  const seen = new Set<string>();
  return links.filter(({ url }) => {
    if (seen.has(url)) return false;
    seen.add(url);
    return true;
  });
}
