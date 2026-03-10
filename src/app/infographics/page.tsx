import { generateStaticMetadata } from "@/lib/MetaData/generateStaticMetadata";
import { Metadata } from "next";
import {
  RiBarChartBoxLine,
  RiPieChartLine,
  RiNewspaperLine,
} from "react-icons/ri";
import { Asset, AssetFile } from "contentful";
import {
  getInfographics,
  InfographicEntry,
} from "@/utils/Content/getInfograhic";
import InfographicGrid, { InfographicCardData } from "./InfographicGrid";
import Script from "next/script";
import { getJsonLdInfographicListing } from "@/lib/Schemas/getJsonLd";

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

        <section className="bg-dprimary dark:bg-card rounded-3xl p-10 md:p-14 text-white text-center relative overflow-hidden">
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-primary-brand/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-primary-brand/10 rounded-full blur-3xl pointer-events-none" />
          <RiPieChartLine
            className="absolute -top-8 -left-8 text-white/5 pointer-events-none"
            size={200}
          />
          <div className="relative z-10 max-w-xl mx-auto space-y-6">
            <div className="w-12 h-12 bg-primary-brand/20 rounded-2xl flex items-center justify-center mx-auto">
              <RiNewspaperLine className="text-primary-brand" size={24} />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl text-white font-black mb-3">
                اشترك في النشرة المصورة
              </h2>
              <p className="text-white/50 font-medium text-sm leading-relaxed">
                احصل على أهم إنفوجرافيك أسبوعي مباشرة على بريدك الإلكتروني.
              </p>
            </div>
            <div className="flex flex-col md:flex-row gap-3">
              <input
                type="email"
                placeholder="بريدك الإلكتروني"
                className="flex-1 bg-white/10 border-2 border-white/10 focus:border-primary-brand rounded-2xl px-5 py-3.5 text-white text-sm font-bold outline-none placeholder:text-white/30 transition-all duration-300"
              />
              <button className="cursor-pointer bg-primary-brand hover:bg-primary-brand/90 text-white px-8 py-3.5 rounded-2xl font-black text-sm transition-all duration-200 shadow-lg shadow-primary-brand/30 active:scale-95 shrink-0">
                اشترك الآن
              </button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
