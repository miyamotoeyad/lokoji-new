"use server";

import { client } from "@/utils/contentful";
import { TypeArticlesSkeleton } from "@/types";

export async function getNextArticles(currentSlug: string, limit = 5) {
  const res = await client.getEntries<TypeArticlesSkeleton>({
    content_type: "articles",
    order: ["-fields.publicationDate" as never],
    "fields.slug[ne]": currentSlug,
    limit,
  });

  return res.items;
}