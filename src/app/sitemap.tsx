import { MetadataRoute } from "next";
import { client } from "@/utils/contentful";
import { getETFs } from "@/lib/Data/etfData";
import { getEgyptianMarketData } from "@/lib/Data/egMarketData";
import { NavLinks } from "@/lib/Menus/navMenu";
import { getCryptoData } from "@/lib/Data/getCryptoData";
import { WORLD_STOCKS_CONFIG } from "@/lib/Array/WorldCompanyList";
import { WORLD_INDICES } from "@/lib/Array/worldMarketList";

export const revalidate = 3600;

const siteUrl = process.env.NEXT_PUBLIC_DOMAIN_URL || "https://lokoji.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // ── Fetch only what actually needs a network call ────────────────────────
  const [contentfulRes, etfs, stocks, cryptoRes] = await Promise.all([
    client.getEntries({ content_type: "articles", limit: 1000 }),
    getETFs(),
    getEgyptianMarketData(),
    getCryptoData(),
  ]);

  const links: MetadataRoute.Sitemap = [];

  // ── Static core pages ────────────────────────────────────────────────────
  const staticPages = [
    { url: "/",               priority: 1.0, freq: "daily"   },
    { url: "/articles",       priority: 0.9, freq: "daily"   },
    { url: "/eg-market",      priority: 0.9, freq: "hourly"  },
    { url: "/world-market",   priority: 0.9, freq: "hourly"  },
    { url: "/world-stocks",   priority: 0.9, freq: "hourly"  },
    { url: "/etfs",           priority: 0.9, freq: "hourly"  },
    { url: "/commodities",    priority: 0.8, freq: "hourly"  },
    { url: "/exchange",       priority: 0.8, freq: "hourly"  },
    { url: "/crypto",         priority: 0.8, freq: "hourly"  },
    { url: "/infographics",   priority: 0.7, freq: "weekly"  },
    { url: "/about",          priority: 0.6, freq: "monthly" },
    { url: "/contact",        priority: 0.6, freq: "monthly" },
    { url: "/support",        priority: 0.5, freq: "monthly" },
    { url: "/privacy-policy", priority: 0.4, freq: "monthly" },
    { url: "/search-results", priority: 0.4, freq: "monthly" },
  ] as const;

  staticPages.forEach(({ url, priority, freq }) => {
    links.push({
      url:             `${siteUrl}${url}`,
      lastModified:    new Date(),
      changeFrequency: freq,
      priority,
    });
  });

  // ── NavLinks — auto-sync future pages ────────────────────────────────────
  NavLinks.forEach((nav) => {
    nav.subLinks?.forEach((sub) => {
      if (sub.link && sub.link !== "/") {
        links.push({
          url:             `${siteUrl}${sub.link}`,
          lastModified:    new Date(),
          changeFrequency: "hourly",
          priority:        0.8,
        });
      }
    });
  });

  // ── Contentful articles → /post/[slug] ───────────────────────────────────
  contentfulRes.items.forEach((post) => {
    const fields = post.fields as Record<string, unknown>;
    const slug   = fields.slug as string | undefined;
    if (!slug) return;
    links.push({
      url:             `${siteUrl}/post/${slug}`,
      lastModified:    new Date(post.sys.updatedAt),
      changeFrequency: "weekly",
      priority:        0.8,
    });
  });

  // ── ETF pages → /etfs/[slug] ─────────────────────────────────────────────
  etfs.forEach((etf) => {
    links.push({
      url:             `${siteUrl}/etfs/${etf.slug}`,
      lastModified:    new Date(),
      changeFrequency: "hourly",
      priority:        0.7,
    });
  });

  // ── EGX stock pages → /eg-market/[slug] ──────────────────────────────────
  stocks.forEach((stock) => {
    links.push({
      url:             `${siteUrl}/eg-market/${stock.slug}`,
      lastModified:    new Date(),
      changeFrequency: "hourly",
      priority:        0.7,
    });
  });

  // ── World market index pages → /world-market/[slug] ──────────────────────
  // ✅ Use static config — no network call needed, slugs never change
  WORLD_INDICES.forEach(({ slug }) => {
    links.push({
      url:             `${siteUrl}/world-market/${slug}`,
      lastModified:    new Date(),
      changeFrequency: "hourly",
      priority:        0.7,
    });
  });

  // ── World stock pages → /world-stocks/[slug] ─────────────────────────────
  // ✅ Was missing entirely — now added from static config
  WORLD_STOCKS_CONFIG.forEach(({ slug }) => {
    links.push({
      url:             `${siteUrl}/world-stocks/${slug}`,
      lastModified:    new Date(),
      changeFrequency: "hourly",
      priority:        0.7,
    });
  });

  // ── Crypto pages → /crypto/[slug] ────────────────────────────────────────
  cryptoRes.data.forEach((coin) => {
    links.push({
      url:             `${siteUrl}/crypto/${coin.slug}`,
      lastModified:    new Date(),
      changeFrequency: "hourly",
      priority:        0.7,
    });
  });

  // ── Deduplicate ───────────────────────────────────────────────────────────
  const seen = new Set<string>();
  return links.filter(({ url }) => {
    if (seen.has(url)) return false;
    seen.add(url);
    return true;
  });
}