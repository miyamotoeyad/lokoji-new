import { Metadata } from "next";
import { getEgyptianMarketData } from "@/lib/Data/egMarketData";

export type StockParams = Promise<{ slug: string }>;

export async function generateStockMetadata({
  params,
}: {
  params: StockParams;
}): Promise<Metadata> {
  const { slug } = await params;
  const siteUrl = process.env.NEXT_PUBLIC_DOMAIN_URL || "https://lokoji.com";
  const canonical = `${siteUrl}/eg-market/${slug}`;

  try {
    const stocks = await getEgyptianMarketData();
    const stock = stocks.find((s) => s.slug === slug);

    if (!stock) return { title: "شركة غير معروفة" };

    return {
      title: `${stock.titleAr}`,
      description: `تابع أداء سهم ${stock.titleEn} في البورصة المصرية — السعر الحالي والتغيير اليومي.`,
      alternates: { canonical },
      openGraph: {
        title: `${stock.titleAr}`,
        description: `تابع أداء سهم ${stock.titleEn} في البورصة المصرية — السعر الحالي والتغيير اليومي.`,
        url: canonical,
        siteName: "لوكوجي",
        type: "website",
      },
      twitter: {
        card: "summary",
        title: `${stock.titleAr} (${stock.code})`,
        description: `تابع أداء سهم ${stock.titleEn} في البورصة المصرية — السعر الحالي والتغيير اليومي.`,
      },
    };
  } catch {
    return { title: "البورصة المصرية" };
  }
}
