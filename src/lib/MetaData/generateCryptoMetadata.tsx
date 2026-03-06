import { Metadata } from "next";

export type CryptoParams = Promise<{ slug: string }>;

export async function generateCryptoMetadata({
  params,
}: {
  params: CryptoParams;
}): Promise<Metadata> {
  const { slug } = await params;
  const siteUrl = process.env.NEXT_PUBLIC_DOMAIN_URL || "https://lokoji.com";
  const canonical = `${siteUrl}/crypto/${slug}`;
  const currency = slug.toUpperCase();

  return {
    title: `سعر عملة ${currency} المباشر | لوكوجي`,
    description: `تحليل مباشر لعملة ${currency} مع الرسوم البيانية والمعلومات المالية الدقيقة.`,
    alternates: { canonical },
    openGraph: {
      title: `سعر عملة ${currency} المباشر | لوكوجي`,
      description: `تحليل مباشر لعملة ${currency} مع الرسوم البيانية والمعلومات المالية الدقيقة.`,
      url: canonical,
      siteName: "لوكوجي",
      type: "website",
    },
    twitter: {
      card: "summary",
      title: `سعر عملة ${currency} | لوكوجي`,
      description: `تحليل مباشر لعملة ${currency} مع الرسوم البيانية والمعلومات المالية الدقيقة.`,
    },
  };
}
