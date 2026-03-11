import { generateStaticMetadata } from "@/lib/MetaData/generateStaticMetadata";
import { Metadata } from "next";
import {
  RiBarChartBoxLine,
} from "@remixicon/react";
import { Asset, AssetFile } from "contentful";
import {
  getInfographics,
  InfographicEntry,
} from "@/utils/Content/getInfograhic";
import InfographicGrid, { InfographicCardData } from "./InfographicGrid";
import Script from "next/script";
import { getJsonLdInfographicListing } from "@/lib/Schemas/getJsonLd";
import NewsletterInfographic from "@/components/Client/Newsletter/NewsletterInfographic";

const title = "إنفوجرافيك لوكوجي";
const description =
  "تبسيط البيانات الاقتصادية المعقدة من خلال رسوم بيانية وتوضيحية سهلة الفهم.";

export const metadata: Metadata = generateStaticMetadata({
  title,
  description,
  url: "/infographics",
});

// Serialize here in the server component — plain objects only cross the boundary
function serializeInfographic(entry: InfographicEntry): InfographicCardData {
  const images = entry.fields.images as unknown as Asset[];
  const file = images?.[0]?.fields?.file as AssetFile | undefined;
  const imageUrl = file?.url
    ? `https:${file.url}?w=600&fm=webp&q=75&fit=fill`
    : "/no-image.png";

  return {
    id: entry.sys.id,
    slug: entry.fields.slug as string,
    title: entry.fields.title as string,
    category: entry.fields.category as string,
    date: new Date(entry.fields.publicationDate).toLocaleDateString("ar-EG", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    imageUrl,
  };
}

export default async function InfographicsPage() {
  const infographics = await getInfographics();
  const serialized = infographics.map(serializeInfographic); // ← plain objects ✅

  return (
    <>
      <Script
        id="infographic-listing-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getJsonLdInfographicListing),
        }}
      />
      <main className="container mx-auto px-4 py-10 space-y-16" dir="rtl">
        <header className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-brand/10 border border-primary-brand/20 text-primary-brand text-xs font-black">
            <RiBarChartBoxLine size={16} />
            <span>مركز البيانات المرئية</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground leading-tight">
            الاقتصاد..{" "}
            <span className="text-primary-brand">بالأرقام والصور</span>
          </h1>
          <p className="text-muted-foreground text-lg font-medium leading-relaxed">
            نحول الأرقام الصعبة إلى تقارير بصرية بسيطة تساعدك على اتخاذ قرار
            استثماري أفضل في ثوانٍ.
          </p>
        </header>

        <InfographicGrid infographics={serialized} />

        <NewsletterInfographic />
      </main>
    </>
  );
}
