import { getInfographics } from "@/utils/Content/getInfograhic";
import { Asset, AssetFile } from "contentful";
import { MetadataRoute } from "next";

export const revalidate = 3600;

const siteUrl = process.env.NEXT_PUBLIC_DOMAIN_URL || "https://lokoji.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const infographics = await getInfographics();

  const infographicUrls: MetadataRoute.Sitemap = infographics.map((entry) => {
    const { slug, images } = entry.fields as {
      slug: string;
      images: Asset[];
    };

    // Get first image from the images array
    const file = images?.[0]?.fields?.file as AssetFile | undefined;
    const imageUrl = file?.url
      ? `https:${file.url}?w=600&fm=webp&q=75&fit=fill`
      : null;

    return {
      url: siteUrl + "/infographics/" + slug,
      lastModified: new Date(entry.sys.updatedAt),
      changeFrequency: "monthly",
      priority: 0.7,
      ...(imageUrl && { images: [imageUrl] }),
    };
  });

  const seen = new Set<string>();
  return infographicUrls.filter(({ url }) => {
    if (seen.has(url)) return false;
    seen.add(url);
    return true;
  });
}
