import { NavLinks } from "@/lib/Menus/navMenu";
import { footerLinks } from "@/lib/Menus/footerMenu";

const siteUrl = process.env.NEXT_PUBLIC_DOMAIN_URL || "https://lokoji.com";
const desc = "المنصة الرائدة لمتابعة الاقتصاد والأسواق المالية المصرية";

// ── WebSite Schema ───────────────────────────────────────────────────────────
export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${siteUrl}/#website`,
  url: siteUrl,
  name: "لوكوجي",
  alternateName: ["Lokoji", "ⲗⲟⲕⲟϫⲓ"],
  inLanguage: "ar",
  potentialAction: {
    "@type": "SearchAction",
    target: `${siteUrl}/search-results?search={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

// ── WebPage Schema ───────────────────────────────────────────────────────────
export const webpageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": siteUrl,
  url: siteUrl,
  name: "لوكوجي :: نبض السوق",
  description: desc,
  inLanguage: "ar",
  isPartOf: {
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    url: siteUrl,
    name: "لوكوجي",
    description: desc,
  },
  primaryImageOfPage: {
    "@type": "ImageObject",
    url: `${siteUrl}/og-image.png`,
  },
};

// ── Organization Schema ──────────────────────────────────────────────────────
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${siteUrl}/#organization`,
  name: "لوكوجي",
  url: siteUrl,
  logo: {
    "@type": "ImageObject",
    url: `${siteUrl}/Logo.svg`,
  },
  sameAs: [
    "https://facebook.com/lokoji.eco",
    "https://twitter.com/LokojiEco",
    "https://t.me/lokoji_eco",
  ],
};

// ── Breadcrumb Schema ────────────────────────────────────────────────────────
export function generateBreadcrumbSchema() {
  // Flatten NavLinks — include top-level links + all subLinks
  const items: { name: string; link: string }[] = [];

  NavLinks.forEach((nav) => {
    if (nav.link) {
      items.push({ name: nav.title, link: nav.link });
    }
    nav.subLinks?.forEach((sub) => {
      items.push({ name: sub.title, link: sub.link });
    });
  });

  // Append footer links
  footerLinks.forEach((f) => {
    items.push({ name: f.label, link: f.href });
  });

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.link.startsWith("http") ? item.link : `${siteUrl}${item.link}`,
    })),
  };
}
