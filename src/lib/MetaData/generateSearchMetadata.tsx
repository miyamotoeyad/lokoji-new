import { Metadata } from "next";

export type SearchParams = Promise<{ search?: string }>;

export async function generateSearchMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  const { search } = await searchParams;
  const query = search?.trim() || "";

  return {
    title: `نتائج البحث: "${query}"`,
    description: `نتائج البحث عن "${query}" في لوكوجي — مقالات، أسهم، عملات، وسلع.`,
    robots: { index: false, follow: false }, // ✅ don't index search result pages
    alternates: {
      canonical: `/search-results?search=${encodeURIComponent(query)}`,
    },
  };
}
