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
  getStockCandles,
  type WorldStock,
} from "@/lib/Data/worldStocksData";
import { generateStaticMetadata } from "@/lib/MetaData/generateStaticMetadata";
import WorldMarketChart from "@/components/Charts/WorldMarketChart";
import { WORLD_STOCKS_CONFIG } from "@/lib/Array/WorldCompanyList";
import { getJsonLdWorldStock } from "@/lib/Schemas/getJsonLd";

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

function buildStats(stock: WorldStock) {
  const currency = stock.currency ?? "USD";
  const fmt = (n: number, decimals = 2) =>
    n > 0
      ? n.toLocaleString(undefined, {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        })
      : "—";

  return [
    // ── Price data ──────────────────────────────────────────────────────────
    {
      group: "بيانات السعر",
      label: "سعر الافتتاح",
      value: stock.openPrice > 0 ? `${currency} ${fmt(stock.openPrice)}` : "—",
    },
    {
      group: "بيانات السعر",
      label: "أعلى سعر اليوم",
      value: stock.dayHigh > 0 ? `${currency} ${fmt(stock.dayHigh)}` : "—",
    },
    {
      group: "بيانات السعر",
      label: "أقل سعر اليوم",
      value: stock.dayLow > 0 ? `${currency} ${fmt(stock.dayLow)}` : "—",
    },
    {
      group: "بيانات السعر",
      label: "سعر الإغلاق السابق",
      value: stock.prevClose > 0 ? `${currency} ${fmt(stock.prevClose)}` : "—",
    },
    // ── Volume ──────────────────────────────────────────────────────────────
    {
      group: "التداول",
      label: "حجم التداول",
      value: stock.volume > 0 ? stock.volume.toLocaleString() : "—",
    },
    {
      group: "التداول",
      label: "متوسط حجم التداول",
      value: stock.avgVolume > 0 ? stock.avgVolume.toLocaleString() : "—",
    },
    {
      group: "التداول",
      label: "إجمالي القيمة المتداولة",
      value:
        stock.totalValue > 0 ? `$${formatter.format(stock.totalValue)}` : "—",
    },
    // ── 52-week ──────────────────────────────────────────────────────────────
    {
      group: "النطاق السنوي",
      label: "الأعلى سنوياً",
      value:
        stock.weekHigh52 > 0 ? `${currency} ${fmt(stock.weekHigh52)}` : "—",
    },
    {
      group: "النطاق السنوي",
      label: "الأدنى سنوياً",
      value: stock.weekLow52 > 0 ? `${currency} ${fmt(stock.weekLow52)}` : "—",
    },
    // ── Fundamentals ────────────────────────────────────────────────────────
    {
      group: "المؤشرات المالية",
      label: "القيمة السوقية",
      value:
        stock.marketCap > 0 ? `$${formatter.format(stock.marketCap)}` : "—",
    },
    {
      group: "المؤشرات المالية",
      label: "العائد على الأرباح",
      value:
        stock.dividendYield > 0 ? `${stock.dividendYield.toFixed(2)}%` : "—",
    },
    {
      group: "المؤشرات المالية",
      label: "العائد على السهم",
      value: stock.eps !== 0 ? `${currency} ${fmt(Math.abs(stock.eps))}` : "—",
    },
    {
      group: "المؤشرات المالية",
      label: "مكرر الأرباح (P/E)",
      value: stock.peRatio > 0 ? `${fmt(stock.peRatio)}x` : "—",
    },
    // ── Info ─────────────────────────────────────────────────────────────────
    { group: "معلومات", label: "رمز التداول", value: stock.ticker },
    {
      group: "معلومات",
      label: "البورصة",
      value: `${stock.exchange} · ${currency}`,
    },
    { group: "معلومات", label: "القطاع", value: stock.sector },
  ];
}

