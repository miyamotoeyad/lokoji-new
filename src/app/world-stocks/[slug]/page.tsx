import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import {
  RiArrowUpSFill,
  RiArrowDownSFill,
  RiArrowLeftSLine,
  RiLineChartLine,
  RiPieChartLine,
  RiStackLine,
  RiBuildingLine,
} from "@remixicon/react";

import {
  getWorldStocksData,
  getWorldStockBySlug,
  getStockCandles,
  type WorldStock,
} from "@/lib/Data/worldStocksData";
import { generateStaticMetadata } from "@/lib/MetaData/generateStaticMetadata";
import WorldMarketChart from "@/components/Charts/WorldMarketChart";
import { WORLD_STOCKS_CONFIG } from "@/lib/Array/WorldCompanyList";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  return WORLD_STOCKS_CONFIG.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const config = WORLD_STOCKS_CONFIG.find((s) => s.slug === slug);
  if (!config) return { title: "شركة غير موجودة" };
  return generateStaticMetadata({
    title: `سهم ${config.nameAr} (${config.ticker})`,
    description: `تابع سعر سهم ${config.nameEn} مباشرة — السعر الحالي والتغيير اليومي ورأس المال السوقي.`,
    url: `/world-stocks/${slug}`,
  });
}

const formatter = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 2,
});

export const revalidate = 300;

