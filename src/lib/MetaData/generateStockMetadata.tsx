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

  const canonical = siteUrl + "/eg-market/" + slug;
  const imageUrl = "/main.webp";
  const imageAlt = "Lokoji - Market Pulse";
  const imageWidth = 1200;
  const imageHeight = 630;
  
  try {
    const stocks = await getEgyptianMarketData();
    const stock = stocks.find((s) => s.slug === slug);
    
    if (!stock) return { title: "شركة غير معروفة" };
    const title = stock.titleAr;
    const description = `تابع أداء سهم ${stock.titleEn} في البورصة المصرية — السعر الحالي والتغيير اليومي.`;

    return {
      title,
      description,
      alternates: { canonical },
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
      twitter: {
        card: "summary",
        title,
        description,
      },
    };
  } catch {
    return { title: "البورصة المصرية" };
  }
}
