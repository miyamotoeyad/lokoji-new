import { Metadata } from "next";

export type SearchParams = Promise<{ search?: string }>;

export async function generateSearchMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  const { search } = await searchParams;
  const query = search?.trim() || "";

  const title = query ? `نتائج البحث: "${query}"` : "نتائج البحث";
  const description = query
    ? `نتائج البحث عن "${query}" في لوكوجي — مقالات، أسهم، عملات، وسلع.`
    : "نتائج البحث في لوكوجي — مقالات، أسهم، عملات، وسلع.";
  const imageUrl = "/main.webp"
  const imageAlt = "Lokoji - Market Pulse"
  const imageWidth = 1200
  const imageHeight = 630
  const canonical = `/search-results?search=${encodeURIComponent(query)}`;

  return {
    title,
    description,
    robots: { index: false, follow: false }, // ✅ don't index search result pages
    alternates: {
      canonical
    },
    openGraph: {
        title,
        description,
        url: canonical,
        images: {
          url: imageUrl,
          width: imageWidth,
          height: imageHeight,
          alt: imageAlt,
          type: "image/png",
        },
        siteName: "لوكوجي",
        type: "website",
      },
  };
}