export default async function WorldStockSlugPage({
  params,
}: {
  params: Params;
}) {
  const { slug } = await params;

  const [stock, candleData, allStocks] = await Promise.all([
    getWorldStockBySlug(slug),
    (async () => {
      const config = WORLD_STOCKS_CONFIG.find((s) => s.slug === slug);
      return config ? getStockCandles(config.ticker) : [];
    })(),
    getWorldStocksData(),
  ]);

  if (!stock) return notFound();

  const accentColor = stock.positive ? "#22c55e" : "var(--color-destructive)";
  const related = allStocks
    .filter((s) => s.sector === stock.sector && s.slug !== slug)
    .slice(0, 5);

  const stats = [
    { label: "رمز السهم", value: stock.ticker },
    { label: "البورصة", value: stock.exchange },
    { label: "القطاع", value: stock.sector },
    {
      label: "السعر الحالي",
      value: `$${stock.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    },
    {
      label: "التغيير",
      value: `${stock.positive ? "+" : ""}${stock.change.toFixed(2)}`,
    },
    {
      label: "نسبة التغيير",
      value: `${Math.abs(stock.changePercent).toFixed(2)}%`,
    },
    {
      label: "رأس المال السوقي",
      value:
        stock.marketCap > 0 ? `$${formatter.format(stock.marketCap)}` : "—",
    },
    {
      label: "حجم التداول",
      value: stock.volume > 0 ? formatter.format(stock.volume) : "—",
    },
  ];

  return (
    <main className="container mx-auto px-4 py-8 md:py-10 space-y-6" dir="rtl">
      {/* ── BREADCRUMB ── */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground font-bold">
        <Link
          href="/world-stocks"
          className="hover:text-primary-brand transition-colors"
        >
          الأسهم العالمية
        </Link>
        <RiArrowLeftSLine size={14} className="shrink-0" />
        <span className="text-foreground font-mono" dir="ltr">
          {stock.ticker}
        </span>
      </div>

      {/* ── HERO ── */}
      <div className="relative bg-card border border-border rounded-3xl p-5 md:p-8 overflow-hidden">
        <div
          className="absolute -top-16 -left-16 w-64 h-64 rounded-full blur-3xl opacity-5 pointer-events-none"
          style={{ backgroundColor: accentColor }}
        />
        <div className="absolute top-4 left-4 text-border/30 pointer-events-none">
          <RiBuildingLine size={100} />
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          {/* Identity */}
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-primary-brand/10 border border-primary-brand/20 flex items-center justify-center font-black text-primary-brand text-sm md:text-lg shrink-0"
              dir="ltr"
            >
              {stock.ticker.replace(/\..+/, "").slice(0, 3)}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl md:text-3xl m-0 font-black text-foreground tracking-tight leading-none">
                  {stock.nameAr}
                </h1>
                <span className="text-[10px] font-black text-muted-foreground bg-muted px-2 py-0.5 rounded-md border border-border font-mono">
                  {stock.exchange}
                </span>
              </div>
              <p
                className="text-xs text-muted-foreground font-bold tracking-wide mt-1"
                dir="ltr"
              >
                {stock.nameEn} · {stock.ticker}
              </p>
            </div>
          </div>

          {/* Price */}
          <div className="flex lg:flex-col items-center lg:items-end justify-between gap-2">
            <div className="flex items-center gap-2" dir="ltr">
              <span className="text-2xl md:text-4xl font-black text-foreground tabular-nums">
                $
                {stock.price.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
              <div
                className={`p-1 rounded-xl ${stock.positive ? "bg-green-500/10" : "bg-destructive/10"}`}
              >
                {stock.positive ? (
                  <RiArrowUpSFill size={24} className="text-green-500" />
                ) : (
                  <RiArrowDownSFill size={24} className="text-destructive" />
                )}
              </div>
            </div>

            <div
              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-sm font-black w-fit ${
                stock.positive
                  ? "bg-green-500/10 text-green-500"
                  : "bg-destructive/10 text-destructive"
              }`}
              dir="ltr"
            >
              {stock.positive ? (
                <RiArrowUpSFill size={16} />
              ) : (
                <RiArrowDownSFill size={16} />
              )}
              {stock.positive ? "+" : ""}
              {stock.change.toFixed(2)}
              <span className="opacity-60 text-xs">
                ({Math.abs(stock.changePercent).toFixed(2)}%)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── CHART ── */}
      <div className="bg-card border border-border rounded-3xl p-5 md:p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary-brand/10 flex items-center justify-center text-primary-brand">
              <RiLineChartLine size={15} />
            </div>
            <h2 className="text-sm md:text-base font-black text-foreground">
              أداء اليوم
            </h2>
          </div>
          <span
            className="text-[10px] font-black px-2.5 py-1 rounded-lg border"
            style={{
              color: accentColor,
              borderColor: `${accentColor}30`,
              backgroundColor: `${accentColor}10`,
            }}
          >
            {candleData.length > 0 ? "بيانات مباشرة" : "السوق مغلق"}
          </span>
        </div>
        <div className="h-48 sm:h-56 md:h-72 w-full">
          <WorldMarketChart
            data={candleData}
            isPositive={stock.positive}
            ticker={stock.ticker}
          />
        </div>
      </div>

      {/* ── STATS + SIDEBAR ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stats grid */}
        <div className="lg:col-span-2 bg-card border border-border rounded-3xl p-5 md:p-6">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-8 h-8 rounded-xl bg-primary-brand/10 flex items-center justify-center text-primary-brand">
              <RiPieChartLine size={15} />
            </div>
            <h2 className="text-sm md:text-base font-black text-foreground">
              بيانات السهم
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-muted/50 border border-border rounded-2xl p-4 space-y-1.5 hover:border-primary-brand/30 transition-colors group"
              >
                <span className="text-[10px] font-bold text-muted-foreground flex items-center gap-1.5 uppercase tracking-wide">
                  <RiStackLine size={11} />
                  {stat.label}
                </span>
                <span
                  className="text-xs md:text-sm font-black text-foreground tabular-nums group-hover:text-primary-brand transition-colors block break-all"
                  dir="ltr"
                >
                  {stat.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Related + back */}
        <div className="space-y-4">
          {/* Related stocks in same sector */}
          {related.length > 0 && (
            <div className="bg-card border border-border rounded-3xl p-5">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-xl bg-primary-brand/10 flex items-center justify-center text-primary-brand">
                  <RiBuildingLine size={15} />
                </div>
                <h2 className="text-sm font-black text-foreground">
                  أسهم مشابهة · {stock.sector}
                </h2>
              </div>

              <div className="space-y-1">
                {related.map((r: WorldStock) => (
                  <Link
                    key={r.id}
                    href={`/world-stocks/${r.slug}`}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-primary-brand/5 border border-transparent hover:border-primary-brand/20 transition-all group"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-black text-foreground group-hover:text-primary-brand transition-colors truncate">
                        {r.nameAr}
                      </p>
                      <p
                        className="text-[10px] text-right text-muted-foreground font-mono"
                        dir="ltr"
                      >
                        {r.ticker}
                      </p>
                    </div>
                    <div className="flex flex-col gap-1 shrink-0">
                      <span
                        className="text-xs font-black text-foreground tabular-nums"
                        dir="ltr"
                      >
                        $
                        {r.price.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                      <span
                        className={`inline-flex items-center gap-0.5 text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                          r.positive
                            ? "bg-green-500/10 text-green-500"
                            : "bg-destructive/10 text-destructive"
                        }`}
                        dir="ltr"
                      >
                        {r.positive ? (
                          <RiArrowUpSFill size={10} />
                        ) : (
                          <RiArrowDownSFill size={10} />
                        )}
                        {Math.abs(r.changePercent).toFixed(2)}%
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Back */}
          <Link
            href="/world-stocks"
            className="btn flex items-center justify-center gap-2 text-sm py-2.5 w-full"
          >
            <RiArrowLeftSLine size={16} />
            العودة للأسهم العالمية
          </Link>
        </div>
      </div>
    </main>
  );
}
