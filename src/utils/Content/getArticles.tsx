import { parseContentfulContentImage } from "../ContentfulImage";
import { TypeArticlesSkeleton } from "@/types";
import { client } from "../contentful";
import { Entry } from "contentful";
import { ArticleSkeleton } from "@/types/contentfulType";

export type BlogPostEntry = Entry<TypeArticlesSkeleton, undefined, string>;

export const getArticle = async (slug: string) => {
  const res = await client.getEntries<TypeArticlesSkeleton>({
    content_type: "articles",
    "fields.slug": slug,
  });

  return res.items[0];
};

export default async function getArticles() {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const res = await client.getEntries<TypeArticlesSkeleton>({
    content_type: "articles",
    order: ["-fields.publicationDate"],
  });

  return res.items;
}

export async function getArticlesByCategory(
  category: string,
  page = 1,
  limit = 9
) {
  const skip = (page - 1) * limit;
  const res = await client.getEntries<ArticleSkeleton>({
    content_type: "articles",
    order: ["-fields.publicationDate" as never],
    "fields.category": category as never,
    skip,
    limit,
  });

  return {
    items: res.items,
    total: res.total,
    totalPages: Math.ceil(res.total / limit),
    currentPage: page,
  };
}

export function parseContentfulArticlePost(blogPostEntry?: BlogPostEntry) {
  if (!blogPostEntry) return null;

  return {
    title: blogPostEntry.fields.title || "",
    author: blogPostEntry.fields.author?.sys?.id || "unknown",
    category: blogPostEntry.fields.category,
    subtitle: blogPostEntry.fields.subtitle || "",
    tag: blogPostEntry.fields.tag || [],
    slug: blogPostEntry.fields.slug,
    content: blogPostEntry.fields.content || null,
    image: parseContentfulContentImage(blogPostEntry.fields.image),
  };
}

export async function getArticlesPaginated(page = 1, limit = 9) {
  const skip = (page - 1) * limit;
  const res = await client.getEntries<ArticleSkeleton>({
    content_type: "articles",
    order: ["-fields.publicationDate"],
    skip,
    limit,
  });

  return {
    items: res.items,
    total: res.total,
    totalPages: Math.ceil(res.total / limit),
    currentPage: page,
  };
}