import { Metadata } from "next";
import { getAuthorBySlug } from "@/utils/Content/getAuthor";

export type AuthorParams = Promise<{ slug: string }>;

export async function generateAuthorMetadata({
  params,
}: {
  params: AuthorParams;
}): Promise<Metadata> {
  const { slug } = await params;
  const siteUrl = process.env.NEXT_PUBLIC_DOMAIN_URL || "https://lokoji.com";
  const canonical = `${siteUrl}/authors/${slug}`;

  const authorEntry = await getAuthorBySlug(slug);
  if (!authorEntry) return { title: "الكاتب غير موجود" };

  const name = authorEntry.fields.name as string;
  const description = authorEntry.fields.description as string;

  const imageUrl = "/main.webp"
  const imageAlt = "Lokoji - Market Pulse"
  const imageWidth = 1200
  const imageHeight = 630

  return {
    title: name,
    description,
    alternates: { canonical },
    openGraph: {
      title: name,
      description,
      url: canonical,
      siteName: "لوكوجي",
      type: "profile",
      images: {
        url: imageUrl,
        width: imageWidth,
        height: imageHeight,
        alt: imageAlt,
        type: "image/png",
      },
    },
    twitter: {
      card: "summary",
      title: `${name}`,
      description,
    },
  };
}
