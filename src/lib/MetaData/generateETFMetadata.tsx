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
  const canonical = `${siteUrl}/etfs/${slug}`;

  try {
    const etfs = await getETFs();
    const item = etfs.find((e) => e.slug === slug);

    if (!item) return { title: "صندوق غير موجود" };

    return {
      title: `${item.title}`,
      description: `تابع أداء ${item.titleEn} — السعر الحالي والتغيير اليومي على البورصة.`,
      alternates: { canonical },
      openGraph: {
        title: `${item.title}`,
        description: `تابع أداء ${item.titleEn} — السعر الحالي والتغيير اليومي.`,
        url: canonical,
        siteName: "لوكوجي",
        type: "website",
      },
      twitter: {
        card: "summary",
        title: `${item.title}`,
        description: `تابع أداء ${item.titleEn} — السعر الحالي والتغيير اليومي.`,
      },
    };
  } catch {
    return { title: "صناديق الاستثمار" };
  }
}
