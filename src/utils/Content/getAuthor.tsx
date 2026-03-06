import { TypeAuthorsSkeleton } from "@/types";
import { client } from "../contentful";
import { Entry } from "contentful";

export async function getAuthorBySlug(slug: string): Promise<Entry<TypeAuthorsSkeleton, undefined, string> | null> {
  const res = await client.getEntries<TypeAuthorsSkeleton>({
    content_type: 'authors',
    'fields.slug': slug,
    limit: 1,
  });

  return res.items[0] || null;
}

// Optimized to use Contentful's internal search instead of filtering in JS later
export async function getArticlesByAuthorName(authorName: string) {
  const res = await client.getEntries({
    content_type: 'articles',
    'fields.author.fields.name': authorName,
  });

  return res.items;
}