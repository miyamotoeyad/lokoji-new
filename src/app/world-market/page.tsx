import Link from "next/link";
import { Metadata } from "next";
import {
  RiArrowUpSFill,
  RiArrowDownSFill,
  RiGlobalLine,
  RiFlashlightLine,
  RiBarChartGroupedLine,
} from "@remixicon/react";
import { getWorldMarketData } from "@/lib/Data/worldMarketData";
import { generateStaticMetadata } from "@/lib/MetaData/generateStaticMetadata";
import { getJsonLdWorldMarketListing } from "@/lib/Schemas/getJsonLd";
import WorldMarketCard from "@/components/Cards/WorldMarketCard";

export const metadata: Metadata = generateStaticMetadata({
  title: "السوق العالمي",
  description: "تابع أداء أهم المؤشرات العالمية — وول ستريت، أوروبا، وآسيا.",
  url: "/world-market",
});

// ← removed revalidate — unstable_cache in getWorldMarketData handles it

export default async function WorldMarketPage() {
  const indices = await getWorldMarketData();
  const featured = indices.slice(0, 5);

  return (
    <>
      <main className="container mx-auto px-4 py-10 space-y-12" dir="rtl">
        {/* ── PAGE HEADER ── */}
        <div className="pb-8 border-b border-border">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-primary-brand/10 flex items-center justify-center text-primary-brand">
              <RiGlobalLine size={20} />
            </div>
            <span className="text-xs font-black text-muted-foreground uppercase tracking-widest">
              الأسواق العالمية
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-foreground tracking-tight mb-2">
            السوق العالمي
          </h1>
          <p className="text-muted-foreground text-base md:text-lg font-medium">
            متابعة حية لأهم المؤشرات المالية حول العالم.
          </p>
        </div>

        {/* ── FEATURED TOP 5 ── */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <span className="w-1 h-7 bg-primary-brand rounded-full block shrink-0" />
            <div className="w-8 h-8 rounded-xl bg-primary-brand/10 flex items-center justify-center text-primary-brand">
              <RiFlashlightLine size={16} />
            </div>
            <h2 className="text-xl font-black text-foreground">
              الأكثر نشاطاً اليوم
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {featured.map((item) => (
              <WorldMarketCard key={item.id} item={item} />
            ))}
          </div>
        </section>

        {/* ── FULL TABLE ── */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="w-1 h-7 bg-primary-brand rounded-full block shrink-0" />
              <div className="w-8 h-8 rounded-xl bg-primary-brand/10 flex items-center justify-center text-primary-brand">
                <RiBarChartGroupedLine size={16} />
              </div>
              <h2 className="text-xl font-black text-foreground">
                جميع المؤشرات
              </h2>
            </div>
            <span className="text-xs font-black text-muted-foreground bg-muted px-3 py-1.5 rounded-full border border-border">
              {indices.length} مؤشر
            </span>
          </div>

          <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
            {/* Header */}
            <div className="flex items-center px-4 md:px-6 py-4 border-b border-border bg-muted/50 gap-2 md:gap-3">
              <span className="w-5 md:w-6 shrink-0 text-[11px] font-black text-muted-foreground uppercase tracking-widest text-center">
                #
              </span>
              <span className="w-8 shrink-0 hidden md:block" />{" "}
              {/* ← icon spacer desktop only */}
              <span className="flex-1 text-[11px] font-black text-muted-foreground uppercase tracking-widest text-right">
                المؤشر
              </span>
              <span className="w-32 md:w-40 shrink-0 text-[11px] font-black text-muted-foreground uppercase tracking-widest text-left">
                القيمة
              </span>
              <span className="w-16 md:w-20 shrink-0 text-[11px] font-black text-muted-foreground uppercase tracking-widest text-left">
                %
              </span>
            </div>

            {/* Rows */}
            <div className="divide-y divide-border">
              {indices.map((item, index) => (
                <Link
                  key={item.id}
                  href={`/world-market/${item.slug}`}
                  className="flex items-center px-4 md:px-6 py-3.5 hover:bg-primary-brand/5 transition-colors duration-200 group gap-2 md:gap-3"
                >
                  {/* # */}
                  <span className="w-5 md:w-6 text-xs font-black text-muted-foreground tabular-nums shrink-0 text-center">
                    {index + 1}
                  </span>

                  {/* Icon — hidden on mobile to save space */}
                  <div className="hidden md:flex w-8 h-8 rounded-xl bg-primary-brand/10 items-center justify-center text-primary-brand text-xs font-black shrink-0">
                    {item.title[0]}
                  </div>

                  {/* Name */}
                  <div className="flex-1 min-w-0 text-right">
                    <p className="text-xs md:text-sm font-bold text-foreground group-hover:text-primary-brand transition-colors truncate leading-tight">
                      {item.title}
                    </p>
                    <p
                      className="text-[10px] text-muted-foreground font-mono truncate"
                      dir="ltr"
                    >
                      {item.ticker}
                    </p>
                  </div>

                  {/* Price + change stacked */}
                  <div className="w-32 md:w-40 shrink-0 text-left" dir="ltr">
                    <p className="text-xs md:text-sm font-black text-foreground tabular-nums leading-tight">
                      {item.price.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                    <p
                      className={`text-[10px] font-bold tabular-nums ${
                        item.positive ? "text-green-500" : "text-destructive"
                      }`}
                    >
                      {item.positive ? "+" : ""}
                      {item.change.toFixed(2)}
                    </p>
                  </div>

                  {/* % pill */}
                  <div className="w-16 md:w-20 flex justify-end shrink-0">
                    <span
                      className={`inline-flex items-center gap-0.5 text-[10px] font-black px-1.5 md:px-2 py-1 rounded-full whitespace-nowrap ${
                        item.positive
                          ? "bg-green-500/10 text-green-500"
                          : "bg-destructive/10 text-destructive"
                      }`}
                      dir="ltr"
                    >
                      {item.positive ? (
                        <RiArrowUpSFill size={11} />
                      ) : (
                        <RiArrowDownSFill size={11} />
                      )}
                      {Math.abs(item.changePercent).toFixed(2)}%
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      {/* ── JSON-LD ── */}
      <script
        type="application/ld+json"
        id="world-market-schema"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getJsonLdWorldMarketListing(indices)),
        }}
      />
    </>
  );
}
