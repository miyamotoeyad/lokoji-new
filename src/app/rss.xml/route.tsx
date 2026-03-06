import { client } from "@/utils/contentful";
import RSS from "rss";

const siteUrl = process.env.NEXT_PUBLIC_DOMAIN_URL || "https://lokoji.com";

function buildFeed(title: string, description: string, feedSlug: string) {
  return new RSS({
    title,
    description,
    site_url: siteUrl,
    feed_url: `${siteUrl}/${feedSlug}`,
    language: "ar",
    image_url: `${siteUrl}/og-image.png`,
    copyright: `كل الحقوق محفوظة ${new Date().getFullYear()} — لوكوجي`,
    pubDate: new Date(),
  });
}

type ContentfulPost = {
  fields: {
    title: string;
    subtitle?: string;
    slug: string;
    category?: string | string[];
    image?: { fields: { file: { url: string } } };
    author?: { fields: { name: string } };
  };
  sys: { createdAt: string };
};

function addItem(feed: RSS, post: ContentfulPost) {
  const imageUrl = post.fields.image?.fields?.file?.url
    ? `https:${post.fields.image.fields.file.url}`
    : `${siteUrl}/og-image.png`;

  feed.item({
    title: post.fields.title ?? "بدون عنوان",
    description: post.fields.subtitle ?? "",
    url: `${siteUrl}/post/${post.fields.slug}`,
    date: post.sys.createdAt,
    author: post.fields.author?.fields?.name ?? "لوكوجي",
    enclosure: {
      url: imageUrl,
      length: 1000,
      type: "image/jpeg",
    },
  });
}

export async function GET() {
  const res = await client.getEntries({
    content_type: "articles",
    order: ["-sys.createdAt"],
    limit: 500,
  });

  const articles = res.items as unknown as ContentfulPost[];

  // ── Main feed — all articles ─────────────────────────────────────────────
  const mainFeed = buildFeed(
    "لوكوجي — كل المقالات",
    "تابع أحدث تحليلات الاقتصاد والأسواق المالية",
    "rss.xml",
  );
  articles.forEach((post) => addItem(mainFeed, post));

  const xml = mainFeed.xml({ indent: true });

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
