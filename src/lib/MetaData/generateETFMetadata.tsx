import { Metadata } from "next";
import { getETFs } from "@/lib/Data/etfData";

export type ETFParams = Promise<{ slug: string }>;

export async function generateETFMetadata({
  params,
}: {
  params: ETFParams;
}): Promise<Metadata> {
  const { slug } = await params;
  const siteUrl = process.env.NEXT_PUBLIC_DOMAIN_URL || "https://lokoji.com";
  const canonical = siteUrl + "/etfs/" + slug;

  const imageUrl = "/main.webp"
  const imageAlt = "Lokoji - Market Pulse"
  const imageWidth = 1200
  const imageHeight = 630

  try {
    const etfs = await getETFs();
    const item = etfs.find((e) => e.slug === slug);

    if (!item) return { title: "صندوق غير موجود" };

    const title = item.title;
    const description = `تابع أداء ${item.titleEn} — السعر الحالي والتغيير اليومي على البورصة.`;

    return {
      title,
      description,
      alternates: { canonical },
      openGraph: {
        title,
        description,
        url: canonical,
        siteName: "لوكوجي",
        type: "website",
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
        title,
        description,
      },
    };
  } catch {
    return { title: "صناديق الاستثمار" };
  }
}
