const siteUrl = process.env.NEXT_PUBLIC_DOMAIN_URL || "https://lokoji.com";

export const lokojiOrganization = {
  "@context": "https://schema.org",
  "@type":    "NewsMediaOrganization",
  "@id":      `${siteUrl}/#organization`,
  name:       "لوكوجي",
  alternateName: ["Lokoji", "ⲗⲟⲕⲟϫⲓ"],
  url:        siteUrl,

  logo: {
    "@type":   "ImageObject",
    url:       `${siteUrl}/Logo.svg`,
    caption:   "لوكوجي — نبض السوق",
  },

  sameAs: [
    "https://facebook.com/lokoji.eco",
    "https://twitter.com/LokojiEco",
    "https://t.me/lokoji_eco",
  ],

  address: {
    "@type":          "PostalAddress",
    addressLocality:  "Cairo",
    addressCountry:   "EG",
  },

  foundingDate: "2024",

  founder: {
    "@type": "Person",
    name:    "لوكوجي",
  },

  contactPoint: {
    "@type":       "ContactPoint",
    contactType:   "الدعم والتواصل",
    url:           `${siteUrl}/contact`,
  },

  inLanguage:  "ar",
  areaServed:  "EG",
  description: "المنصة الرائدة لمتابعة الاقتصاد والأسواق المالية المصرية — نترجم الأرقام إلى رؤى بسيطة.",
};