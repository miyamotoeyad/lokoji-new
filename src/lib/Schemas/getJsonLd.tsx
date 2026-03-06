import { Asset, AssetFile, Entry } from "contentful";
import { TypeArticlesSkeleton, TypeAuthorsSkeleton } from "@/types";
import { lokojiOrganization } from "./organizationSchema";

const siteUrl = process.env.NEXT_PUBLIC_DOMAIN_URL || "https://lokoji.com";

// ── Helper: extract image URL from Contentful Asset ──────────────────────────
function getContentfulImageUrl(image: unknown): string {
  if (!image || typeof image !== "object" || !("fields" in image))
    return `${siteUrl}/og-image.png`;
  const asset = image as Asset<undefined, string>;
  const file = asset.fields.file as AssetFile | undefined;
  return file?.url ? `https:${file.url}` : `${siteUrl}/og-image.png`;
}

// ── Helper: extract author name safely ───────────────────────────────────────
function getAuthorName(author: unknown): string {
  if (!author || typeof author !== "object" || !("fields" in author))
    return "لوكوجي";
  const fields = (author as Entry<TypeAuthorsSkeleton>).fields;
  return typeof fields.name === "string" ? fields.name : "لوكوجي";
}

function getAuthorSlug(author: unknown): string {
  if (!author || typeof author !== "object" || !("fields" in author)) return "";
  const fields = (author as Entry<TypeAuthorsSkeleton>).fields;
  return typeof fields.slug === "string" ? fields.slug : "";
}

// ── Article JSON-LD ──────────────────────────────────────────────────────────
export function getJsonLdArticle(
  post: Entry<TypeArticlesSkeleton, undefined, string>,
) {
  const fields = post.fields;
  const imageUrl = getContentfulImageUrl(fields.image);
  const slug = fields.slug as string;
  const title = fields.title as string;
  const subtitle = (fields.subtitle as string | undefined) ?? "";
  const category = fields.category as string | string[] | undefined;
  const tags = (fields.tag as string[] | undefined) ?? [];
  const authorName = getAuthorName(fields.author);
  const authorSlug = getAuthorSlug(fields.author);
  const articleUrl = `${siteUrl}/post/${slug}`;

  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: title,
    "@id": articleUrl,
    url: articleUrl,
    datePublished: post.sys.createdAt,
    dateModified: post.sys.updatedAt,
    thumbnailUrl: imageUrl,
    articleSection: Array.isArray(category)
      ? category[0]
      : (category ?? "اقتصاد"),
    keywords: tags,
    inLanguage: "ar",

    image: {
      "@type": "ImageObject",
      url: imageUrl,
      contentUrl: imageUrl,
      width: 1200,
      height: 630,
      caption: title,
    },

    description: subtitle,

    author: {
      "@type": "Person",
      name: authorName,
      url: `${siteUrl}/authors/${authorSlug}`,
    },

    publisher: lokojiOrganization,

    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": articleUrl,
      name: title,
      description: subtitle,
      inLanguage: "ar",
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: imageUrl,
      },
      breadcrumb: {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "الرئيسية",
            item: siteUrl,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "المقالات",
            item: `${siteUrl}/articles`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: title,
            item: articleUrl,
          },
        ],
      },
    },
  };
}

// ── Image JSON-LD ────────────────────────────────────────────────────────────
export function getJsonLdImage(
  post: Entry<TypeArticlesSkeleton, undefined, string>,
) {
  const imageUrl = getContentfulImageUrl(post.fields.image);

  return {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    contentUrl: imageUrl,
    creditText: "لوكوجي",
    license: `${siteUrl}/privacy-policy`,
    acquireLicensePage: `${siteUrl}/privacy-policy`,
    creator: {
      "@type": "Organization",
      name: "لوكوجي",
    },
    copyrightNotice: `لوكوجي ${new Date().getFullYear()}`,
  };
}
