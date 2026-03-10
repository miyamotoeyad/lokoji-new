import { ArticleSkeleton } from "@/types/contentfulType";
import { Entry } from "contentful";

// components/Articles/PaginationSchema.tsx
export function PaginationSchema({
  articles,
  currentPage,
  articlesPerPage = 9,
}: {
  articles: Entry<ArticleSkeleton, undefined, string>[];
  currentPage: number;
  articlesPerPage?: number;
}) {
  const siteUrl = process.env.NEXT_PUBLIC_DOMAIN_URL || "http://localhost:3000";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: articles.map((article, index) => ({
      "@type": "ListItem",
     position: (currentPage - 1) * articlesPerPage + index + 1, // absolute position on this page
      url: siteUrl + "/post/" + article.fields.slug,
      name: article.fields.title,
    })),
  };

  return (
    <script
      id={`pagination-schema-${currentPage}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
