import { Metadata } from "next";
import { notFound } from "next/navigation";
import { client } from "@/utils/contentful";
import { Asset, AssetFile } from "contentful";

export type Params = Promise<{ slug: string }>;

type ArticleFields = {
  title: string;
  subtitle?: string;
  slug: string;
  category?: string | string[];
  image?: Asset;
  author?: { fields: { name: string } };
};

function getImageUrl(image: unknown): string {
  const asset = image as Asset;
  const file = asset?.fields?.file as AssetFile | undefined;
  return file?.url ? `https:${file.url}` : "/og-image.png";
}

export async function generateArticleMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;

  const res = await client.getEntries({
    content_type: "articles",
    "fields.slug": slug,
    limit: 1,
  });

  const post = res.items[0];
  if (!post) return notFound();

  const fields = post.fields as unknown as ArticleFields;
  const imageUrl = getImageUrl(fields.image);
  const siteUrl = process.env.NEXT_PUBLIC_DOMAIN_URL || "https://lokoji.com";
  const canonical = `${siteUrl}/post/${fields.slug}`;

  const categories = fields.category ? [fields.category].flat().join(", ") : "";

  return {
    title: `${fields.title} | لوكوجي`,
    description: fields.subtitle ?? "",

    keywords: categories,

    alternates: {
      canonical,
    },

    openGraph: {
      title: fields.title,
      description: fields.subtitle ?? "",
      type: "article",
      url: canonical,
      siteName: "لوكوجي",
      publishedTime: post.sys.createdAt,
      modifiedTime: post.sys.updatedAt,
      authors: fields.author?.fields?.name
        ? [fields.author.fields.name]
        : ["لوكوجي"],
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: fields.title,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: fields.title,
      description: fields.subtitle ?? "",
      images: [imageUrl],
    },
  };
}
