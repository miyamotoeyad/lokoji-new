import { MetadataRoute } from "next";
import { NavLinks } from "@/lib/Menus/navMenu";
import { footerLinks } from "@/lib/Menus/footerMenu";

export const revalidate = 3600;

const siteUrl = process.env.NEXT_PUBLIC_DOMAIN_URL || "https://lokoji.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const links: MetadataRoute.Sitemap = [];

  NavLinks.forEach(({ id, link, priority, freq }) => {
    if (id !== 10) {
      links.push({
        url: siteUrl + link,
        lastModified: new Date(),
        changeFrequency: freq,
        priority,
      });
    }
  });

  NavLinks.forEach(({ subLinks }) => {
    subLinks?.forEach(({ link, priority, freq }) => {
        links.push({
          url: siteUrl + link,
          lastModified: new Date(),
          changeFrequency: freq,
          priority,
        });
    });
  });

  footerLinks.forEach((nav) => {
    if (Array.isArray(nav)) {
      nav.forEach((sub) => {
        if (sub.href && sub.href !== "/") {
          links.push({
            url: siteUrl + sub.href,
            lastModified: new Date(),
            changeFrequency: "hourly",
            priority: 0.8,
          });
        }
      });
    } else if (nav.href && nav.href !== "/") {
      links.push({
        url: siteUrl + nav.href,
        lastModified: new Date(),
        changeFrequency: "hourly",
        priority: 0.8,
      });
    }
  });

  const seen = new Set<string>();
  return links.filter(({ url }) => {
    if (seen.has(url)) return false;
    seen.add(url);
    return true;
  });
}
