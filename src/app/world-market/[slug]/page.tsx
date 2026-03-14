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
  RiGlobalLine,
} from "@remixicon/react";

import {
  getWorldMarketData,
  getIndexCandles, // ← import instead of defining locally
  type WorldMarketItem,
} from "@/lib/Data/worldMarketData";
import { generateStaticMetadata } from "@/lib/MetaData/generateStaticMetadata";
import WorldMarketChart from "@/components/Charts/WorldMarketChart";
import { WORLD_INDICES } from "@/lib/Array/worldMarketList";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  return WORLD_INDICES.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const index = WORLD_INDICES.find((i) => i.slug === slug);
  if (!index) return { title: "مؤشر غير موجود | لوكوجي" };
  return generateStaticMetadata({
    title: `${index.title} — المؤشر العالمي`,
    description: `تابع أداء مؤشر ${index.titleEn} مباشرة — السعر الحالي والتغيير اليومي.`,
    url: `/world-market/${slug}`,
  });
}

export const revalidate = 300;

export default async function WorldMarketSlugPage({
  params,
}: {
  params: Params;
}) {
  const { slug } = await params;

  // Find static config
  const config = WORLD_INDICES.find((i) => i.slug === slug);
  if (!config) return notFound();

  // Fetch live data
  const [allIndices, candleData] = await Promise.all([
    getWorldMarketData(),
    getIndexCandles(config.ticker),
  ]);

  const item: WorldMarketItem | undefined = allIndices.find(
    (i) => i.slug === slug,
  );
  if (!item) return notFound();

  const accentColor = item.positive ? "#22c55e" : "var(--color-destructive)";
  const related = allIndices.filter((i) => i.slug !== slug).slice(0, 5);

  const stats = [
    { label: "رمز المؤشر", value: item.ticker },
    {
      label: "السعر الحالي",
      value: item.price.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    },
    {
      label: "التغيير",
      value: `${item.positive ? "+" : ""}${item.change.toFixed(2)}`,
    },
    {
      label: "نسبة التغيير",
      value: `${Math.abs(item.changePercent).toFixed(2)}%`,
    },
  ];

  return (
    <main className="container mx-auto px-4 py-8 md:py-10 space-y-6" dir="rtl">
      {/* ── BREADCRUMB ── */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground font-bold">
        <Link
          href="/world-market"
          className="hover:text-primary-brand transition-colors"
        >
          السوق العالمي
        </Link>
        <RiArrowLeftSLine size={14} className="shrink-0" />
        <span className="text-foreground font-mono">{item.ticker}</span>
      </div>

      {/* ── HERO ── */}
      <div className="relative bg-card border border-border rounded-3xl p-5 md:p-8 overflow-hidden">
        {/* Background glow */}
        <div
          className="absolute -top-16 -left-16 w-64 h-64 rounded-full blur-3xl opacity-5 pointer-events-none"
          style={{ backgroundColor: accentColor }}
        />
        <div className="absolute top-4 left-4 text-border/30 pointer-events-none">
          <RiGlobalLine size={100} />
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          {/* Identity */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-primary-brand/10 border border-primary-brand/20 flex items-center justify-center text-xl md:text-2xl font-black text-primary-brand shrink-0">
              {item.title[0]}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl md:text-3xl m-0 font-black text-foreground tracking-tight leading-none">
                  {item.title}
                </h1>
                <span className="text-[10px] font-black text-muted-foreground bg-muted px-2 py-0.5 rounded-md border border-border font-mono">
                  {item.ticker}
                </span>
              </div>
              <p className="text-xs text-muted-foreground font-bold tracking-widest mt-1">
                {item.titleEn}
              </p>
            </div>
          </div>

          {/* Price block */}
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2" dir="ltr">
              <span className="text-2xl md:text-4xl font-black text-foreground tabular-nums">
                {item.price.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
              <div
                className={`p-1 rounded-xl ${item.positive ? "bg-green-500/10" : "bg-destructive/10"}`}
              >
                {item.positive ? (
                  <RiArrowUpSFill size={24} className="text-green-500" />
                ) : (
                  <RiArrowDownSFill size={24} className="text-destructive" />
                )}
              </div>
            </div>

            <div
              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-sm font-black w-fit ${
                item.positive
                  ? "bg-green-500/10 text-green-500"
                  : "bg-destructive/10 text-destructive"
              }`}
              dir="ltr"
            >
              {item.positive ? (
                <RiArrowUpSFill size={16} />
              ) : (
                <RiArrowDownSFill size={16} />
              )}
              {item.positive ? "+" : ""}
              {item.change.toFixed(2)}
              <span className="opacity-60 text-xs">
                ({Math.abs(item.changePercent).toFixed(2)}%)
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
            isPositive={item.positive}
            ticker={item.ticker}
          />
        </div>
      </div>

      {/* ── STATS + SIDEBAR ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stats */}
        <div className="lg:col-span-2 bg-card border border-border rounded-3xl p-5 md:p-6">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-8 h-8 rounded-xl bg-primary-brand/10 flex items-center justify-center text-primary-brand">
              <RiPieChartLine size={15} />
            </div>
            <h2 className="text-sm md:text-base font-black text-foreground">
              بيانات المؤشر
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
                  className="text-sm md:text-base font-black text-foreground tabular-nums group-hover:text-primary-brand transition-colors block"
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
          {/* Related indices */}
          <div className="bg-card border border-border rounded-3xl p-5">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-xl bg-primary-brand/10 flex items-center justify-center text-primary-brand">
                <RiGlobalLine size={15} />
              </div>
              <h2 className="text-sm font-black text-foreground">
                مؤشرات أخرى
              </h2>
            </div>

            <div className="space-y-1">
              {related.map((r) => (
                <Link
                  key={r.id}
                  href={`/world-market/${r.slug}`}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-primary-brand/5 border border-transparent hover:border-primary-brand/20 transition-all group"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-black text-foreground group-hover:text-primary-brand transition-colors truncate">
                      {r.title}
                    </p>
                    <p
                      className="text-[10px] text-muted-foreground font-mono"
                      dir="ltr"
                    >
                      {r.ticker}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span
                      className="text-xs font-black text-foreground tabular-nums"
                      dir="ltr"
                    >
                      {r.price.toLocaleString("en-US", {
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

          {/* Back button */}
          <Link
            href="/world-market"
            className="btn flex items-center justify-center gap-2 text-sm py-2.5 w-full"
          >
            <RiArrowLeftSLine size={16} />
            العودة للسوق العالمي
          </Link>
        </div>
      </div>
    </main>
  );
}
