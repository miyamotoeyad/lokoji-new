import {
  RiArrowUpSFill,
  RiArrowDownSFill,
  RiBarChartGroupedLine,
  RiFlashlightLine,
  RiRefreshLine,
  RiFlashlightFill,
} from "@remixicon/react";
import Link from "next/link";
import { getEgyptianMarketData, type EGStock } from "@/lib/Data/egMarketData";
import { generateStaticMetadata } from "@/lib/MetaData/generateStaticMetadata";
import { getJsonLdEGXListing } from "@/lib/Schemas/getJsonLd";
import { Metadata } from "next";
import EGMarketTable from "@/components/Market/EGMarketTable";

export const metadata: Metadata = generateStaticMetadata({
  title: "البورصة المصرية | متابعة حية للأسهم",
  description:
    "تابع أسعار الأسهم والشركات المدرجة في البورصة المصرية لحظة بلحظة.",
  url: "/eg-market",
});

export default async function MarketPage() {
  const stocks = await getEgyptianMarketData();
  const now = new Date().toLocaleTimeString("ar-EG");
  const top5 = stocks.slice(0, 5);

  const sectors = [
    "الكل",
    ...Array.from(new Set(stocks.map((s) => s.sector).filter(Boolean))),
  ];

  const stocksForSchema = stocks.map((s) => ({
    code: s.code,
    titleAr: s.titleAr,
    titleEn: s.titleEn,
    price: s.price,
    changePercent: s.changePercent,
    positive: s.positive,
    volume: s.volume,
    slug: s.slug,
  }));

  return (
    <>
      <main className="container mx-auto px-4 py-10 space-y-12" dir="rtl">
        {/* ── PAGE HEADER ── */}
        <div className="pb-8 border-b border-border">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-primary-brand/10 flex items-center justify-center text-primary-brand">
              <RiBarChartGroupedLine size={20} />
            </div>
            <span className="text-xs font-black text-muted-foreground uppercase tracking-widest">
              EGX
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-foreground tracking-tight mb-2">
            البورصة المصرية
          </h1>
          <p className="text-muted-foreground text-base md:text-lg font-medium">
            تابع معانا أسعار أسهم الشركات المصرية لحظة بلحظة.
          </p>
        </div>

        {/* ── TOP 5 FEATURED ── */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <span className="w-1 h-7 bg-primary-brand rounded-full block shrink-0" />
            <div className="w-8 h-8 rounded-xl bg-primary-brand/10 flex items-center justify-center text-primary-brand">
              <RiFlashlightLine size={16} />
            </div>
            <h2 className="text-xl font-black text-foreground">
              الأكثر نشاطاً
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {top5.map((stock: EGStock) => (
              <Link
                key={stock.id}
                href={`/eg-market/${stock.slug}`}
                className="group bg-card border border-border p-4 rounded-3xl hover:border-primary-brand/40 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 flex flex-col gap-3"
              >
                <div className="flex items-center justify-between">
                  <span
                    className="text-[10px] font-black text-primary-brand bg-primary-brand/10 px-2.5 py-1 rounded-full"
                    dir="ltr"
                  >
                    {stock.code}
                  </span>
                  <div
                    className={`inline-flex items-center gap-0.5 px-2 py-1 rounded-full text-[10px] font-black ${
                      stock.positive
                        ? "bg-green-500/10 text-green-500"
                        : "bg-destructive/10 text-destructive"
                    }`}
                    dir="ltr"
                  >
                    {stock.positive ? (
                      <RiArrowUpSFill size={11} />
                    ) : (
                      <RiArrowDownSFill size={11} />
                    )}
                    {Math.abs(stock.changePercent).toFixed(2)}%
                  </div>
                </div>

                <p className="font-bold text-xs text-muted-foreground group-hover:text-primary-brand transition-colors line-clamp-2 leading-snug flex-1">
                  {stock.titleAr}
                </p>

                <p
                  className="text-lg md:text-xl font-black text-foreground tabular-nums"
                  dir="ltr"
                >
                  {stock.price.toLocaleString("en-US", {
                    maximumFractionDigits: 2,
                  })}
                  <span className="text-[10px] text-muted-foreground font-bold mr-1">
                    EGP
                  </span>
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* ── FULL TABLE ── */}
        <section>
          <EGMarketTable stocks={stocks} sectors={sectors} />
        </section>

        {/* ── DISCLAIMER ── */}
        <div className="bg-card border border-border rounded-3xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-2xl bg-primary-brand/10 flex items-center justify-center text-primary-brand shrink-0 mt-0.5">
              <RiFlashlightFill size={18} />
            </div>
            <div>
              <p className="text-sm font-black text-foreground mb-1">
                مصادر البيانات
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                البيانات من{" "}
                <span className="font-bold text-foreground">Yahoo Finance</span>{" "}
                · تُحدَّث كل 30 دقيقة · للأغراض الإعلامية فقط · ليست نصيحة
                استثمارية.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <RiRefreshLine size={11} className="text-muted-foreground" />
            <span className="text-[10px] text-muted-foreground font-bold">
              آخر تحديث: {now}
            </span>
          </div>
        </div>
      </main>

      {/* ── JSON-LD ── */}
      <script
        type="application/ld+json"
        id="egx-listing-schema"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getJsonLdEGXListing(stocksForSchema)),
        }}
      />
    </>
  );
}
