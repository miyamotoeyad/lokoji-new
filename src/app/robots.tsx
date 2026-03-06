import type { MetadataRoute } from 'next'

const siteUrl =
  process.env.PUBLIC_DOMAIN_URL || "https://lokoji.vercel.app/";
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/unused/',
    },
    host: siteUrl,
    sitemap: [siteUrl + '/sitemap.xml', siteUrl + '/rss.xml'],
  }
}