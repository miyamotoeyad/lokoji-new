import { parseContentfulContentImage } from "../ContentfulImage";
import { TypeArticlesSkeleton } from "@/types";
import { client } from "../contentful";
import { Entry } from "contentful";

export type BlogPostEntry = Entry<TypeArticlesSkeleton, undefined, string>;

export const getArticle = async (slug: string) => {
  const res = await client.getEntries<TypeArticlesSkeleton>({
    content_type: "articles",
    "fields.slug": slug,
  });

  return res.items[0];
};

// 2. All Articles Function
export default async function getArticles() {
  // Optional: keep the artificial delay for testing skeletons/loading states
  await new Promise((resolve) => setTimeout(resolve, 300));

  const res = await client.getEntries<TypeArticlesSkeleton>({
    content_type: "articles",
    // Good practice: order by date descending so newest is first
    order: ["-fields.publicationDate"],
  });

  return res.items;
}

// 3. Parser (Keep this for when you want to clean up the data)
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