export default async function WorldStockSlugPage({
  params,
}: {
  params: Params;
}) {
  const { slug } = await params;

  const [allStocks, candleData] = await Promise.all([
    getWorldStocksData(),
    (async () => {
      const config = WORLD_STOCKS_CONFIG.find((s) => s.slug === slug);
      return config ? getStockCandles(config.ticker) : [];
    })(),
  ]);

  const stock = allStocks.find((s) => s.slug === slug) ?? null;
  if (!stock) return notFound();

  const accentColor = stock.positive ? "#22c55e" : "var(--color-destructive)";
  const related = allStocks
    .filter((s) => s.sector === stock.sector && s.slug !== slug)
    .slice(0, 5);
  const stats = buildStats(stock);

  return (
    <>
      <main
        className="container mx-auto px-4 py-8 md:py-10 space-y-6"
        dir="rtl"
      >
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
            <div className="flex gap-4">
              <div
                className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-primary-brand/10 border border-primary-brand/20 flex items-center justify-center font-black text-primary-brand text-sm md:text-lg shrink-0"
                dir="ltr"
              >
                {stock.ticker.replace(/\..+/, "").slice(0, 3)}
              </div>
              <div className="flex flex-col items-start">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl md:text-3xl m-0 font-black text-foreground tracking-tight leading-none">
                    {stock.nameAr}
                  </h1>
                  <span className="text-[10px] font-black text-muted-foreground bg-muted px-2 py-0.5 rounded-md border border-border font-mono">
                    {stock.exchange}
                  </span>
                </div>
                <p
                  className="text-xs text-left text-muted-foreground font-bold tracking-wide mt-1"
                  dir="ltr"
                >
                  {stock.nameEn} · {stock.ticker}
                </p>
              </div>
            </div>

            <div className="flex lg:flex-col items-center lg:items-end flex-wrap justify-between gap-2">
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
          {/* ── STATS ── */}
          <div className="lg:col-span-2 bg-card border border-border rounded-3xl p-5 md:p-6">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 rounded-xl bg-primary-brand/10 flex items-center justify-center text-primary-brand">
                <RiPieChartLine size={15} />
              </div>
              <h2 className="text-sm md:text-base font-black text-foreground">
                بيانات السهم
              </h2>
            </div>

            {/* Group stats by category */}
            {[
              "بيانات السعر",
              "التداول",
              "النطاق السنوي",
              "المؤشرات المالية",
              "معلومات",
            ].map((group) => {
              const groupStats = stats.filter((s) => s.group === group);
              return (
                <div key={group} className="mb-5 last:mb-0">
                  <p className="text-[10px] font-black text-primary-brand uppercase tracking-widest mb-2 border-b border-border pb-1">
                    {group}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {groupStats.map((stat) => (
                      <div
                        key={stat.label}
                        className="bg-muted/50 border border-border rounded-2xl p-3 space-y-1 hover:border-primary-brand/30 transition-colors group"
                      >
                        <span className="text-[10px] font-bold text-muted-foreground flex items-center gap-1 uppercase tracking-wide">
                          <RiStackLine size={10} />
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
              );
            })}

            {/* ── 52-week range bar ── */}
            {stock.weekHigh52 > 0 &&
              stock.weekLow52 > 0 &&
              stock.weekHigh52 !== stock.weekLow52 && (
                <div className="mt-4 bg-muted/50 border border-border rounded-2xl p-4 space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                    <span>النطاق السنوي</span>
                    <span dir="ltr">
                      {stock.weekLow52.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })}
                      {" — "}
                      {stock.weekHigh52.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="absolute top-0 left-0 h-full bg-primary-brand/30 rounded-full"
                      style={{
                        width: `${Math.min(Math.max(((stock.price - stock.weekLow52) / (stock.weekHigh52 - stock.weekLow52)) * 100, 0), 100)}%`,
                      }}
                    />
                    <div
                      className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary-brand border-2 border-card shadow"
                      style={{
                        left: `calc(${Math.min(Math.max(((stock.price - stock.weekLow52) / (stock.weekHigh52 - stock.weekLow52)) * 100, 0), 100)}% - 6px)`,
                      }}
                    />
                  </div>
                  <div
                    className="flex justify-between text-[10px] text-muted-foreground font-bold"
                    dir="ltr"
                  >
                    <span>
                      أدنى $
                      {stock.weekLow52.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })}
                    </span>
                    <span className="text-primary-brand font-black">
                      $
                      {stock.price.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })}
                    </span>
                    <span>
                      أعلى $
                      {stock.weekHigh52.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                </div>
              )}
          </div>

          <div className="space-y-4">
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
                  {related.map(
                    (
                      r, // ← single clean map, no type annotation
                    ) => (
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
                    ),
                  )}
                </div>
              </div>
            )}

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
      {/* ── JSON-LD ── */}
      <script
        type="application/ld+json"
        id="world-stock-schema"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getJsonLdWorldStock(stock)),
        }}
      />
    </>
  );
}
